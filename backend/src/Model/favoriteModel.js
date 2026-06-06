const db = require('../config/databasis');

async function findAll(filters = {}) {
  let query = `
    SELECT fp.*, f.id as favorite_id, f.user_id
    FROM favorites f
    JOIN food_places fp ON f.food_place_id = fp.id
  `;
  const params = [];
  const conditions = [];

  if (filters.user_id) {
    conditions.push('f.user_id = ?');
    params.push(filters.user_id);
  }

  if (filters.food_place_id) {
    conditions.push('f.food_place_id = ?');
    params.push(filters.food_place_id);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return db.query(query, params);
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
