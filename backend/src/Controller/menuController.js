const menuModel = require('../Model/menuModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getMenus(req, res) {
  try {
    await sendQueryResult(res, menuModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMenuById(req, res) {
  try {
    const [rows] = await menuModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Menu not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createMenu(req, res) {
  try {
    const result = await menuModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMenu(req, res) {
  try {
    const result = await menuModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Menu not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteMenu(req, res) {
  try {
    const result = await menuModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Menu not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getMenus, getMenuById, createMenu, updateMenu, deleteMenu };
