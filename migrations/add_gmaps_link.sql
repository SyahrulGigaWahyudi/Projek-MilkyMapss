-- Migration: Tambah kolom gmaps_link ke tabel food_places
-- Jalankan: mysql -u root -p campuseats < migrations/add_gmaps_link.sql

ALTER TABLE food_places
  ADD COLUMN gmaps_link VARCHAR(500) NULL
  AFTER longitude;
