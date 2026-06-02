const favoriteModel = require('../Model/favoriteModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getFavorites(req, res) {
  try {
    await sendQueryResult(res, favoriteModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFavoriteById(req, res) {
  try {
    const [rows] = await favoriteModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Favorite not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFavorite(req, res) {
  try {
    const result = await favoriteModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFavorite(req, res) {
  try {
    const result = await favoriteModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFavorite(req, res) {
  try {
    const result = await favoriteModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getFavorites, getFavoriteById, createFavorite, updateFavorite, deleteFavorite };
