import express from 'express';
import { createProducto, updateProducto, getAllProductos, deleteProducto, getProductoById, uploadProductoImage } from '../controllers/productoController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.get('/', getAllProductos);
router.post('/', authenticate, createProducto);
router.get('/:id', getProductoById);
router.put('/:id', authenticate, updateProducto);
router.patch('/:id', authenticate, deleteProducto);
router.post('/:id/upload-image', authenticate, upload.single('imagen'), uploadProductoImage);

export default router;