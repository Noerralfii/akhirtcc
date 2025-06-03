import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);

export default router;
