import UsuarioModel from '../models/Usuarios.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/jwtUtils.js';
import { validateLogin, validateRegister } from '../utils/validations.js';
import { sendResponse } from '../utils/customResponse.js';

export const login = async (req, res, next) => {
  try {
    const loginData = req.body;
    const validationErrors = validateLogin(loginData);

    if (validationErrors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', validationErrors);
    }

    const usuario = await UsuarioModel.getByEmail(loginData.email);
    if (!usuario) {
      return sendResponse(res, 401, 'Credenciales inválidas');
    }

    const isValidPassword = await comparePassword(loginData.password, usuario.password);
    if (!isValidPassword) {
      return sendResponse(res, 401, 'Credenciales inválidas');
    }

    const token = generateToken({ id: usuario.id })

    return sendResponse(res, 200, 'Login exitoso', token);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const usuario = await UsuarioModel.getById(req.usuario);
    if (!usuario) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    return sendResponse(res, 200, 'Perfil obtenido exitosamente', usuario);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const usuarioData = req.body;
    const validationErrors = validateRegister(usuarioData);
    const userId = req.usuario;

    if (validationErrors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', { errors: validationErrors });
    }
    const userExists = await UsuarioModel.getByEmail(usuarioData.email);
    if (userExists) {
      return sendResponse(res, 400, 'El correo electrónico ya está en uso');
    }

    const passwordHashed = await hashPassword(usuarioData.password);
    usuarioData.password = passwordHashed;
    usuarioData.createdBy = userId;
    usuarioData.updatedBy = userId;

    const newUsuario = await UsuarioModel.create(usuarioData);
    return sendResponse(res, 201, 'Usuario registrado exitosamente', newUsuario);
  } catch (error) {
    next(error);
  }
}
