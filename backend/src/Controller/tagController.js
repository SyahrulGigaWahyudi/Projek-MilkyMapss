const tagModel = require('../Model/tagModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getTags(req, res) {
  try {
    await sendQueryResult(res, tagModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTagById(req, res) {
  try {
    const [rows] = await tagModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Tag not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTag(req, res) {
  try {
    const result = await tagModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTag(req, res) {
  try {
    const result = await tagModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Tag not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTag(req, res) {
  try {
    const result = await tagModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Tag not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getTags, getTagById, createTag, updateTag, deleteTag };
