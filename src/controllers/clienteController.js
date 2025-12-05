import ClienteModel from '../models/Cliente.js';

import { validateCliente } from '../utils/validations.js';
import { sendResponse } from '../utils/customResponse.js';
import { validatePaginationParams } from '../utils/pagination.js';

export const createCliente = async (req, res, next) => {
  try {
    const clienteData = req.body;
    const errors = validateCliente(clienteData);
    if (errors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', errors);
    }
    const newCliente = await ClienteModel.create(clienteData);
    return sendResponse(res, 201, 'Cliente creado exitosamente', newCliente);
  } catch (error) {
    next(error);
  }
}

export const getClientsPaginated = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validation = validatePaginationParams(page, limit);

    if (!validation.isValid) {
      return sendResponse(res, 400, 'Parámetros de paginación inválidos', validation.errors);
    }

    const { clientes, total } = await ClienteModel.getAllClientsPaginated(page, limit);

    if (clientes.length === 0) {
      return sendResponse(res, 404, 'No se encontraron clientes');
    }

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return sendResponse(res, 200, 'Clientes obtenidos exitosamente', {
      clientes,
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