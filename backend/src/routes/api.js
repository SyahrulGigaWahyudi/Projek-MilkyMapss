const express = require('express');
const router = express.Router();
const {
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
} = require('../Controller');

// Users
router.get('/users', users.getUsers);
router.get('/users/:id', users.getUserById);
router.post('/users', users.createUser);
router.put('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

// Customer profiles
router.get('/customer-profiles', customerProfiles.getCustomerProfiles);
router.get('/customer-profiles/:id', customerProfiles.getCustomerProfileById);
router.post('/customer-profiles', customerProfiles.createCustomerProfile);
router.put('/customer-profiles/:id', customerProfiles.updateCustomerProfile);
router.delete('/customer-profiles/:id', customerProfiles.deleteCustomerProfile);

// Campus locations
router.get('/campus-locations', campusLocations.getCampusLocations);
router.get('/campus-locations/:id', campusLocations.getCampusLocationById);
router.post('/campus-locations', campusLocations.createCampusLocation);
router.put('/campus-locations/:id', campusLocations.updateCampusLocation);
router.delete('/campus-locations/:id', campusLocations.deleteCampusLocation);

// Categories
router.get('/categories', categories.getCategories);
router.get('/categories/:id', categories.getCategoryById);
router.post('/categories', categories.createCategory);
router.put('/categories/:id', categories.updateCategory);
router.delete('/categories/:id', categories.deleteCategory);

// Food places
router.get('/food-places', foodPlaces.getFoodPlaces);
router.get('/food-places/:id', foodPlaces.getFoodPlaceById);
router.post('/food-places', foodPlaces.createFoodPlace);
router.put('/food-places/:id', foodPlaces.updateFoodPlace);
router.delete('/food-places/:id', foodPlaces.deleteFoodPlace);

// Menus
router.get('/menus', menus.getMenus);
router.get('/menus/:id', menus.getMenuById);
router.post('/menus', menus.createMenu);
router.put('/menus/:id', menus.updateMenu);
router.delete('/menus/:id', menus.deleteMenu);

// Reviews
router.get('/reviews', reviews.getReviews);
router.get('/reviews/:id', reviews.getReviewById);
router.post('/reviews', reviews.createReview);
router.put('/reviews/:id', reviews.updateReview);
router.delete('/reviews/:id', reviews.deleteReview);

// Tags
router.get('/tags', tags.getTags);
router.get('/tags/:id', tags.getTagById);
router.post('/tags', tags.createTag);
router.put('/tags/:id', tags.updateTag);
router.delete('/tags/:id', tags.deleteTag);

// Favorites
router.get('/favorites', favorites.getFavorites);
router.get('/favorites/:id', favorites.getFavoriteById);
router.post('/favorites', favorites.createFavorite);
router.put('/favorites/:id', favorites.updateFavorite);
router.delete('/favorites/:id', favorites.deleteFavorite);

// Food place images
router.get('/food-place-images', foodPlaceImages.getFoodPlaceImages);
router.get('/food-place-images/:id', foodPlaceImages.getFoodPlaceImageById);
router.post('/food-place-images', foodPlaceImages.createFoodPlaceImage);
router.put('/food-place-images/:id', foodPlaceImages.updateFoodPlaceImage);
router.delete('/food-place-images/:id', foodPlaceImages.deleteFoodPlaceImage);

// Operating hours
router.get('/operating-hours', operatingHours.getOperatingHours);
router.get('/operating-hours/:id', operatingHours.getOperatingHourById);
router.post('/operating-hours', operatingHours.createOperatingHour);
router.put('/operating-hours/:id', operatingHours.updateOperatingHour);
router.delete('/operating-hours/:id', operatingHours.deleteOperatingHour);

// Review images
router.get('/review-images', reviewImages.getReviewImages);
router.get('/review-images/:id', reviewImages.getReviewImageById);
router.post('/review-images', reviewImages.createReviewImage);
router.put('/review-images/:id', reviewImages.updateReviewImage);
router.delete('/review-images/:id', reviewImages.deleteReviewImage);

// Food place tags
router.get('/food-place-tags', foodPlaceTags.getFoodPlaceTags);
router.post('/food-place-tags', foodPlaceTags.createFoodPlaceTag);
router.delete('/food-place-tags/:food_place_id/:tag_id', foodPlaceTags.deleteFoodPlaceTag);

module.exports = router;