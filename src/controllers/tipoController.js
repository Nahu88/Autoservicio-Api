import TipoModel from '../models/Tipo.js';
import { sendResponse } from '../utils/customResponse.js';

export const getAllTipos = async (req, res, next) => {
  try {
    const tipos = await TipoModel.getAll();

    if (tipos.length === 0) {
      return sendResponse(res, 404, 'No se encontraron tipos');
    }

    return sendResponse(res, 200, 'Tipos obtenidos exitosamente', tipos);
  } catch (error) {
    next(error);
  }
};

export const getTipoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipoById = await TipoModel.getById(id);

    if (!tipoById) {
      return sendResponse(res, 404, 'Tipo no encontrado');
    }

    return sendResponse(res, 200, 'Tipo obtenido exitosamente', tipoById);
  } catch (error) {
    next(error);
  }
};