ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS size VARCHAR(255);
ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS color VARCHAR(255);
ALTER TABLE seller_products ADD COLUMN IF NOT EXISTS stock VARCHAR(64);

CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES seller_products(id),
  author_name VARCHAR(128) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);