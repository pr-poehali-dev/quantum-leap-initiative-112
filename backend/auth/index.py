"""
Авторизация пользователей: регистрация и вход по email/паролю.
"""
import json
import os
import hashlib
import secrets
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


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def make_referral_code(length=8) -> str:
    return secrets.token_hex(length // 2).upper()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")  # "register" | "login"

    if action == "register":
        name = (body.get("name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not name or not email or len(password) < 8:
            return {
                "statusCode": 400,
                "headers": CORS,
                "body": json.dumps({"error": "Заполните все поля. Пароль минимум 8 символов."}),
            }

        password_hash = hash_password(password)
        referral_code = make_referral_code()
        session_token = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id FROM {SCHEMA}.users WHERE email = %s",
            (email,)
        )
        if cur.fetchone():
            conn.close()
            return {
                "statusCode": 409,
                "headers": CORS,
                "body": json.dumps({"error": "Пользователь с таким email уже существует."}),
            }

        cur.execute(
            f"""INSERT INTO {SCHEMA}.users (name, email, password_hash, referral_code, session_token)
                VALUES (%s, %s, %s, %s, %s) RETURNING id, name, email, balance, referral_code""",
            (name, email, password_hash, referral_code, session_token)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({
                "ok": True,
                "session_token": session_token,
                "user": {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "balance": float(row[3]),
                    "referral_code": row[4],
                }
            }),
        }

    if action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return {
                "statusCode": 400,
                "headers": CORS,
                "body": json.dumps({"error": "Введите email и пароль."}),
            }

        password_hash = hash_password(password)
        session_token = secrets.token_hex(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT id, name, email, balance, referral_code
                FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s""",
            (email, password_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {
                "statusCode": 401,
                "headers": CORS,
                "body": json.dumps({"error": "Неверный email или пароль."}),
            }

        cur.execute(
            f"UPDATE {SCHEMA}.users SET session_token = %s WHERE id = %s",
            (session_token, row[0])
        )
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({
                "ok": True,
                "session_token": session_token,
                "user": {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "balance": float(row[3]),
                    "referral_code": row[4],
                }
            }),
        }

    return {
        "statusCode": 400,
        "headers": CORS,
        "body": json.dumps({"error": "Неизвестное действие."}),
    }