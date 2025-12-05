import express from 'express';
import { createCliente, getClientsPaginated } from '../controllers/clienteController.js';

const router = express.Router();

router.post('/', createCliente);
router.get('/', getClientsPaginated);

export default router;