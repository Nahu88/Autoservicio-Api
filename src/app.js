import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import tipoRoutes from './routes/tipoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import carritoRoutes from './routes/carritoRoutes.js';
import carritoItemsRoutes from './routes/carritoItemsRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tipos', tipoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/carritos', carritoRoutes);
app.use('/api/carrito-items', carritoItemsRoutes);
app.use('/api/ventas', ventaRoutes);

app.use('/api/admin', adminRoutes);

export default app;