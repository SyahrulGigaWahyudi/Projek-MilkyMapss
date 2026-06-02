const foodPlaceModel = require('../Model/foodPlaceModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getFoodPlaces(req, res) {
  try {
    await sendQueryResult(res, foodPlaceModel.findAll());
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
    const result = await foodPlaceModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFoodPlace(req, res) {
  try {
    const result = await foodPlaceModel.update(req.params.id, req.body);
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
