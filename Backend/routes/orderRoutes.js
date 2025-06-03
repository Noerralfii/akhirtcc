import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(auth);

router.post('/', createOrder);
router.get('/', getOrders);

export default router;
