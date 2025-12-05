import express from 'express';
import { checkout, createVenta, getVentaById, getVentasPaginated, updateVentaEstado } from '../controllers/ventaController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/checkout', checkout);
router.post('/', createVenta);
router.get('/', getVentasPaginated);
router.get('/:id', authenticate, getVentaById);
router.put('/:id/estado', authenticate, updateVentaEstado);

export default router;