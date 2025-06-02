const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.use(auth);
router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);

module.exports = router;