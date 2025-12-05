import express from 'express';
import { createCarrito, getActiveCarrito, updateEstadoCarrito } from '../controllers/carritoController.js';

const router = express.Router();

router.post('/', createCarrito);
router.get('/:id', getActiveCarrito);
router.put('/:id', updateEstadoCarrito);

export default router;