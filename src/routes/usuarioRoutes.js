import express from 'express';
import { getAllUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllUsuarios);
router.get('/:id', authenticate, getUsuarioById);
router.put('/:id', authenticate, updateUsuario);
router.delete('/:id', authenticate, deleteUsuario);

export default router;