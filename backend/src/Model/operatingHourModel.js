const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM operating_hours');
}

async function findById(id) {
  return db.query('SELECT * FROM operating_hours WHERE id = ?', [id]);
}

async function create(hours) {
  return db.query(
    'INSERT INTO operating_hours (food_place_id, day_of_week, open_time, close_time, is_closed) VALUES (?, ?, ?, ?, ?)',
    [hours.food_place_id, hours.day_of_week, hours.open_time, hours.close_time, hours.is_closed ?? 0]
  );
}

async function update(id, hours) {
  return db.query(
    'UPDATE operating_hours SET food_place_id = ?, day_of_week = ?, open_time = ?, close_time = ?, is_closed = ? WHERE id = ?',
    [hours.food_place_id, hours.day_of_week, hours.open_time, hours.close_time, hours.is_closed ?? 0, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM operating_hours WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
