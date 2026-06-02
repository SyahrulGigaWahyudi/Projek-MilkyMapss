const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM food_place_tags');
}

async function findById(id) {
  return db.query('SELECT * FROM food_place_tags WHERE food_place_id = ? AND tag_id = ?', [id.food_place_id, id.tag_id]);
}

async function create(relation) {
  return db.query('INSERT INTO food_place_tags (food_place_id, tag_id) VALUES (?, ?)', [relation.food_place_id, relation.tag_id]);
}

async function remove(food_place_id, tag_id) {
  return db.query('DELETE FROM food_place_tags WHERE food_place_id = ? AND tag_id = ?', [food_place_id, tag_id]);
}

module.exports = { findAll, findById, create, remove };
