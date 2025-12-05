import CarritoModel from '../models/Carrito.js';
import { sendResponse } from '../utils/customResponse.js';
import { validateCarrito, validateCarritoEstado } from '../utils/validations.js';

export const createCarrito = async (req, res, next) => {
  try {
    const { cliente_id } = req.body;
    const errors = validateCarrito(cliente_id);

    if (errors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', { errors });
    }

    const carritoId = await CarritoModel.create(cliente_id);
    return sendResponse(res, 201, 'Carrito creado exitosamente', { carritoId });
  } catch (error) {
    next(error);
  }
}

export const getActiveCarrito = async (req, res, next) => {
  try {
    const { id } = req.params;
    const carrito = await CarritoModel.getActiveByCliente(id);
    if (!carrito) {
      return sendResponse(res, 404, 'No se encontró un carrito activo para este cliente');
    }
    return sendResponse(res, 200, 'Carrito activo obtenido exitosamente', carrito);
  } catch (error) {
    next(error);
  }
}

export const updateEstadoCarrito = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { estado } = req.body;

    const errors = validateCarritoEstado(id, estado);

    if (errors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', { errors });
    }

    estado = estado.toLowerCase();

    const actualizado = await CarritoModel.updateEstado(id, estado);
    if (!actualizado) {
      return sendResponse(res, 404, 'Carrito no encontrado o estado no modificado');
    }
    return sendResponse(res, 200, 'Estado del carrito actualizado exitosamente');
  } catch (error) {
    next(error);
  }
}