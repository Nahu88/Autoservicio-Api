import UsuarioModel from "../models/Usuarios.js";
import { sendResponse } from '../utils/customResponse.js';
import { validatePaginationParams } from '../utils/pagination.js';
import { hashPassword } from '../utils/passwordUtils.js';

export const getAllUsuarios = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validation = validatePaginationParams(page, limit);

    if (!validation.isValid) {
      return sendResponse(res, 400, 'Parámetros de paginación inválidos', validation.errors);
    }

    const { usuarios, total } = await UsuarioModel.getAll(page, limit);

    if (usuarios.length === 0) {
      return sendResponse(res, 404, 'No se encontraron usuarios');
    }

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return sendResponse(res, 200, 'Usuarios obtenidos exitosamente', {
      usuarios,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    return sendResponse(res, 200, 'Usuario obtenido exitosamente', usuario);
  } catch (error) {
    next(error);
  }
}

export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioData = req.body;

    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    usuarioData.updatedBy = req.usuario;
    usuarioData.createdBy = req.usuario;
    usuarioData.password = await hashPassword(usuarioData.password);

    const updatedUsuario = await UsuarioModel.update(id, usuarioData);
    return sendResponse(res, 200, 'Usuario actualizado correctamente', updatedUsuario);
  } catch (error) {
    next(error);
  }
}

export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    await UsuarioModel.delete(id);
    return sendResponse(res, 200, 'Usuario eliminado correctamente');
  } catch (error) {
    next(error);
  }
}