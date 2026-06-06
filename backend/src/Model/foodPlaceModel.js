const db = require('../config/databasis');

async function findAll(filters = {}) {
  let query = `
    SELECT fp.*, 
    IF(fp.opening_time IS NOT NULL AND fp.closing_time IS NOT NULL,
      IF(fp.closing_time < fp.opening_time, 
        CURRENT_TIME() >= fp.opening_time OR CURRENT_TIME() <= fp.closing_time, 
        CURRENT_TIME() >= fp.opening_time AND CURRENT_TIME() <= fp.closing_time),
      0
    ) AS is_open,
    MIN(m.price) AS min_price,
    MAX(m.price) AS max_price`;
    
  if (filters.campus_location_id) {
    query += `, ST_Distance_Sphere(POINT(fp.longitude, fp.latitude), POINT(cl.longitude, cl.latitude)) AS distance_meters`;
  }
  
  query += ` FROM food_places fp`;
  query += ` LEFT JOIN menus m ON m.food_place_id = fp.id`;
  
  if (filters.campus_location_id) {
    query += ` JOIN campus_locations cl ON fp.campus_location_id = cl.id`;
  }
  const params = [];
  const conditions = [];

  if (filters.campus_location_id) {
    conditions.push('fp.campus_location_id = ?');
    params.push(filters.campus_location_id);
  }

  if (filters.search) {
    conditions.push('(fp.name LIKE ? OR fp.description LIKE ?)');
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' GROUP BY fp.id';

  if (filters.sort === 'distance' && filters.campus_location_id) {
    query += ' ORDER BY distance_meters ASC';
  } else if (filters.sort === 'rating') {
    query += ' ORDER BY fp.average_rating DESC';
  } else if (filters.sort === 'price_asc') {
    query += ' ORDER BY min_price IS NULL ASC, min_price ASC';
  }

  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(Number(filters.limit));
  }

  return db.query(query, params);
}

async function findById(id) {
  return db.query(`
    SELECT *, 
    IF(opening_time IS NOT NULL AND closing_time IS NOT NULL,
      IF(closing_time < opening_time, 
        CURRENT_TIME() >= opening_time OR CURRENT_TIME() <= closing_time, 
        CURRENT_TIME() >= opening_time AND CURRENT_TIME() <= closing_time),
      0
    ) AS is_open 
    FROM food_places WHERE id = ?
  `, [id]);
}

async function create(place) {
  return db.query(
    'INSERT INTO food_places (campus_location_id, category_id, name, slug, description, detail_location, latitude, longitude, gmaps_link, phone, email, thumbnail, price_range, opening_time, closing_time, is_active, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [place.campus_location_id, place.category_id, place.name, place.slug, place.description, place.detail_location, place.latitude, place.longitude, place.gmaps_link || null, place.phone, place.email, place.thumbnail, place.price_range, place.opening_time || null, place.closing_time || null, place.is_active ?? 1, place.is_verified ?? 0]
  );
}

async function update(id, place) {
  return db.query(
    'UPDATE food_places SET campus_location_id = ?, category_id = ?, name = ?, slug = ?, description = ?, detail_location = ?, latitude = ?, longitude = ?, gmaps_link = ?, phone = ?, email = ?, thumbnail = ?, price_range = ?, opening_time = ?, closing_time = ?, is_active = ?, is_verified = ? WHERE id = ?',
    [place.campus_location_id, place.category_id, place.name, place.slug, place.description, place.detail_location, place.latitude, place.longitude, place.gmaps_link || null, place.phone, place.email, place.thumbnail, place.price_range, place.opening_time || null, place.closing_time || null, place.is_active ?? 1, place.is_verified ?? 0, id]
  );
}

async function remove(id) {
  return db.query('DELETE FROM food_places WHERE id = ?', [id]);
}

module.exports = { findAll, findById, create, update, remove };
