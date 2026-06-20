const reviewModel = require('../Model/reviewModel');
const db = require('../config/databasis');
const { censorText } = require('../utils/Profanityfilter');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

// Helper: hitung ulang average_rating & total_reviews di food_places
async function recalcRating(foodPlaceId) {
  await db.query(
    `UPDATE food_places SET 
       average_rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE food_place_id = ?), 0),
       total_reviews  = (SELECT COUNT(*) FROM reviews WHERE food_place_id = ?)
     WHERE id = ?`,
    [foodPlaceId, foodPlaceId, foodPlaceId]
  );
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

    let wasFiltered = false;
    if (req.body.comment) {
      const filterResult = censorText(req.body.comment);
      req.body.comment = filterResult.text;
      wasFiltered = filterResult.wasFiltered;
    }

    const result = await reviewModel.create(req.body);
    await recalcRating(req.body.food_place_id);
    res.status(201).json({ id: result[0].insertId, filtered: wasFiltered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReview(req, res) {
  try {
    // Ambil food_place_id sebelum update
    const [rows] = await reviewModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Review not found' });
    const foodPlaceId = rows[0].food_place_id;

    let wasFiltered = false;
    if (req.body.comment) {
      const filterResult = censorText(req.body.comment);
      req.body.comment = filterResult.text;
      wasFiltered = filterResult.wasFiltered;
    }

    const result = await reviewModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    await recalcRating(foodPlaceId);
    res.json({ updated: true, filtered: wasFiltered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    // Ambil food_place_id sebelum hapus
    const [rows] = await reviewModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Review not found' });
    const foodPlaceId = rows[0].food_place_id;

    const result = await reviewModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    await recalcRating(foodPlaceId);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getReviews, getReviewById, createReview, updateReview, deleteReview };