const foodPlaceModel = require('../Model/foodPlaceModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
}

async function getFoodPlaces(req, res) {
  try {
    await sendQueryResult(res, foodPlaceModel.findAll(req.query));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFoodPlaceById(req, res) {
  try {
    const [rows] = await foodPlaceModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Food place not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFoodPlace(req, res) {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.name) {
      payload.slug = generateSlug(payload.name);
    }
    const result = await foodPlaceModel.create(payload);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFoodPlace(req, res) {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.name) {
      payload.slug = generateSlug(payload.name);
    }
    const result = await foodPlaceModel.update(req.params.id, payload);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFoodPlace(req, res) {
  try {
    const result = await foodPlaceModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getFoodPlaces,
  getFoodPlaceById,
  createFoodPlace,
  updateFoodPlace,
  deleteFoodPlace
};
