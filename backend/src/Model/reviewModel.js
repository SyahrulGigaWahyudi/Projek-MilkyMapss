const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM reviews');
}

async function findById(id) {
  return db.query('SELECT * FROM reviews WHERE id = ?', [id]);
}

async function create(review) {
  return db.query(
    'INSERT INTO reviews (user_id, food_place_id, rating, comment, is_published) VALUES (?, ?, ?, ?, ?)',
    [review.user_id, review.food_place_id, review.rating, review.comment, review.is_published ?? 1]
  );
}

async function update(id, review) {
  return db.query(
    'UPDATE reviews SET user_id = ?, food_place_id = ?, rating = ?, comment = ?, is_published = ? WHERE id = ?',
    [review.user_id, review.food_place_id, review.rating, review.comment, review.is_published ?? 1, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM reviews WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
