-- ============================================================
-- DATABASE: CampusEats — Pencari Tempat Makan di Kampus
-- Engine   : MySQL 8.0+
-- Charset  : utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS campuseats
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campuseats;

-- ============================================================
-- 1. TABEL USERS
--    Menyimpan akun admin dan customer.
-- ============================================================
CREATE TABLE users (
    id              INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    username        VARCHAR(50)         NOT NULL,
    email           VARCHAR(100)        NOT NULL,
    password        VARCHAR(255)        NOT NULL,         -- bcrypt / argon2 hash
    role            ENUM('admin','customer') NOT NULL DEFAULT 'customer',
    is_active       TINYINT(1)          NOT NULL DEFAULT 1,
    email_verified_at TIMESTAMP         NULL,
    last_login_at   TIMESTAMP           NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_username (username),
    UNIQUE KEY uq_email    (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 2. TABEL CUSTOMER_PROFILES
--    Data profil tambahan khusus untuk customer.
-- ============================================================
CREATE TABLE customer_profiles (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id         INT UNSIGNED    NOT NULL,
    full_name       VARCHAR(100)    NOT NULL,
    phone_number    VARCHAR(20)     NULL,
    profile_picture VARCHAR(255)    NULL,
    bio             TEXT            NULL,
    faculty         VARCHAR(100)    NULL,   -- Contoh: Fakultas Teknik
    student_id      VARCHAR(20)     NULL,   -- NIM mahasiswa
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_user_id (user_id),
    CONSTRAINT fk_cp_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 3. TABEL CAMPUS_LOCATIONS
--    Menyimpan data lokasi kampus (Kampus A, Kampus B, dst.)
-- ============================================================
CREATE TABLE campus_locations (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,               -- Kampus A, Kampus B
    code        VARCHAR(10)     NOT NULL,               -- KA, KB
    address     TEXT            NOT NULL,
    description TEXT            NULL,
    latitude    DECIMAL(10,8)   NULL,
    longitude   DECIMAL(11,8)   NULL,
    image       VARCHAR(255)    NULL,
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_code (code),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 4. TABEL CATEGORIES
--    Kategori tempat makan (Warteg, Kantin, Café, dst.)
-- ============================================================
CREATE TABLE categories (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)     NOT NULL,
    slug        VARCHAR(60)     NOT NULL,
    description TEXT            NULL,
    icon        VARCHAR(255)    NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_name (name),
    UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 5. TABEL FOOD_PLACES
--    Data utama tempat makan / restoran di kampus.
--    Berelasi ke campus_locations dan categories.
-- ============================================================
CREATE TABLE food_places (
    id                  INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    campus_location_id  INT UNSIGNED        NOT NULL,
    category_id         INT UNSIGNED        NULL,
    name                VARCHAR(150)        NOT NULL,
    slug                VARCHAR(180)        NOT NULL,
    description         TEXT                NULL,
    detail_location     VARCHAR(255)        NULL,   -- Contoh: Gedung A Lt. 1, Kantin Pusat
    latitude            DECIMAL(10,8)       NULL,
    longitude           DECIMAL(11,8)       NULL,
    phone               VARCHAR(20)         NULL,
    email               VARCHAR(100)        NULL,
    thumbnail           VARCHAR(255)        NULL,
    price_range         ENUM('<10k','10k-25k','25k-50k','>50k') NULL,
    is_active           TINYINT(1)          NOT NULL DEFAULT 1,
    is_verified         TINYINT(1)          NOT NULL DEFAULT 0,  -- Diverifikasi admin
    total_reviews       INT UNSIGNED        NOT NULL DEFAULT 0,
    average_rating      DECIMAL(3,2)        NOT NULL DEFAULT 0.00,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_slug (slug),
    INDEX idx_campus_location  (campus_location_id),
    INDEX idx_category         (category_id),
    INDEX idx_is_active        (is_active),
    INDEX idx_average_rating   (average_rating),

    CONSTRAINT fk_fp_campus
        FOREIGN KEY (campus_location_id) REFERENCES campus_locations(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_fp_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 6. TABEL FOOD_PLACE_IMAGES
--    Galeri foto untuk setiap tempat makan.
-- ============================================================
CREATE TABLE food_place_images (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    food_place_id   INT UNSIGNED    NOT NULL,
    image_url       VARCHAR(255)    NOT NULL,
    caption         VARCHAR(150)    NULL,
    is_primary      TINYINT(1)      NOT NULL DEFAULT 0,
    sort_order      TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_food_place_id (food_place_id),
    INDEX idx_is_primary    (is_primary),

    CONSTRAINT fk_fpi_food_place
        FOREIGN KEY (food_place_id) REFERENCES food_places(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 7. TABEL OPERATING_HOURS
--    Jam buka setiap hari untuk masing-masing tempat makan.
-- ============================================================
CREATE TABLE operating_hours (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    food_place_id   INT UNSIGNED    NOT NULL,
    day_of_week     TINYINT UNSIGNED NOT NULL,  -- 0=Minggu,1=Senin,...,6=Sabtu
    open_time       TIME            NULL,
    close_time      TIME            NULL,
    is_closed       TINYINT(1)      NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    UNIQUE KEY uq_food_day (food_place_id, day_of_week),
    INDEX idx_food_place_id (food_place_id),

    CONSTRAINT fk_oh_food_place
        FOREIGN KEY (food_place_id) REFERENCES food_places(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 8. TABEL MENUS
--    Daftar menu makanan/minuman per tempat makan.
-- ============================================================
CREATE TABLE menus (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    food_place_id   INT UNSIGNED    NOT NULL,
    name            VARCHAR(150)    NOT NULL,
    description     TEXT            NULL,
    price           DECIMAL(10,2)   NOT NULL,
    image           VARCHAR(255)    NULL,
    is_available    TINYINT(1)      NOT NULL DEFAULT 1,
    is_recommended  TINYINT(1)      NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_food_place_id (food_place_id),
    INDEX idx_is_available  (is_available),

    CONSTRAINT fk_menu_food_place
        FOREIGN KEY (food_place_id) REFERENCES food_places(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 9. TABEL REVIEWS
--    Ulasan & rating dari customer untuk tempat makan.
--    1 customer hanya bisa memberi 1 ulasan per tempat.
-- ============================================================
CREATE TABLE reviews (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id         INT UNSIGNED    NOT NULL,
    food_place_id   INT UNSIGNED    NOT NULL,
    rating          TINYINT UNSIGNED NOT NULL,           -- 1 s/d 5
    comment         TEXT            NULL,
    is_published    TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_user_food (user_id, food_place_id),   -- 1 review per user per tempat
    INDEX idx_food_place_id (food_place_id),
    INDEX idx_user_id       (user_id),
    INDEX idx_rating        (rating),
    CONSTRAINT chk_rating   CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_rv_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rv_food_place
        FOREIGN KEY (food_place_id) REFERENCES food_places(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 10. TABEL REVIEW_IMAGES
--     Foto yang dilampirkan customer dalam ulasan.
-- ============================================================
CREATE TABLE review_images (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    review_id   INT UNSIGNED    NOT NULL,
    image_url   VARCHAR(255)    NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_review_id (review_id),

    CONSTRAINT fk_ri_review
        FOREIGN KEY (review_id) REFERENCES reviews(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 11. TABEL FAVORITES
--     Tempat makan yang disimpan (bookmark) oleh customer.
-- ============================================================
CREATE TABLE favorites (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    user_id         INT UNSIGNED    NOT NULL,
    food_place_id   INT UNSIGNED    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_user_favorite (user_id, food_place_id),
    INDEX idx_user_id       (user_id),
    INDEX idx_food_place_id (food_place_id),

    CONSTRAINT fk_fv_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fv_food_place
        FOREIGN KEY (food_place_id) REFERENCES food_places(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 12. TABEL TAGS
--     Label filter tambahan (Halal, WiFi, AC, Murah, dst.)
-- ============================================================
CREATE TABLE tags (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)     NOT NULL,
    slug        VARCHAR(60)     NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_name (name),
    UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 13. TABEL FOOD_PLACE_TAGS  (pivot / junction)
--     Relasi many-to-many: food_places ↔ tags
-- ============================================================
CREATE TABLE food_place_tags (
    food_place_id   INT UNSIGNED NOT NULL,
    tag_id          INT UNSIGNED NOT NULL,

    PRIMARY KEY (food_place_id, tag_id),

    CONSTRAINT fk_fpt_food_place
        FOREIGN KEY (food_place_id) REFERENCES food_places(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fpt_tag
        FOREIGN KEY (tag_id) REFERENCES tags(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- TRIGGERS
-- Otomatis update average_rating & total_reviews di food_places
-- setiap kali ada review ditambah, diubah, atau dihapus.
-- ============================================================
DELIMITER $$

CREATE TRIGGER trg_reviews_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE food_places
    SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE food_place_id = NEW.food_place_id
              AND is_published = 1
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE food_place_id = NEW.food_place_id
              AND is_published = 1
        )
    WHERE id = NEW.food_place_id;
END$$

CREATE TRIGGER trg_reviews_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE food_places
    SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE food_place_id = NEW.food_place_id
              AND is_published = 1
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE food_place_id = NEW.food_place_id
              AND is_published = 1
        )
    WHERE id = NEW.food_place_id;
END$$

CREATE TRIGGER trg_reviews_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE food_places
    SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE food_place_id = OLD.food_place_id
              AND is_published = 1
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE food_place_id = OLD.food_place_id
              AND is_published = 1
        )
    WHERE id = OLD.food_place_id;
END$$

DELIMITER ;


-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Lokasi Kampus
INSERT INTO campus_locations (name, code, address, description) VALUES
('Kampus A', 'KA', 'Jl. Raya Kampus No. 1, Jakarta Selatan', 'Kampus utama — gedung rektorat dan fakultas sains'),
('Kampus B', 'KB', 'Jl. Raya Kampus No. 5, Jakarta Timur',  'Kampus satelit — fakultas vokasi dan teknik');

-- Kategori
INSERT INTO categories (name, slug, description) VALUES
('Warteg',    'warteg',    'Warung makan nasi rumahan'),
('Kantin',    'kantin',    'Kantin resmi kampus'),
('Café',      'cafe',      'Kafe dan kedai kopi'),
('Fast Food', 'fast-food', 'Makanan cepat saji'),
('Jajanan',   'jajanan',   'Jajanan dan snack ringan'),
('Minuman',   'minuman',   'Kedai minuman dan bubble tea');

-- Tags
INSERT INTO tags (name, slug) VALUES
('Halal',           'halal'),
('Non-Halal',       'non-halal'),
('Vegetarian',      'vegetarian'),
('Murah',           'murah'),
('WiFi',            'wifi'),
('AC',              'ac'),
('Outdoor',         'outdoor'),
('Buka Malam',      'buka-malam'),
('Parkir Tersedia', 'parkir-tersedia'),
('Bayar QRIS',      'bayar-qris');

-- Admin
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@campuseats.id', '$2y$12$HASH_PLACEHOLDER', 'admin');

-- Contoh customer
INSERT INTO users (username, email, password, role) VALUES
('budi_santoso', 'budi@mahasiswa.ac.id', '$2y$12$HASH_PLACEHOLDER', 'customer'),
('sari_dewi',    'sari@mahasiswa.ac.id', '$2y$12$HASH_PLACEHOLDER', 'customer');

-- Profil customer
INSERT INTO customer_profiles (user_id, full_name, phone_number, faculty, student_id) VALUES
(2, 'Budi Santoso', '08123456789', 'Fakultas Teknik Informatika', '2021001'),
(3, 'Sari Dewi',    '08987654321', 'Fakultas Ekonomi',            '2022042');

-- Contoh tempat makan
INSERT INTO food_places
    (campus_location_id, category_id, name, slug, description, detail_location, price_range, is_verified)
VALUES
(1, 1, 'Warteg Bu Sari',       'warteg-bu-sari',       'Warteg murah meriah dengan masakan rumahan khas Jawa', 'Gedung A, Lt. Dasar', '<10k',    1),
(1, 3, 'Kopi Kampus',          'kopi-kampus',           'Kedai kopi dengan suasana nyaman dan WiFi gratis',    'Gedung Serbaguna Lt. 1', '10k-25k', 1),
(2, 2, 'Kantin Pusat KB',      'kantin-pusat-kb',       'Kantin resmi kampus B dengan berbagai pilihan lauk',  'Gedung Pusat KB',        '<10k',    1),
(2, 4, 'Bakso & Mie Ayam Pak Joko', 'bakso-mie-pak-joko', 'Bakso sapi kenyal dengan kuah gurih',             'Area Parkir KB',         '10k-25k', 0);

-- Jam operasional Warteg Bu Sari (Senin-Sabtu, tutup Minggu)
INSERT INTO operating_hours (food_place_id, day_of_week, open_time, close_time, is_closed) VALUES
(1, 0, NULL, NULL, 1),       -- Minggu  : tutup
(1, 1, '07:00', '20:00', 0), -- Senin
(1, 2, '07:00', '20:00', 0), -- Selasa
(1, 3, '07:00', '20:00', 0), -- Rabu
(1, 4, '07:00', '20:00', 0), -- Kamis
(1, 5, '07:00', '20:00', 0), -- Jumat
(1, 6, '07:00', '14:00', 0); -- Sabtu (setengah hari)

-- Contoh menu
INSERT INTO menus (food_place_id, name, price, is_recommended) VALUES
(1, 'Nasi + Ayam Goreng + Sayur', 12000, 1),
(1, 'Nasi + Tempe Orek',          8000,  0),
(2, 'Kopi Susu Aren',             18000, 1),
(2, 'Americano',                  15000, 0);

-- Contoh review
INSERT INTO reviews (user_id, food_place_id, rating, comment) VALUES
(2, 1, 5, 'Enak banget, porsi besar dan murah! Cocok buat kantong mahasiswa.'),
(3, 1, 4, 'Lauk bervariasi, tapi kadang kehabisan kalau siang.'),
(2, 2, 5, 'Tempat cozy, WiFi kenceng, kopi susunya juara!');

-- Tags untuk tempat makan
INSERT INTO food_place_tags (food_place_id, tag_id) VALUES
(1, 1),  -- Warteg Bu Sari : Halal
(1, 4),  -- Warteg Bu Sari : Murah
(1, 10), -- Warteg Bu Sari : Bayar QRIS
(2, 1),  -- Kopi Kampus    : Halal
(2, 5),  -- Kopi Kampus    : WiFi
(2, 6),  -- Kopi Kampus    : AC
(2, 10), -- Kopi Kampus    : Bayar QRIS
(3, 1),  -- Kantin Pusat   : Halal
(3, 4),  -- Kantin Pusat   : Murah
(4, 1),  -- Bakso Pak Joko : Halal
(4, 7);  -- Bakso Pak Joko : Outdoor

-- ============================================================
-- CONTOH QUERY BERGUNA
-- ============================================================

-- Cari semua tempat makan aktif di Kampus A beserta rating
-- SELECT fp.name, fp.detail_location, fp.average_rating, fp.total_reviews,
--        c.name AS category, cl.name AS campus
-- FROM food_places fp
-- JOIN campus_locations cl ON cl.id = fp.campus_location_id
-- LEFT JOIN categories c   ON c.id  = fp.category_id
-- WHERE cl.code = 'KA' AND fp.is_active = 1
-- ORDER BY fp.average_rating DESC;

-- Cari tempat makan berdasarkan tag 'Halal' dan 'WiFi'
-- SELECT fp.name, fp.average_rating
-- FROM food_places fp
-- JOIN food_place_tags fpt1 ON fpt1.food_place_id = fp.id AND fpt1.tag_id = 1  -- Halal
-- JOIN food_place_tags fpt2 ON fpt2.food_place_id = fp.id AND fpt2.tag_id = 5  -- WiFi
-- WHERE fp.is_active = 1;

-- Cek apakah tempat makan sedang buka sekarang
-- SELECT fp.name,
--        CASE WHEN oh.is_closed = 1 THEN 'Tutup'
--             WHEN CURTIME() BETWEEN oh.open_time AND oh.close_time THEN 'Buka'
--             ELSE 'Tutup'
--        END AS status
-- FROM food_places fp
-- LEFT JOIN operating_hours oh
--     ON oh.food_place_id = fp.id AND oh.day_of_week = DAYOFWEEK(NOW()) - 1
-- WHERE fp.is_active = 1;
