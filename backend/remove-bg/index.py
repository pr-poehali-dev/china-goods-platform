import os
import io
import json
import requests
import boto3
from rembg import remove
from PIL import Image


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    # Handle CORS preflight
    if event.get('method', '').upper() == 'OPTIONS' or event.get('httpMethod', '').upper() == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({}),
        }

    # Extract query parameter "url"
    query_params = event.get('queryStringParameters') or event.get('query') or {}
    image_url = query_params.get('url')

    if not image_url:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Missing required query parameter: url'}),
        }

    try:
        # Download the image
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()
        input_image_bytes = response.content

        # Remove background using rembg
        output_image_bytes = remove(input_image_bytes)

        # Ensure result is a valid PNG via Pillow
        image = Image.open(io.BytesIO(output_image_bytes)).convert('RGBA')
        png_buffer = io.BytesIO()
        image.save(png_buffer, format='PNG')
        png_buffer.seek(0)

        # Upload to S3
        s3_client = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )

        s3_client.upload_fileobj(
            png_buffer,
            Bucket='files',
            Key='logos/dragon-nobg.png',
            ExtraArgs={'ContentType': 'image/png'},
        )

        # Build CDN URL
        cdn_url = (
            f"https://cdn.poehali.dev/projects/"
            f"{os.environ['AWS_ACCESS_KEY_ID']}/bucket/logos/dragon-nobg.png"
        )

        return {
            'statusCode': 200,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'url': cdn_url}),
        }

    except requests.exceptions.RequestException as e:
        return {
            'statusCode': 502,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Failed to download image: {str(e)}'}),
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Internal server error: {str(e)}'}),
        }
