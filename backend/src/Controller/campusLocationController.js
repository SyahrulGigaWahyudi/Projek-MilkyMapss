const campusLocationModel = require('../Model/campusLocationModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getCampusLocations(req, res) {
  try {
    await sendQueryResult(res, campusLocationModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCampusLocationById(req, res) {
  try {
    const [rows] = await campusLocationModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Campus location not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createCampusLocation(req, res) {
  try {
    const result = await campusLocationModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCampusLocation(req, res) {
  try {
    const result = await campusLocationModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Campus location not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteCampusLocation(req, res) {
  try {
    const result = await campusLocationModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Campus location not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCampusLocations,
  getCampusLocationById,
  createCampusLocation,
  updateCampusLocation,
  deleteCampusLocation
};
