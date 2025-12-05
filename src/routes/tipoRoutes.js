import express from 'express';
import { getAllTipos, getTipoById } from '../controllers/tipoController.js';

const router = express.Router();

router.get('/', getAllTipos);
router.get('/:id', getTipoById);

export default router;