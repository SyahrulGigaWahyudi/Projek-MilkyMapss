const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM categories');
}

async function findById(id) {
  return db.query('SELECT * FROM categories WHERE id = ?', [id]);
}

async function create(category) {
  return db.query(
    'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)',
    [category.name, category.slug, category.description, category.icon]
  );
}

async function update(id, category) {
  return db.query(
    'UPDATE categories SET name = ?, slug = ?, description = ?, icon = ? WHERE id = ?',
    [category.name, category.slug, category.description, category.icon, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM categories WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
