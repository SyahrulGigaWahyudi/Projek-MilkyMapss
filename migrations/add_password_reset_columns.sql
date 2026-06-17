-- Migration: Tambah kolom reset_token dan reset_token_expires untuk password reset
-- Jalankan: mysql -u root -p campuseats < migrations/add_password_reset_columns.sql

ALTER TABLE users
  ADD COLUMN reset_token VARCHAR(255) NULL,
  ADD COLUMN reset_token_expires DATETIME NULL;

-- Optional: Add index for faster token lookups
CREATE INDEX idx_reset_token ON users(reset_token);
