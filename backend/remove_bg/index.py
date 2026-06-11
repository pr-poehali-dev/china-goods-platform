import json
import os
import uuid
import urllib.request
import io
import boto3
from PIL import Image
import numpy as np

def handler(event: dict, context) -> dict:
    """Убирает белый фон с изображения и сохраняет PNG с прозрачностью в S3."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    image_url = body.get('image_url')
    if not image_url:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'image_url required'})}

    req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        img_data = resp.read()

    img = Image.open(io.BytesIO(img_data)).convert('RGBA')
    data = np.array(img)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    # Пиксели близкие к белому — делаем прозрачными
    threshold = 230
    white_mask = (r > threshold) & (g > threshold) & (b > threshold)
    data[:,:,3] = np.where(white_mask, 0, a)

    result_img = Image.fromarray(data)
    output = io.BytesIO()
    result_img.save(output, format='PNG')
    output.seek(0)

    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    key = f"logos/{uuid.uuid4().hex}.png"
    s3.put_object(Bucket='files', Key=key, Body=output.read(), ContentType='image/png')
    url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {'statusCode': 200, 'headers': {**cors, 'Content-Type': 'application/json'}, 'body': json.dumps({'url': url})}
