const db = require('../config/databasis');

async function findAll(filters = {}) {
  let query = `
    SELECT r.*, cp.full_name as reviewer_name, cp.profile_picture as reviewer_avatar, u.username, fp.name as food_place_name
    FROM reviews r
    LEFT JOIN customer_profiles cp ON r.user_id = cp.user_id
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN food_places fp ON r.food_place_id = fp.id
  `;
  const params = [];
  const conditions = [];

  if (filters.food_place_id) {
    conditions.push('r.food_place_id = ?');
    params.push(filters.food_place_id);
  }

  if (filters.user_id) {
    conditions.push('r.user_id = ?');
    params.push(filters.user_id);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(Number(filters.limit));
  }

  return db.query(query, params);
}

async function findById(id) {
  return db.query(`
    SELECT r.*, cp.full_name as reviewer_name, cp.profile_picture as reviewer_avatar, u.username, fp.name as food_place_name
    FROM reviews r
    LEFT JOIN customer_profiles cp ON r.user_id = cp.user_id
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN food_places fp ON r.food_place_id = fp.id
    WHERE r.id = ?
  `, [id]);
}

async function create(review) {
  return db.query(
    'INSERT INTO reviews (user_id, food_place_id, rating, comment, is_published) VALUES (?, ?, ?, ?, ?)',
    [review.user_id, review.food_place_id, review.rating, review.comment, review.is_published ?? 1]
  );
}

async function update(id, review) {
  const fields = [];
  const params = [];
  if (review.rating !== undefined) { fields.push('rating = ?'); params.push(review.rating); }
  if (review.comment !== undefined) { fields.push('comment = ?'); params.push(review.comment); }
  if (fields.length === 0) return [{ affectedRows: 0 }];
  params.push(id);
  return db.query(`UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`, params);
}

async function remove(id) {
  return db.query('DELETE FROM reviews WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };