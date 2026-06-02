const users = require('./userController');
const customerProfiles = require('./customerProfileController');
const campusLocations = require('./campusLocationController');
const categories = require('./categoryController');
const foodPlaces = require('./foodPlaceController');
const menus = require('./menuController');
const reviews = require('./reviewController');
const tags = require('./tagController');
const favorites = require('./favoriteController');
const foodPlaceImages = require('./foodPlaceImageController');
const operatingHours = require('./operatingHourController');
const reviewImages = require('./reviewImageController');
const foodPlaceTags = require('./foodPlaceTagController');

module.exports = {
  users,
  customerProfiles,
  campusLocations,
  categories,
  foodPlaces,
  menus,
  reviews,
  tags,
  favorites,
  foodPlaceImages,
  operatingHours,
  reviewImages,
  foodPlaceTags
};
