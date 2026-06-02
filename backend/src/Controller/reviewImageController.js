const reviewImageModel = require('../Model/reviewImageModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getReviewImages(req, res) {
  try {
    await sendQueryResult(res, reviewImageModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getReviewImageById(req, res) {
  try {
    const [rows] = await reviewImageModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Review image not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createReviewImage(req, res) {
  try {
    const result = await reviewImageModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReviewImage(req, res) {
  try {
    const result = await reviewImageModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review image not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReviewImage(req, res) {
  try {
    const result = await reviewImageModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review image not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getReviewImages,
  getReviewImageById,
  createReviewImage,
  updateReviewImage,
  deleteReviewImage
};
