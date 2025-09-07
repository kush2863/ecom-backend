import express from 'express';
import { listItems, getItem, createItem } from '../controllers/itemsController.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/', listItems);
router.get('/:id', getItem);
router.post('/', requireAuth, createItem);
export default router;
