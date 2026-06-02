const categoryModel = require('../Model/categoryModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getCategories(req, res) {
  try {
    await sendQueryResult(res, categoryModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCategoryById(req, res) {
  try {
    const [rows] = await categoryModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Category not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createCategory(req, res) {
  try {
    const result = await categoryModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    const result = await categoryModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const result = await categoryModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
