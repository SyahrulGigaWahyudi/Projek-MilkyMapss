const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage untuk foto tempat makan
const foodStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'milkymaps/food-places',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }]
  }
});

// Storage untuk avatar profil
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'milkymaps/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', quality: 'auto' }]
  }
});

const uploadFood = multer({
  storage: foodStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

module.exports = { cloudinary, uploadFood, uploadAvatar };
