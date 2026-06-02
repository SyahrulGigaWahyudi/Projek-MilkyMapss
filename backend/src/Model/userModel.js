const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT id, username, email, role, is_active, email_verified_at, last_login_at, created_at, updated_at FROM users');
}

async function findById(id) {
  return db.query('SELECT id, username, email, role, is_active, email_verified_at, last_login_at, created_at, updated_at FROM users WHERE id = ?', [id]);
}

async function create(user) {
  return db.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [user.username, user.email, user.password, user.role || 'customer']
  );
}

async function update(id, user) {
  return db.query(
    'UPDATE users SET username = ?, email = ?, password = ?, role = ?, is_active = ? WHERE id = ?',
    [user.username, user.email, user.password, user.role, user.is_active, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
