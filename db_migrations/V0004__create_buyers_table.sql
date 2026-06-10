CREATE TABLE IF NOT EXISTS buyers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    auth_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_buyers_token ON buyers(auth_token);

ALTER TABLE chat_threads ADD COLUMN IF NOT EXISTS buyer_id INTEGER REFERENCES buyers(id);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS read_by_buyer BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_chat_threads_buyer_id ON chat_threads(buyer_id);