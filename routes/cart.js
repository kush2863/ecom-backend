import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/:userId?', requireAuth, getCart);
router.post('/add', requireAuth, addToCart);
router.post('/remove', requireAuth, removeFromCart);
export default router;
