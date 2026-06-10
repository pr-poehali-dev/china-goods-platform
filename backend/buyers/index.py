import json
import os
import hashlib
import secrets
import psycopg2

def handler(event: dict, context) -> dict:
    '''
    API аккаунтов покупателей: регистрация, вход, получение профиля.
    Args: event с httpMethod, body, headers, queryStringParameters; context с request_id
    Returns: HTTP response с данными покупателя и токеном в JSON
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Buyer-Auth',
        'Access-Control-Max-Age': '86400',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    headers = event.get('headers', {})

    def respond(status, data):
        cur.close()
        conn.close()
        return {'statusCode': status, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(data, default=str)}

    def hash_pw(pw):
        return hashlib.sha256(pw.encode()).hexdigest()

    def auth_buyer():
        token = headers.get('X-Buyer-Auth') or headers.get('x-buyer-auth')
        if not token:
            return None
        safe = token.replace("'", "''")
        cur.execute(f"SELECT id, email, name, phone FROM buyers WHERE auth_token = '{safe}'")
        return cur.fetchone()

    body = json.loads(event.get('body') or '{}')

    # Регистрация покупателя
    if method == 'POST' and action == 'register':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        name = (body.get('name') or '').strip()
        if not email or not password or not name:
            return respond(400, {'error': 'Заполните имя, email и пароль'})
        safe_email = email.replace("'", "''")
        cur.execute(f"SELECT id FROM buyers WHERE email = '{safe_email}'")
        if cur.fetchone():
            return respond(409, {'error': 'Пользователь с таким email уже зарегистрирован'})
        token = secrets.token_hex(24)
        ph = hash_pw(password)
        safe_name = name.replace("'", "''")
        safe_phone = (body.get('phone') or '').replace("'", "''")
        cur.execute(
            f"INSERT INTO buyers (email, password_hash, name, phone, auth_token) "
            f"VALUES ('{safe_email}', '{ph}', '{safe_name}', '{safe_phone}', '{token}') RETURNING id"
        )
        bid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'token': token, 'buyer': {'id': bid, 'email': email, 'name': name, 'phone': body.get('phone') or ''}})

    # Вход покупателя
    if method == 'POST' and action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        safe_email = email.replace("'", "''")
        ph = hash_pw(password)
        cur.execute(f"SELECT id, name, phone FROM buyers WHERE email = '{safe_email}' AND password_hash = '{ph}'")
        row = cur.fetchone()
        if not row:
            return respond(401, {'error': 'Неверный email или пароль'})
        token = secrets.token_hex(24)
        cur.execute(f"UPDATE buyers SET auth_token = '{token}' WHERE id = {row[0]}")
        conn.commit()
        return respond(200, {'token': token, 'buyer': {'id': row[0], 'email': email, 'name': row[1], 'phone': row[2] or ''}})

    # Текущий профиль
    if method == 'GET' and action == 'me':
        b = auth_buyer()
        if not b:
            return respond(401, {'error': 'Требуется вход'})
        return respond(200, {'buyer': {'id': b[0], 'email': b[1], 'name': b[2], 'phone': b[3] or ''}})

    return respond(404, {'error': 'Неизвестное действие'})
