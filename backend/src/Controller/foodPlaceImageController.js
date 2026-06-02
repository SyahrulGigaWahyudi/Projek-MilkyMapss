const foodPlaceImageModel = require('../Model/foodPlaceImageModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getFoodPlaceImages(req, res) {
  try {
    await sendQueryResult(res, foodPlaceImageModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFoodPlaceImageById(req, res) {
  try {
    const [rows] = await foodPlaceImageModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Food place image not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFoodPlaceImage(req, res) {
  try {
    const result = await foodPlaceImageModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFoodPlaceImage(req, res) {
  try {
    const result = await foodPlaceImageModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place image not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFoodPlaceImage(req, res) {
  try {
    const result = await foodPlaceImageModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place image not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getFoodPlaceImages,
  getFoodPlaceImageById,
  createFoodPlaceImage,
  updateFoodPlaceImage,
  deleteFoodPlaceImage
};
