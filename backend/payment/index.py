"""
Создание и проверка платежей через ЮКассу.
"""
import json
import os
import uuid
import base64
import psycopg2
import urllib.request
import urllib.error
import traceback

SCHEMA = "t_p14924622_quantum_leap_initiat"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    "Content-Type": "application/json",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def yookassa_request(method: str, path: str, body: dict = None) -> dict:
    shop_id = os.environ["YOOKASSA_SHOP_ID"]
    secret_key = os.environ["YOOKASSA_SECRET_KEY"]
    credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()

    url = f"https://api.yookassa.ru/v3{path}"
    headers = {
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json",
    }

    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def get_user_by_token(token: str):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, email FROM {SCHEMA}.users WHERE session_token = %s", (token,)
    )
    row = cur.fetchone()
    conn.close()
    return {"id": row[0], "email": row[1]} if row else None


def handler(event: dict, context) -> dict:
    """Создание платежа и проверка статуса через ЮКассу."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod")
    path = event.get("path", "/")
    token = event.get("headers", {}).get("X-Session-Token")

    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    user = get_user_by_token(token)
    if not user:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия не найдена"})}

    # POST — создать платёж
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        amount = body.get("amount")
        return_url = body.get("return_url", "https://poehali.dev")

        if not amount or float(amount) < 100:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Минимальная сумма 100 ₽"})}

        idempotence_key = str(uuid.uuid4())
        payment_body = {
            "amount": {"value": f"{float(amount):.2f}", "currency": "RUB"},
            "confirmation": {"type": "redirect", "return_url": return_url},
            "capture": True,
            "description": f"Пополнение баланса пользователя {user['email']}",
            "metadata": {"user_id": str(user["id"])},
        }

        shop_id = os.environ["YOOKASSA_SHOP_ID"]
        secret_key = os.environ["YOOKASSA_SECRET_KEY"]
        credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()
        print(f"Using shop_id: {shop_id}")

        req = urllib.request.Request(
            "https://api.yookassa.ru/v3/payments",
            data=json.dumps(payment_body).encode(),
            headers={
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/json",
                "Idempotence-Key": idempotence_key,
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()
            print(f"YooKassa error {e.code}: {err_body}")
            return {"statusCode": 502, "headers": CORS, "body": json.dumps({"error": f"Ошибка ЮКассы: {err_body}"})}

        payment_id = result["id"]
        confirmation_url = result["confirmation"]["confirmation_url"]

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.payments (user_id, payment_id, amount, status)
                VALUES (%s, %s, %s, 'pending')""",
            (user["id"], payment_id, float(amount)),
        )
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"payment_id": payment_id, "confirmation_url": confirmation_url}),
        }

    # GET ?payment_id=xxx — проверить статус
    if method == "GET":
        payment_id = event.get("queryStringParameters", {}).get("payment_id")
        if not payment_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "payment_id обязателен"})}

        result = yookassa_request("GET", f"/payments/{payment_id}")
        status = result.get("status")

        if status == "succeeded":
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"SELECT status FROM {SCHEMA}.payments WHERE payment_id = %s", (payment_id,)
            )
            row = cur.fetchone()

            if row and row[0] != "succeeded":
                amount = float(result["amount"]["value"])
                cur.execute(
                    f"UPDATE {SCHEMA}.payments SET status = 'succeeded' WHERE payment_id = %s",
                    (payment_id,),
                )
                cur.execute(
                    f"UPDATE {SCHEMA}.users SET balance = balance + %s WHERE id = %s",
                    (amount, user["id"]),
                )
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.transactions (user_id, type, amount, description)
                        VALUES (%s, 'deposit', %s, 'Пополнение через ЮКассу')""",
                    (user["id"], amount),
                )
                conn.commit()
            conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"status": status, "payment_id": payment_id}),
        }

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}