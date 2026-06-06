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

async function updateByUserId(userId, profile) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE customer_profiles SET full_name = ? WHERE user_id = ?',
      [profile.full_name, userId]
    );

    const userUpdates = [];
    const userParams = [];
    if (profile.email) { userUpdates.push('email = ?'); userParams.push(profile.email); }
    if (profile.username) { userUpdates.push('username = ?'); userParams.push(profile.username); }
    
    if (userUpdates.length > 0) {
      userParams.push(userId);
      await conn.query(`UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`, userParams);
    }

    await conn.commit();
    return [[{ affectedRows: 1 }]];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function remove(id) {
  return db.query('DELETE FROM customer_profiles WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, updateByUserId, remove };
