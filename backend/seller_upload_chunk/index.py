import json
import os
import base64
import uuid
import psycopg2  # noqa
import boto3

S = 't_p88180796_china_goods_platform'

def handler(event: dict, context) -> dict:
    '''
    Чанковая загрузка видео в S3: init → upload chunks → complete.
    Позволяет загружать большие файлы (до 150 МБ) частями по 5 МБ.
    '''
    method = event.get('httpMethod', 'GET')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    def respond(status, data):
        return {'statusCode': status, 'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps(data, default=str)}

    token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    if not token:
        return respond(401, {'error': 'Требуется вход'})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    safe_token = token.replace("'", "''")
    cur.execute(f"SELECT id FROM {S}.sellers WHERE auth_token = '{safe_token}'")
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return respond(401, {'error': 'Требуется вход'})
    sid = row[0]

    body = json.loads(event.get('body') or '{}')
    action = (event.get('queryStringParameters') or {}).get('action', '')

    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    # Инициализировать multipart upload
    if action == 'init':
        ext = body.get('ext') or 'mp4'
        content_type = body.get('content_type') or 'video/mp4'
        key = f"sellers/{sid}/{uuid.uuid4().hex}.{ext}"
        resp = s3.create_multipart_upload(Bucket='files', Key=key, ContentType=content_type)
        upload_id = resp['UploadId']
        return respond(200, {'upload_id': upload_id, 'key': key})

    # Загрузить один чанк
    if action == 'chunk':
        key = body.get('key')
        upload_id = body.get('upload_id')
        part_number = int(body.get('part_number', 1))
        chunk_b64 = body.get('chunk_b64') or ''
        if not all([key, upload_id, chunk_b64]):
            return respond(400, {'error': 'Не хватает параметров'})
        chunk_data = base64.b64decode(chunk_b64)
        resp = s3.upload_part(
            Bucket='files', Key=key,
            UploadId=upload_id,
            PartNumber=part_number,
            Body=chunk_data
        )
        return respond(200, {'etag': resp['ETag'], 'part_number': part_number})

    # Завершить multipart upload
    if action == 'complete':
        key = body.get('key')
        upload_id = body.get('upload_id')
        parts = body.get('parts') or []
        if not all([key, upload_id, parts]):
            return respond(400, {'error': 'Не хватает параметров'})
        s3.complete_multipart_upload(
            Bucket='files', Key=key,
            UploadId=upload_id,
            MultipartUpload={'Parts': [{'PartNumber': p['part_number'], 'ETag': p['etag']} for p in parts]}
        )
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return respond(200, {'url': url})

    # Отменить загрузку
    if action == 'abort':
        key = body.get('key')
        upload_id = body.get('upload_id')
        if key and upload_id:
            s3.abort_multipart_upload(Bucket='files', Key=key, UploadId=upload_id)
        return respond(200, {'ok': True})

    return respond(404, {'error': 'Неизвестное действие'})