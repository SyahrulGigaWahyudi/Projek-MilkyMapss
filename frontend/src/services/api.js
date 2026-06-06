import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Food Places
export const getFoodPlaces = (params) => API.get('/food-places', { params });
export const getFoodPlaceById = (id) => API.get(`/food-places/${id}`);
export const createFoodPlace = (data) => API.post('/food-places', data);
export const updateFoodPlace = (id, data) => API.put(`/food-places/${id}`, data);

// Campus
export const getCampuses = () => API.get('/campus-locations');

// Menus
export const getMenus = (params) => API.get('/menus', { params });
export const getMenuById = (id) => API.get(`/menus/${id}`);
export const createMenu = (data) => API.post('/menus', data);
export const updateMenu = (id, data) => API.put(`/menus/${id}`, data);

// Reviews
export const getReviews = (params) => API.get('/reviews', { params });
export const createReview = (data) => API.post('/reviews', data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Favorites
export const getFavorites = (params) => API.get('/favorites', { params });
export const addFavorite = (data) => API.post('/favorites', data);
export const removeFavorite = (id) => API.delete(`/favorites/${id}`);

// User profile
export const updateProfile = (id, data) => API.put(`/customer-profiles/${id}`, data);

// Avatar upload
export const uploadAvatar = (formData) => API.post('/users/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;
