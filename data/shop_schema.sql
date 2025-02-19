-- データベース作成（存在しない場合のみ）
DO $$ 
BEGIN 
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shop_db') THEN 
      CREATE DATABASE shop_db;
   END IF;
END $$;

\c shop_db;

-- 商品テーブル (items)
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- サイズテーブル (sizes)
CREATE TABLE sizes (
    id SERIAL PRIMARY KEY,
    size VARCHAR(50) NOT NULL,
    description TEXT,
    extra_price DECIMAL(10, 2) DEFAULT 0.00,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- トッピングテーブル (toppings)
CREATE TABLE toppings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 商品とサイズの関連テーブル (items_sizes)
CREATE TABLE items_sizes (
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    size_id INT REFERENCES sizes(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, size_id)
);

-- 商品とトッピングの関連テーブル (items_toppings)
CREATE TABLE items_toppings (
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    topping_id INT REFERENCES toppings(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, topping_id)
);

-- トリガー関数を作成（updated_at を自動更新）
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER set_timestamp BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER set_timestamp BEFORE UPDATE ON sizes FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER set_timestamp BEFORE UPDATE ON toppings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
