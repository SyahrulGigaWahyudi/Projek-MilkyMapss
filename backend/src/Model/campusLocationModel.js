const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM campus_locations');
}

async function findById(id) {
  return db.query('SELECT * FROM campus_locations WHERE id = ?', [id]);
}

async function create(location) {
  return db.query(
    'INSERT INTO campus_locations (name, code, address, description, latitude, longitude, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [location.name, location.code, location.address, location.description, location.latitude, location.longitude, location.image, location.is_active ?? 1]
  );
}

async function update(id, location) {
  return db.query(
    'UPDATE campus_locations SET name = ?, code = ?, address = ?, description = ?, latitude = ?, longitude = ?, image = ?, is_active = ? WHERE id = ?',
    [location.name, location.code, location.address, location.description, location.latitude, location.longitude, location.image, location.is_active ?? 1, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM campus_locations WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
