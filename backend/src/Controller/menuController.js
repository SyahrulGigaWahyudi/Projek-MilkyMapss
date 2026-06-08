const menuModel = require('../Model/menuModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getMenus(req, res) {
  try {
    await sendQueryResult(res, menuModel.findAll(req.query));
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
    // Cek duplikat nama menu di tempat makan yang sama
    const result = await menuModel.findAll({ food_place_id: req.body.food_place_id });
    const existing = result[0] || [];
    const newName = (req.body.name || '').trim().toLowerCase();
    const duplicate = existing.find(m => (m.name || '').trim().toLowerCase() === newName);
    if (duplicate) {
      return res.status(409).json({ message: `Menu "${req.body.name}" sudah ada di tempat makan ini. Gunakan nama menu yang berbeda.` });
    }
    const insertResult = await menuModel.create(req.body);
    res.status(201).json({ id: insertResult[0].insertId });
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
