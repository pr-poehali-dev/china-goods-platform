import json
import os
import hashlib
import secrets
import psycopg2

S = os.environ.get('MAIN_DB_SCHEMA', 'public')

def handler(event: dict, context) -> dict:
    """
    Админ-панель ChinaCarts: управление поставщиками и товарами.
    Вход по паролю из секрета ADMIN_PASSWORD, сессия через токен в localStorage.
    """
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Access-Control-Max-Age': '86400',
    }
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    body = json.loads(event.get('body') or '{}')

    def respond(status, data):
        cur.close()
        conn.close()
        return {'statusCode': status, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(data, default=str)}

    def auth_admin():
        token = (event.get('headers') or {}).get('X-Admin-Token') or (event.get('headers') or {}).get('x-admin-token')
        if not token:
            return False
        admin_pw = os.environ.get('ADMIN_PASSWORD', '')
        expected = hashlib.sha256(('admin:' + admin_pw).encode()).hexdigest()
        return token == expected

    # Вход
    if action == 'login':
        password = body.get('password') or ''
        admin_pw = os.environ.get('ADMIN_PASSWORD', '')
        if not admin_pw or password != admin_pw:
            return respond(401, {'error': 'Неверный пароль'})
        token = hashlib.sha256(('admin:' + admin_pw).encode()).hexdigest()
        return respond(200, {'token': token})

    # Все дальнейшие запросы требуют авторизации
    if not auth_admin():
        return respond(401, {'error': 'Требуется авторизация'})

    # Список всех поставщиков с товарами
    if method == 'GET' and action == 'sellers':
        cur.execute(f"SELECT id, email, company_name, wechat_id, phone, description, avatar_url, city, created_at FROM {S}.sellers ORDER BY created_at DESC")
        sellers = []
        for r in cur.fetchall():
            sid = r[0]
            cur.execute(f"SELECT id, title, price, description, image_url, category, min_order, size, color, stock FROM {S}.seller_products WHERE seller_id = {sid} ORDER BY created_at DESC")
            products = [{'id': p[0], 'title': p[1], 'price': p[2], 'description': p[3], 'image_url': p[4],
                         'category': p[5], 'min_order': p[6], 'size': p[7], 'color': p[8], 'stock': p[9]} for p in cur.fetchall()]
            sellers.append({'id': sid, 'email': r[1], 'company_name': r[2], 'wechat_id': r[3],
                            'phone': r[4], 'description': r[5], 'avatar_url': r[6], 'city': r[7],
                            'created_at': str(r[8]), 'products': products})
        return respond(200, {'sellers': sellers})

    # Создать поставщика
    if method == 'POST' and action == 'create_seller':
        email = (body.get('email') or '').strip().lower().replace("'", "''")
        company = (body.get('company_name') or '').strip().replace("'", "''")
        password = body.get('password') or secrets.token_hex(8)
        wechat = (body.get('wechat_id') or '').replace("'", "''")
        phone = (body.get('phone') or '').replace("'", "''")
        description = (body.get('description') or '').replace("'", "''")
        city = (body.get('city') or '').replace("'", "''")
        avatar_url = (body.get('avatar_url') or '').replace("'", "''")
        if not email or not company:
            return respond(400, {'error': 'Укажите email и название компании'})
        cur.execute(f"SELECT id FROM {S}.sellers WHERE email = '{email}'")
        if cur.fetchone():
            return respond(409, {'error': 'Поставщик с таким email уже существует'})
        pw_hash = hashlib.sha256(password.encode()).hexdigest()
        token = secrets.token_hex(24)
        cur.execute(
            f"INSERT INTO {S}.sellers (email, password_hash, company_name, wechat_id, phone, description, avatar_url, city, auth_token) "
            f"VALUES ('{email}', '{pw_hash}', '{company}', '{wechat}', '{phone}', '{description}', '{avatar_url}', '{city}', '{token}') RETURNING id"
        )
        sid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'id': sid, 'password': password})

    # Обновить поставщика
    if method == 'PUT' and action == 'update_seller':
        sid = int(body.get('id') or 0)
        if not sid:
            return respond(400, {'error': 'Нет id'})
        fields = []
        for key in ['company_name', 'wechat_id', 'phone', 'description', 'avatar_url', 'city', 'email']:
            if key in body:
                val = (body[key] or '').replace("'", "''")
                fields.append(f"{key} = '{val}'")
        if fields:
            cur.execute(f"UPDATE {S}.sellers SET {', '.join(fields)} WHERE id = {sid}")
            conn.commit()
        return respond(200, {'ok': True})

    # Удалить поставщика
    if method == 'POST' and action == 'delete_seller':
        sid = int(body.get('id') or 0)
        if not sid:
            return respond(400, {'error': 'Нет id'})
        cur.execute(f"UPDATE {S}.sellers SET auth_token = NULL WHERE id = {sid}")
        conn.commit()
        return respond(200, {'ok': True})

    # Добавить товар поставщику
    if method == 'POST' and action == 'create_product':
        sid = int(body.get('seller_id') or 0)
        title = (body.get('title') or '').strip().replace("'", "''")
        if not sid or not title:
            return respond(400, {'error': 'Укажите seller_id и title'})
        price = (body.get('price') or '').replace("'", "''")
        desc = (body.get('description') or '').replace("'", "''")
        img = (body.get('image_url') or '').replace("'", "''")
        category = (body.get('category') or '').replace("'", "''")
        min_order = (body.get('min_order') or '').replace("'", "''")
        size = (body.get('size') or '').replace("'", "''")
        color = (body.get('color') or '').replace("'", "''")
        stock = (body.get('stock') or '').replace("'", "''")
        cur.execute(
            f"INSERT INTO {S}.seller_products (seller_id, title, price, description, image_url, category, min_order, size, color, stock) "
            f"VALUES ({sid}, '{title}', '{price}', '{desc}', '{img}', '{category}', '{min_order}', '{size}', '{color}', '{stock}') RETURNING id"
        )
        pid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'id': pid})

    # Обновить товар
    if method == 'PUT' and action == 'update_product':
        pid = int(body.get('id') or 0)
        if not pid:
            return respond(400, {'error': 'Нет id'})
        fields = []
        for key in ['title', 'price', 'description', 'image_url', 'category', 'min_order', 'size', 'color', 'stock']:
            if key in body:
                val = (body[key] or '').replace("'", "''")
                fields.append(f"{key} = '{val}'")
        if fields:
            cur.execute(f"UPDATE {S}.seller_products SET {', '.join(fields)} WHERE id = {pid}")
            conn.commit()
        return respond(200, {'ok': True})

    # Удалить товар
    if method == 'POST' and action == 'delete_product':
        pid = int(body.get('id') or 0)
        if not pid:
            return respond(400, {'error': 'Нет id'})
        cur.execute(f"UPDATE {S}.seller_products SET title = title WHERE id = {pid}")
        cur.execute(f"DELETE FROM {S}.product_reviews WHERE product_id = {pid}")
        cur.execute(f"DELETE FROM {S}.seller_products WHERE id = {pid}")
        conn.commit()
        return respond(200, {'ok': True})

    return respond(404, {'error': 'Неизвестное действие'})
