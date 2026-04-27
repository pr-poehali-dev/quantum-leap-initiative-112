"""
Получение данных текущего пользователя по session_token.
"""
import json
import os
import psycopg2

SCHEMA = "t_p14924622_quantum_leap_initiat"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
    "Content-Type": "application/json",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = (event.get("headers") or {}).get("X-Session-Token", "")
    if not token:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, name, email, balance, referral_code, created_at FROM {SCHEMA}.users WHERE session_token = %s",
        (token,)
    )
    row = cur.fetchone()

    if not row:
        conn.close()
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия не найдена"})}

    user_id = row[0]

    cur.execute(
        f"""SELECT type, amount, description, created_at
            FROM {SCHEMA}.transactions
            WHERE user_id = %s ORDER BY created_at DESC LIMIT 20""",
        (user_id,)
    )
    txns = cur.fetchall()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "user": {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "balance": float(row[3]),
                "referral_code": row[4],
                "created_at": str(row[5]),
            },
            "transactions": [
                {
                    "type": t[0],
                    "amount": float(t[1]),
                    "description": t[2],
                    "created_at": str(t[3]),
                }
                for t in txns
            ]
        }),
    }
