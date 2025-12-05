import express from 'express';
import { addItemToCart, getItemsById } from '../controllers/carritoItemsController.js';

const router = express.Router();

router.post('/', addItemToCart);
router.get('/:id', getItemsById);

export default router;