const userModel = require('../Model/userModel');
const customerProfileModel = require('../Model/customerProfileModel');
const campusLocationModel = require('../Model/campusLocationModel');
const categoryModel = require('../Model/categoryModel');
const foodPlaceModel = require('../Model/foodPlaceModel');
const menuModel = require('../Model/menuModel');
const reviewModel = require('../Model/reviewModel');
const tagModel = require('../Model/tagModel');
const favoriteModel = require('../Model/favoriteModel');
const foodPlaceImageModel = require('../Model/foodPlaceImageModel');
const operatingHourModel = require('../Model/operatingHourModel');
const reviewImageModel = require('../Model/reviewImageModel');
const foodPlaceTagModel = require('../Model/foodPlaceTagModel');

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

async function getFoodPlaces(req, res) {
  try {
    await sendQueryResult(res, foodPlaceModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFoodPlaceById(req, res) {
  try {
    const [rows] = await foodPlaceModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Food place not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFoodPlace(req, res) {
  try {
    const result = await foodPlaceModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFoodPlace(req, res) {
  try {
    const result = await foodPlaceModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFoodPlace(req, res) {
  try {
    const result = await foodPlaceModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

async function getReviews(req, res) {
  try {
    await sendQueryResult(res, reviewModel.findAll());
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
    const result = await reviewModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReview(req, res) {
  try {
    const result = await reviewModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const result = await reviewModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

async function getFoodPlaceImages(req, res) {
  try {
    await sendQueryResult(res, foodPlaceImageModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFoodPlaceImageById(req, res) {
  try {
    const [rows] = await foodPlaceImageModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Food place image not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFoodPlaceImage(req, res) {
  try {
    const result = await foodPlaceImageModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFoodPlaceImage(req, res) {
  try {
    const result = await foodPlaceImageModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place image not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFoodPlaceImage(req, res) {
  try {
    const result = await foodPlaceImageModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place image not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

async function getReviewImages(req, res) {
  try {
    await sendQueryResult(res, reviewImageModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getReviewImageById(req, res) {
  try {
    const [rows] = await reviewImageModel.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Review image not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createReviewImage(req, res) {
  try {
    const result = await reviewImageModel.create(req.body);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateReviewImage(req, res) {
  try {
    const result = await reviewImageModel.update(req.params.id, req.body);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review image not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteReviewImage(req, res) {
  try {
    const result = await reviewImageModel.remove(req.params.id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Review image not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFoodPlaceTags(req, res) {
  try {
    await sendQueryResult(res, foodPlaceTagModel.findAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createFoodPlaceTag(req, res) {
  try {
    const result = await foodPlaceTagModel.create(req.body);
    res.status(201).json({ inserted: true, id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFoodPlaceTag(req, res) {
  try {
    const { food_place_id, tag_id } = req.params;
    const result = await foodPlaceTagModel.remove(food_place_id, tag_id);
    if (result[0].affectedRows === 0) return res.status(404).json({ message: 'Food place tag relation not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCustomerProfiles,
  getCustomerProfileById,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
  getCampusLocations,
  getCampusLocationById,
  createCampusLocation,
  updateCampusLocation,
  deleteCampusLocation,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getFoodPlaces,
  getFoodPlaceById,
  createFoodPlace,
  updateFoodPlace,
  deleteFoodPlace,
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  getFoodPlaceImages,
  getFoodPlaceImageById,
  createFoodPlaceImage,
  updateFoodPlaceImage,
  deleteFoodPlaceImage,
  getOperatingHours,
  getOperatingHourById,
  createOperatingHour,
  updateOperatingHour,
  deleteOperatingHour,
  getReviewImages,
  getReviewImageById,
  createReviewImage,
  updateReviewImage,
  deleteReviewImage,
  getFoodPlaceTags,
  createFoodPlaceTag,
  deleteFoodPlaceTag
};
