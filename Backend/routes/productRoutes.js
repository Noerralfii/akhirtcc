const express = require('express');
const router = express.Router();

// Controller sudah berbasis Sequelize
const { getAllProducts, getProductById } = require('../controllers/productController');

// Dapatkan semua produk
router.get('/', getAllProducts);

// Dapatkan produk berdasarkan ID
router.get('/:id', getProductById);

module.exports = router;
