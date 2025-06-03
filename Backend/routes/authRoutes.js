const express = require('express');
const router = express.Router();

// Controller menggunakan Sequelize
const { register, login, getProfile } = require('../controllers/authController');

// Middleware otentikasi menggunakan Sequelize
const auth = require('../middleware/authMiddleware');

// Rute untuk register
router.post('/register', register);

// Rute untuk login
router.post('/login', login);

// Rute untuk mendapatkan profil pengguna (dengan autentikasi)
router.get('/profile', auth, getProfile);

module.exports = router;
