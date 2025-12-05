import express from 'express';
import { login, getProfile, register } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', authenticate, register);
router.get('/profile', authenticate, getProfile);

export default router;