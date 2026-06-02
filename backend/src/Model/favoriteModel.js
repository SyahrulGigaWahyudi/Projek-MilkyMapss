const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM favorites');
}

async function findById(id) {
  return db.query('SELECT * FROM favorites WHERE id = ?', [id]);
}

async function create(favorite) {
  return db.query('INSERT INTO favorites (user_id, food_place_id) VALUES (?, ?)', [favorite.user_id, favorite.food_place_id]);
}

async function update(id, favorite) {
  return db.query('UPDATE favorites SET user_id = ?, food_place_id = ? WHERE id = ?', [favorite.user_id, favorite.food_place_id, id]);
}

async function remove(id) {
  return db.query('DELETE FROM favorites WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
