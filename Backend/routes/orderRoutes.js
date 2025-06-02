const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createOrder, getOrders } = require('../controllers/orderController');

router.use(auth);
router.post('/', createOrder);
router.get('/', getOrders);

module.exports = router;