const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM food_place_images');
}

async function findById(id) {
  return db.query('SELECT * FROM food_place_images WHERE id = ?', [id]);
}

async function create(image) {
  return db.query(
    'INSERT INTO food_place_images (food_place_id, image_url, caption, is_primary, sort_order) VALUES (?, ?, ?, ?, ?)',
    [image.food_place_id, image.image_url, image.caption, image.is_primary ?? 0, image.sort_order ?? 0]
  );
}

async function update(id, image) {
  return db.query(
    'UPDATE food_place_images SET food_place_id = ?, image_url = ?, caption = ?, is_primary = ?, sort_order = ? WHERE id = ?',
    [image.food_place_id, image.image_url, image.caption, image.is_primary ?? 0, image.sort_order ?? 0, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM food_place_images WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
