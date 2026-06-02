const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM review_images');
}

async function findById(id) {
  return db.query('SELECT * FROM review_images WHERE id = ?', [id]);
}

async function create(image) {
  return db.query(
    'INSERT INTO review_images (review_id, image_url) VALUES (?, ?)',
    [image.review_id, image.image_url]
  );
}

async function update(id, image) {
  return db.query(
    'UPDATE review_images SET review_id = ?, image_url = ? WHERE id = ?',
    [image.review_id, image.image_url, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM review_images WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
