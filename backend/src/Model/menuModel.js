const db = require('../config/databasis');

async function findAll(filters = {}) {
  let query = 'SELECT * FROM menus';
  const params = [];
  const conditions = [];

  if (filters.food_place_id) {
    conditions.push('food_place_id = ?');
    params.push(filters.food_place_id);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return db.query(query, params);
}

async function findById(id) {
  return db.query('SELECT * FROM menus WHERE id = ?', [id]);
}

async function create(menu) {
  return db.query(
    'INSERT INTO menus (food_place_id, name, description, price, image, is_available, is_recommended, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [menu.food_place_id, menu.name, menu.description, menu.price, menu.image, menu.is_available ?? 1, menu.is_recommended ?? 0, menu.category || null]
  );
}

async function update(id, menu) {
  return db.query(
    'UPDATE menus SET food_place_id = ?, name = ?, description = ?, price = ?, image = ?, is_available = ?, is_recommended = ?, category = ? WHERE id = ?',
    [menu.food_place_id, menu.name, menu.description, menu.price, menu.image, menu.is_available ?? 1, menu.is_recommended ?? 0, menu.category || null, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM menus WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };