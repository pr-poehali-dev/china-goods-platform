CREATE TABLE IF NOT EXISTS sellers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    wechat_id VARCHAR(255),
    phone VARCHAR(64),
    description TEXT,
    avatar_url TEXT,
    city VARCHAR(255),
    auth_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES sellers(id),
    title VARCHAR(255) NOT NULL,
    price VARCHAR(64),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_videos (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES sellers(id),
    title VARCHAR(255),
    video_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seller_products_seller ON seller_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_videos_seller ON seller_videos(seller_id);
CREATE INDEX IF NOT EXISTS idx_sellers_token ON sellers(auth_token);