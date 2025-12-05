import { verifyToken } from '../utils/jwtUtils.js';
import UsuarioModel from '../models/Usuarios.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status: 401, message: 'Token no proporcionado' });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 401, message: 'Formato de token inválido. Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 401, message: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);
    const usuario = await UsuarioModel.getById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ status: 401, message: 'Usuario no encontrado' });
    }
    req.usuario = usuario.id;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'Token inválido o expirado' });
  }
}

export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({ status: 401, message: 'No autenticado' });
      }
      if (!allowedRoles.includes(req.usuario.role)) {
        return res.status(403).json({ status: 403, message: 'No tiene permiso para acceder a esta ruta' });
      }
      next();
    } catch (error) {
      return res.status(403).json({ status: 403, message: 'Acceso denegado' });
    }
  }
}