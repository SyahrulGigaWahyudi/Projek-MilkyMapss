const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM food_places');
}

async function findById(id) {
  return db.query('SELECT * FROM food_places WHERE id = ?', [id]);
}

async function create(place) {
  return db.query(
    'INSERT INTO food_places (campus_location_id, category_id, name, slug, description, detail_location, latitude, longitude, phone, email, thumbnail, price_range, is_active, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [place.campus_location_id, place.category_id, place.name, place.slug, place.description, place.detail_location, place.latitude, place.longitude, place.phone, place.email, place.thumbnail, place.price_range, place.is_active ?? 1, place.is_verified ?? 0]
  );
}

async function update(id, place) {
  return db.query(
    'UPDATE food_places SET campus_location_id = ?, category_id = ?, name = ?, slug = ?, description = ?, detail_location = ?, latitude = ?, longitude = ?, phone = ?, email = ?, thumbnail = ?, price_range = ?, is_active = ?, is_verified = ? WHERE id = ?',
    [place.campus_location_id, place.category_id, place.name, place.slug, place.description, place.detail_location, place.latitude, place.longitude, place.phone, place.email, place.thumbnail, place.price_range, place.is_active ?? 1, place.is_verified ?? 0, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM food_places WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
