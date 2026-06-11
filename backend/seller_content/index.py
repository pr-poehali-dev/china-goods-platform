import json
import os
import base64
import uuid
import psycopg2
import boto3

S = 't_p88180796_china_goods_platform'

def handler(event: dict, context) -> dict:
    '''
    API контента поставщиков: загрузка товаров, видео и файлов в каталог.
    Args: event с httpMethod, body, headers; context с request_id
    Returns: HTTP response с результатом операции в JSON
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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

    def auth_seller():
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        if not token:
            return None
        safe = token.replace("'", "''")
        cur.execute(f"SELECT id FROM {S}.sellers WHERE auth_token = '{safe}'")
        row = cur.fetchone()
        return row[0] if row else None

    sid = auth_seller()
    if not sid:
        return respond(401, {'error': 'Требуется вход'})

    body = json.loads(event.get('body') or '{}')

    # Загрузка файла (картинка / видео) в S3
    if method == 'POST' and action == 'upload':
        file_b64 = body.get('file_base64') or ''
        content_type = body.get('content_type') or 'application/octet-stream'
        ext = body.get('ext') or 'bin'
        if not file_b64:
            return respond(400, {'error': 'Нет файла'})
        data = base64.b64decode(file_b64)
        key = f"sellers/{sid}/{uuid.uuid4().hex}.{ext}"
        s3 = boto3.client('s3', endpoint_url='https://bucket.poehali.dev',
                          aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                          aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'])
        s3.put_object(Bucket='files', Key=key, Body=data, ContentType=content_type)
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return respond(200, {'url': url})

    # Добавить товар
    if method == 'POST' and action == 'add_product':
        title = (body.get('title') or '').strip()
        if not title:
            return respond(400, {'error': 'Укажите название товара'})
        t = title.replace("'", "''")
        price = (body.get('price') or '').replace("'", "''")
        desc = (body.get('description') or '').replace("'", "''")
        img = (body.get('image_url') or '').replace("'", "''")
        cur.execute(
            f"INSERT INTO {S}.seller_products (seller_id, title, price, description, image_url) "
            f"VALUES ({sid}, '{t}', '{price}', '{desc}', '{img}') RETURNING id"
        )
        pid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'id': pid})

    # Добавить видео
    if method == 'POST' and action == 'add_video':
        url = (body.get('video_url') or '').strip()
        if not url:
            return respond(400, {'error': 'Нет видео'})
        u = url.replace("'", "''")
        title = (body.get('title') or '').replace("'", "''")
        cur.execute(
            f"INSERT INTO {S}.seller_videos (seller_id, title, video_url) "
            f"VALUES ({sid}, '{title}', '{u}') RETURNING id"
        )
        vid = cur.fetchone()[0]
        conn.commit()
        return respond(200, {'id': vid})

    # Удалить видео
    if method == 'POST' and action == 'delete_video':
        video_id = body.get('video_id')
        if not video_id:
            return respond(400, {'error': 'Нет video_id'})
        cur.execute(f"DELETE FROM {S}.seller_videos WHERE id = {int(video_id)} AND seller_id = {sid}")
        conn.commit()
        return respond(200, {'ok': True})

    return respond(404, {'error': 'Неизвестное действие'})
