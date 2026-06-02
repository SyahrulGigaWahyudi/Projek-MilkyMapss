const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM menus');
}

async function findById(id) {
  return db.query('SELECT * FROM menus WHERE id = ?', [id]);
}

async function create(menu) {
  return db.query(
    'INSERT INTO menus (food_place_id, name, description, price, image, is_available, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [menu.food_place_id, menu.name, menu.description, menu.price, menu.image, menu.is_available ?? 1, menu.is_recommended ?? 0]
  );
}

async function update(id, menu) {
  return db.query(
    'UPDATE menus SET food_place_id = ?, name = ?, description = ?, price = ?, image = ?, is_available = ?, is_recommended = ? WHERE id = ?',
    [menu.food_place_id, menu.name, menu.description, menu.price, menu.image, menu.is_available ?? 1, menu.is_recommended ?? 0, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM menus WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
