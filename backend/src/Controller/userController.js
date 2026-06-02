const userModel = require('../Model/userModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getUsers(req, res) {
  try {
    await sendQueryResult(res, userModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const [rows] = await userModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const result = await userModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const result = await userModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const result = await userModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
