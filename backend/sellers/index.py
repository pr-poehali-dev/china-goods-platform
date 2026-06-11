import json
import os
import hashlib
import secrets
import psycopg2

def handler(event: dict, context) -> dict:
    '''
    API кабинета поставщиков WeChat: регистрация, вход, профиль и публичный список продавцов.
    Args: event с httpMethod, body, headers, queryStringParameters; context с request_id
    Returns: HTTP response с данными поставщиков в JSON
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    def respond(status, data):
        cur.close()
        conn.close()
        return {'statusCode': status, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(data, default=str)}

    def hash_pw(pw):
        return hashlib.sha256(pw.encode()).hexdigest()

    def auth_seller():
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        if not token:
            return None
        safe = token.replace("'", "''")
        cur.execute(f"SELECT id FROM sellers WHERE auth_token = '{safe}'")
        row = cur.fetchone()
        return row[0] if row else None

    body = json.loads(event.get('body') or '{}')

    # Публичный список поставщиков с товарами и видео
    if method == 'GET' and action == 'list':
        cur.execute("SELECT id, company_name, wechat_id, phone, description, avatar_url, city FROM sellers ORDER BY created_at DESC")
        sellers = []
        for r in cur.fetchall():
            sid = r[0]
            cur.execute(f"SELECT id, title, price, description, image_url, category, min_order, size, color, stock FROM seller_products WHERE seller_id = {sid} ORDER BY created_at DESC")
            products = [{'id': p[0], 'title': p[1], 'price': p[2], 'description': p[3], 'image_url': p[4],
                         'category': p[5], 'min_order': p[6], 'size': p[7], 'color': p[8], 'stock': p[9]} for p in cur.fetchall()]
            cur.execute(f"SELECT id, title, video_url FROM seller_videos WHERE seller_id = {sid} ORDER BY created_at DESC")
            videos = [{'id': v[0], 'title': v[1], 'video_url': v[2]} for v in cur.fetchall()]
            sellers.append({'id': sid, 'company_name': r[1], 'wechat_id': r[2], 'phone': r[3],
                            'description': r[4], 'avatar_url': r[5], 'city': r[6],
                            'products': products, 'videos': videos})
        return respond(200, {'sellers': sellers})

    # Каталог всех товаров (для страницы /products)
    if method == 'GET' and action == 'products':
        search = (params.get('q') or '').strip().lower()
        category = (params.get('category') or '').strip()
        cur.execute("""
            SELECT sp.id, sp.title, sp.price, sp.description, sp.image_url,
                   sp.category, sp.min_order, sp.size, sp.color, sp.stock,
                   sp.created_at, s.id, s.company_name, s.avatar_url, s.city
            FROM seller_products sp
            JOIN sellers s ON s.id = sp.seller_id
            ORDER BY sp.created_at DESC
        """)
        rows = cur.fetchall()
        products = []
        for p in rows:
            if search and search not in (p[1] or '').lower() and search not in (p[2] or '').lower() and search not in (p[5] or '').lower():
                continue
            if category and (p[5] or '') != category:
                continue
            cur.execute(f"SELECT id, author_name, rating, text, created_at FROM product_reviews WHERE product_id = {p[0]} ORDER BY created_at DESC")
            reviews = [{'id': r[0], 'author_name': r[1], 'rating': r[2], 'text': r[3], 'created_at': str(r[4])} for r in cur.fetchall()]
            avg_rating = round(sum(r['rating'] for r in reviews) / len(reviews), 1) if reviews else None
            products.append({
                'id': p[0], 'title': p[1], 'price': p[2], 'description': p[3], 'image_url': p[4],
                'category': p[5], 'min_order': p[6], 'size': p[7], 'color': p[8], 'stock': p[9],
                'seller': {'id': p[11], 'company_name': p[12], 'avatar_url': p[13], 'city': p[14]},
                'reviews': reviews, 'avg_rating': avg_rating
            })
        return respond(200, {'products': products})

    # Добавить отзыв к товару
    if method == 'POST' and action == 'add_review':
        body = json.loads(event.get('body') or '{}')
        product_id = int(body.get('product_id') or 0)
        author = (body.get('author_name') or 'Аноним').strip().replace("'", "''")
        rating = int(body.get('rating') or 5)
        text = (body.get('text') or '').strip().replace("'", "''")
        if not product_id or rating < 1 or rating > 5:
            return respond(400, {'error': 'Неверные данные'})
        cur.execute(f"INSERT INTO product_reviews (product_id, author_name, rating, text) VALUES ({product_id}, '{author}', {rating}, '{text}') RETURNING id")
        rid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'id': rid})

    # Регистрация
    if method == 'POST' and action == 'register':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        company = (body.get('company_name') or '').strip()
        if not email or not password or not company:
            return respond(400, {'error': 'Заполните email, пароль и название компании'})
        safe_email = email.replace("'", "''")
        cur.execute(f"SELECT id FROM sellers WHERE email = '{safe_email}'")
        if cur.fetchone():
            return respond(409, {'error': 'Поставщик с таким email уже зарегистрирован'})
        token = secrets.token_hex(24)
        ph = hash_pw(password)
        safe_company = company.replace("'", "''")
        cur.execute(
            f"INSERT INTO sellers (email, password_hash, company_name, auth_token) "
            f"VALUES ('{safe_email}', '{ph}', '{safe_company}', '{token}') RETURNING id"
        )
        sid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'token': token, 'seller': {'id': sid, 'email': email, 'company_name': company}})

    # Вход
    if method == 'POST' and action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        safe_email = email.replace("'", "''")
        ph = hash_pw(password)
        cur.execute(f"SELECT id, company_name FROM sellers WHERE email = '{safe_email}' AND password_hash = '{ph}'")
        row = cur.fetchone()
        if not row:
            return respond(401, {'error': 'Неверный email или пароль'})
        token = secrets.token_hex(24)
        cur.execute(f"UPDATE sellers SET auth_token = '{token}' WHERE id = {row[0]}")
        conn.commit()
        return respond(200, {'token': token, 'seller': {'id': row[0], 'email': email, 'company_name': row[1]}})

    # Получить свой профиль
    if method == 'GET' and action == 'me':
        sid = auth_seller()
        if not sid:
            return respond(401, {'error': 'Требуется вход'})
        cur.execute(f"SELECT id, email, company_name, wechat_id, phone, description, avatar_url, city FROM sellers WHERE id = {sid}")
        r = cur.fetchone()
        cur.execute(f"SELECT id, title, price, description, image_url, category, min_order, size, color, stock FROM seller_products WHERE seller_id = {sid} ORDER BY created_at DESC")
        products = [{'id': p[0], 'title': p[1], 'price': p[2], 'description': p[3], 'image_url': p[4],
                     'category': p[5], 'min_order': p[6], 'size': p[7], 'color': p[8], 'stock': p[9]} for p in cur.fetchall()]
        cur.execute(f"SELECT id, title, video_url FROM seller_videos WHERE seller_id = {sid} ORDER BY created_at DESC")
        videos = [{'id': v[0], 'title': v[1], 'video_url': v[2]} for v in cur.fetchall()]
        return respond(200, {'seller': {'id': r[0], 'email': r[1], 'company_name': r[2], 'wechat_id': r[3],
                                        'phone': r[4], 'description': r[5], 'avatar_url': r[6], 'city': r[7],
                                        'products': products, 'videos': videos}})

    # Обновить профиль
    if method == 'PUT' and action == 'profile':
        sid = auth_seller()
        if not sid:
            return respond(401, {'error': 'Требуется вход'})
        fields = []
        for key in ['company_name', 'wechat_id', 'phone', 'description', 'avatar_url', 'city']:
            if key in body:
                val = (body.get(key) or '').replace("'", "''")
                fields.append(f"{key} = '{val}'")
        if fields:
            cur.execute(f"UPDATE sellers SET {', '.join(fields)} WHERE id = {sid}")
            conn.commit()
        return respond(200, {'success': True})

    return respond(404, {'error': 'Неизвестное действие'})