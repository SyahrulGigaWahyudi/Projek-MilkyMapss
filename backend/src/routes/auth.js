const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../Controller/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
// Forgot/reset password routes removed

module.exports = router;
