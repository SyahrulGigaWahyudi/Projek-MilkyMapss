const operatingHourModel = require('../Model/operatingHourModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getOperatingHours(req, res) {
  try {
    await sendQueryResult(res, operatingHourModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOperatingHourById(req, res) {
  try {
    const [rows] = await operatingHourModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Operating hour not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createOperatingHour(req, res) {
  try {
    const result = await operatingHourModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateOperatingHour(req, res) {
  try {
    const result = await operatingHourModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Operating hour not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteOperatingHour(req, res) {
  try {
    const result = await operatingHourModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Operating hour not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getOperatingHours,
  getOperatingHourById,
  createOperatingHour,
  updateOperatingHour,
  deleteOperatingHour
};
