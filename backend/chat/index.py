import json
import os
import secrets
import urllib.request
import urllib.parse
import psycopg2

def detect_lang(text: str) -> str:
    '''Определяет язык: zh если есть китайские иероглифы, иначе ru'''
    for ch in text:
        if '\u4e00' <= ch <= '\u9fff':
            return 'zh-CN'
    return 'ru'

def translate(text: str, source: str, target: str) -> str:
    '''Переводит текст через бесплатный Google Translate endpoint'''
    if not text.strip():
        return ''
    try:
        params = urllib.parse.urlencode({
            'client': 'gtx', 'sl': source, 'tl': target, 'dt': 't', 'q': text
        })
        url = f'https://translate.googleapis.com/translate_a/single?{params}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        return ''.join(seg[0] for seg in data[0] if seg[0])
    except Exception:
        return ''

def handler(event: dict, context) -> dict:
    '''
    API чата покупатель-поставщик с авто-переводом RU<->ZH.
    Args: event с httpMethod, body, headers, queryStringParameters; context с request_id
    Returns: HTTP response с тредами и сообщениями в JSON
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Buyer-Token',
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

    def get_seller_id():
        token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
        if not token:
            return None
        safe = token.replace("'", "''")
        cur.execute(f"SELECT id FROM sellers WHERE auth_token = '{safe}'")
        row = cur.fetchone()
        return row[0] if row else None

    def thread_to_dict(r):
        return {'id': r[0], 'seller_id': r[1], 'buyer_name': r[2], 'buyer_contact': r[3],
                'last_message_at': r[4]}

    def load_messages(thread_id):
        cur.execute(
            f"SELECT id, sender, text_original, text_translated, lang_original, created_at "
            f"FROM chat_messages WHERE thread_id = {thread_id} ORDER BY created_at ASC"
        )
        return [{'id': m[0], 'sender': m[1], 'text_original': m[2], 'text_translated': m[3],
                 'lang_original': m[4], 'created_at': m[5]} for m in cur.fetchall()]

    body = json.loads(event.get('body') or '{}')

    # Покупатель начинает чат / отправляет сообщение
    if method == 'POST' and action == 'send':
        seller_id = body.get('seller_id')
        buyer_token = (headers.get('X-Buyer-Token') or headers.get('x-buyer-token') or '').strip()
        text = (body.get('text') or '').strip()
        if not text:
            return respond(400, {'error': 'Пустое сообщение'})

        sender = 'seller' if get_seller_id() else 'buyer'

        if sender == 'buyer':
            if not seller_id:
                return respond(400, {'error': 'Не указан поставщик'})
            if not buyer_token:
                buyer_token = secrets.token_hex(16)
            safe_token = buyer_token.replace("'", "''")
            # ищем существующий тред
            cur.execute(f"SELECT id FROM chat_threads WHERE seller_id = {int(seller_id)} AND buyer_token = '{safe_token}'")
            row = cur.fetchone()
            if row:
                thread_id = row[0]
            else:
                bname = (body.get('buyer_name') or 'Покупатель').replace("'", "''")
                bcontact = (body.get('buyer_contact') or '').replace("'", "''")
                cur.execute(
                    f"INSERT INTO chat_threads (seller_id, buyer_name, buyer_contact, buyer_token) "
                    f"VALUES ({int(seller_id)}, '{bname}', '{bcontact}', '{safe_token}') RETURNING id"
                )
                thread_id = cur.fetchone()[0]
        else:
            sid = get_seller_id()
            thread_id = body.get('thread_id')
            if not thread_id:
                return respond(400, {'error': 'Не указан чат'})
            cur.execute(f"SELECT id FROM chat_threads WHERE id = {int(thread_id)} AND seller_id = {sid}")
            if not cur.fetchone():
                return respond(403, {'error': 'Нет доступа к чату'})
            thread_id = int(thread_id)

        # Перевод: покупатель пишет ru -> zh, продавец пишет zh -> ru (с автоопределением)
        lang_src = detect_lang(text)
        lang_tgt = 'zh-CN' if lang_src == 'ru' else 'ru'
        translated = translate(text, lang_src, lang_tgt)

        safe_orig = text.replace("'", "''")
        safe_trans = (translated or '').replace("'", "''")
        cur.execute(
            f"INSERT INTO chat_messages (thread_id, sender, text_original, text_translated, lang_original, lang_translated) "
            f"VALUES ({thread_id}, '{sender}', '{safe_orig}', '{safe_trans}', '{lang_src}', '{lang_tgt}')"
        )
        cur.execute(f"UPDATE chat_threads SET last_message_at = CURRENT_TIMESTAMP WHERE id = {thread_id}")
        conn.commit()
        return respond(200, {'thread_id': thread_id, 'buyer_token': buyer_token, 'messages': load_messages(thread_id)})

    # Покупатель получает свои сообщения
    if method == 'GET' and action == 'buyer_thread':
        buyer_token = (headers.get('X-Buyer-Token') or headers.get('x-buyer-token') or '').strip()
        seller_id = params.get('seller_id')
        if not buyer_token or not seller_id:
            return respond(200, {'messages': []})
        safe_token = buyer_token.replace("'", "''")
        cur.execute(f"SELECT id FROM chat_threads WHERE seller_id = {int(seller_id)} AND buyer_token = '{safe_token}'")
        row = cur.fetchone()
        if not row:
            return respond(200, {'messages': []})
        return respond(200, {'thread_id': row[0], 'messages': load_messages(row[0])})

    # Продавец получает список своих чатов
    if method == 'GET' and action == 'seller_threads':
        sid = get_seller_id()
        if not sid:
            return respond(401, {'error': 'Требуется вход'})
        cur.execute(
            f"SELECT id, seller_id, buyer_name, buyer_contact, last_message_at "
            f"FROM chat_threads WHERE seller_id = {sid} ORDER BY last_message_at DESC"
        )
        threads = [thread_to_dict(r) for r in cur.fetchall()]
        return respond(200, {'threads': threads})

    # Продавец получает сообщения конкретного чата
    if method == 'GET' and action == 'seller_messages':
        sid = get_seller_id()
        if not sid:
            return respond(401, {'error': 'Требуется вход'})
        thread_id = params.get('thread_id')
        if not thread_id:
            return respond(400, {'error': 'Не указан чат'})
        cur.execute(f"SELECT id FROM chat_threads WHERE id = {int(thread_id)} AND seller_id = {sid}")
        if not cur.fetchone():
            return respond(403, {'error': 'Нет доступа'})
        return respond(200, {'messages': load_messages(int(thread_id))})

    return respond(404, {'error': 'Неизвестное действие'})
