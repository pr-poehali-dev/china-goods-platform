-- Чаты между покупателем и поставщиком
CREATE TABLE IF NOT EXISTS chat_threads (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES sellers(id),
    buyer_name VARCHAR(255) NOT NULL,
    buyer_contact VARCHAR(255),
    buyer_token VARCHAR(255) NOT NULL,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Сообщения чата
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES chat_threads(id),
    sender VARCHAR(16) NOT NULL,
    text_original TEXT NOT NULL,
    text_translated TEXT,
    lang_original VARCHAR(8),
    lang_translated VARCHAR(8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_threads_seller ON chat_threads(seller_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_buyer ON chat_threads(buyer_token);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON chat_messages(thread_id);