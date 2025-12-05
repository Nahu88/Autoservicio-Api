import jwt from 'jsonwebtoken';

import environments from '../config/environments.js'

export const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, environments.jwt.secret, { expiresIn: environments.jwt.expires_in });
    return token;
  } catch (error) {
    throw new Error('Error al generar el token');
  }
}

export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error('Token no proporcionado');
    }
    const decoded = jwt.verify(token, environments.jwt.secret);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}