const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM tags');
}

async function findById(id) {
  return db.query('SELECT * FROM tags WHERE id = ?', [id]);
}

async function create(tag) {
  return db.query('INSERT INTO tags (name, slug) VALUES (?, ?)', [tag.name, tag.slug]);
}

async function update(id, tag) {
  return db.query('UPDATE tags SET name = ?, slug = ? WHERE id = ?', [tag.name, tag.slug, id]);
}

async function remove(id) {
  return db.query('DELETE FROM tags WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
