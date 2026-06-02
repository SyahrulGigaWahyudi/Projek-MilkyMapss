const customerProfileModel = require('../Model/customerProfileModel');

async function sendQueryResult(res, promise) {
  const [rows] = await promise;
  return res.json(rows);
}

async function getCustomerProfiles(req, res) {
  try {
    await sendQueryResult(res, customerProfileModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCustomerProfileById(req, res) {
  try {
    const [rows] = await customerProfileModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Customer profile not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createCustomerProfile(req, res) {
  try {
    const result = await customerProfileModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCustomerProfile(req, res) {
  try {
    const result = await customerProfileModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Customer profile not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteCustomerProfile(req, res) {
  try {
    const result = await customerProfileModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Customer profile not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCustomerProfiles,
  getCustomerProfileById,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile
};
