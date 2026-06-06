const reviewModel = require('../Model/reviewModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getReviews(req, res) {
  try {
    await sendQueryResult(res, reviewModel.findAll(req.query));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getReviewById(req, res) {
  try {
    const [rows] = await reviewModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Review not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createReview(req, res) {
  try {
    req.body.user_id = req.user.id;
    const result = await reviewModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReview(req, res) {
  try {
    const result = await reviewModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const result = await reviewModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getReviews, getReviewById, createReview, updateReview, deleteReview };
