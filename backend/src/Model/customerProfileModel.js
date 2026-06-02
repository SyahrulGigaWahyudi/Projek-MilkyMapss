const db = require('../config/databasis');

async function findAll() {
  return db.query('SELECT * FROM customer_profiles');
}

async function findById(id) {
  return db.query('SELECT * FROM customer_profiles WHERE id = ?', [id]);
}

async function create(profile) {
  return db.query(
    'INSERT INTO customer_profiles (user_id, full_name, phone_number, profile_picture, bio, faculty, student_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [profile.user_id, profile.full_name, profile.phone_number, profile.profile_picture, profile.bio, profile.faculty, profile.student_id]
  );
}

async function update(id, profile) {
  return db.query(
    'UPDATE customer_profiles SET user_id = ?, full_name = ?, phone_number = ?, profile_picture = ?, bio = ?, faculty = ?, student_id = ? WHERE id = ?',
    [profile.user_id, profile.full_name, profile.phone_number, profile.profile_picture, profile.bio, profile.faculty, profile.student_id, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM customer_profiles WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
