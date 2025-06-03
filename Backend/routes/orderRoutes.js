const express = require('express');
const router = express.Router();

// Middleware otentikasi menggunakan Sequelize
const auth = require('../middleware/authMiddleware');

// Controller yang telah diubah menggunakan Sequelize
const { createOrder, getOrders } = require('../controllers/orderController');

// Semua endpoint membutuhkan autentikasi
router.use(auth);

// Buat order baru
router.post('/', createOrder);

// Ambil semua order untuk user yang sedang login
router.get('/', getOrders);

module.exports = router;
