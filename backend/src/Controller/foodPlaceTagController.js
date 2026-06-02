const foodPlaceTagModel = require('../Model/foodPlaceTagModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getFoodPlaceTags(req, res) {
  try {
    await sendQueryResult(res, foodPlaceTagModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFoodPlaceTag(req, res) {
  try {
    const result = await foodPlaceTagModel.create(req.body);
    res.status(201).json({ inserted: true, id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFoodPlaceTag(req, res) {
  try {
    const { food_place_id, tag_id } = req.params;
    const result = await foodPlaceTagModel.remove(food_place_id, tag_id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place tag relation not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getFoodPlaceTags, createFoodPlaceTag, deleteFoodPlaceTag };
