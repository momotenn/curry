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
    price INTEGER NOT NULL,
    imagePath TEXT,
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
    extra_price INTEGER DEFAULT 0,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- トッピングテーブル (toppings)
CREATE TABLE toppings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
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

-- INSERT 文
INSERT INTO items (id, name, description, price, imagePath, available)
VALUES
  (1, 'カツカレー', '食べると勝負に勝てると言われる勝つカレー。ラクラクカレー定番の１品です', 1490, '/img_curry/1.jpg', TRUE),
  (2, 'ポークポークカレー・ミート', 'グリーンアスパラと相性の良いベーコンにいろどりのフレッシュトマトをトッピングし特製マヨソースでまとめた商品です', 1490, '/img_curry/2.jpg', TRUE),
  (3, '牛すじカレー', 'トロトロの牛すじとネギの風味が格別な味わいシンプルなカレーです！', 1490, '/img_curry/3.jpg', TRUE),
  (4, '味噌カツカレー', 'マイルドな味付けのカレーに大きくカットした味噌カツをのせた、バターとチーズの風味が食欲をそそるお子様でも楽しめる商品です', 1900, '/img_curry/4.jpg', TRUE),
  (5, 'とんかつカレーラーメン', 'カレーはライスだけではありません。ラクラクピザが開発したカレーラーメンは絶品の美味しさ！', 1900, '/img_curry/5.jpg', TRUE),
  (6, 'ヒレカツカレー', 'やわらかくあっさりとしたヒレ肉を上質な衣で包み込みました。4種類の濃厚な味わいが一つで楽しめるカレーです', 2700, '/img_curry/6.jpg', TRUE),
  (7, '濃厚Gorgeous4', 'こだわりのソースで、旨みとコクを堪能！濃厚Gorgeous4とは、動物由来の原材料を使用していないカレーです。ベジタリアンの方にオススメです', 2570, '/img_curry/7.jpg', TRUE),
  (8, 'カレーうどん', 'ラクラクカレー自慢のカレーに魚介のダシ、ローストオニオンのコクが加わった絶妙なスープをお楽しみください', 2160, '/img_curry/8.jpg', TRUE),
  (9, 'Charity4', 'にんにくとトマトの旨みが効いたスパイスカレー。食べると思わず元気が出るラクラクカレーの自信作', 2700, '/img_curry/9.jpg', TRUE),
  (10, 'ほうれん草のカレードリア', 'カレードリアの王道！ホワイトソースとカレーのダブルソースとなす、ほうれん草、チーズのおいしい組み合わせ', 2160, '/img_curry/10.jpg', TRUE),
  (11, 'Specialドリア4', 'ホワイトソースとカレーのダブルソースにハンバーグを合わせました', 2700, '/img_curry/11.jpg', TRUE),
  (12, 'バラエティー４', 'あらびきスライス牛肉とイタリアンチーズを、トマトソースと特製マヨソースの2種類のソースで召し上がって頂く商品です', 2160, '/img_curry/13.jpg', TRUE),
  (13, 'えびナスカレー', 'デミグラスソースでじっくり煮込んだ旨味たっぷりのえびとナスのカレー', 2980, '/img_curry/14.jpg', TRUE);

INSERT INTO toppings (id, name, price, available)
VALUES
  (1, 'オニオン', 100, TRUE),
  (2, 'チーズ', 200, TRUE),
  (3, 'ピーマン', 100, TRUE),
  (4, 'ロースハム', 200, TRUE),
  (5, 'ほうれん草', 100, TRUE),
  (6, 'ナス', 100, TRUE),
  (7, 'ソーセージ', 200, TRUE),
  (8, '納豆', 100, TRUE);

INSERT INTO sizes (size, description, extra_price, available, created_at, updated_at, deleted_at)
VALUES
  ('S', '小サイズ（お子様、少食の方におすすめ）', 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('M', '中サイズ（標準的な量）', 100, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('L', '大サイズ（たっぷり提供）', 300, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

INSERT INTO items_sizes (item_id, size_id)
SELECT i.id, s.id
FROM items i
CROSS JOIN sizes s;

INSERT INTO items_toppings (item_id, topping_id)
SELECT i.id, t.id
FROM items i
CROSS JOIN toppings t;
