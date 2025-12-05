import ProductoModel from '../models/Producto.js';
import { validateCreateProducto, validateUpdateProducto } from '../utils/validations.js';
import { generateSKU } from '../utils/generateSKU.js';
import { validatePaginationParams, validateOrderBy, validateOrder, PRODUCTO_ORDER_FIELDS } from '../utils/pagination.js';
import { uploadImage } from '../config/cloudinary.js';
import { sendResponse } from '../utils/customResponse.js';

export const createProducto = async (req, res, next) => {
  try {
    const productoData = req.body;
    const validationErrors = validateCreateProducto(productoData);
    productoData.sku = generateSKU(productoData.titulo, productoData.id_tipo);

    if (validationErrors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', validationErrors);
    }

    const newProducto = await ProductoModel.create(productoData);
    return sendResponse(res, 201, 'Producto creado exitosamente', newProducto);
  } catch (error) {
    next(error);
  }
}

export const updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productoData = req.body;
    const validationErrors = validateUpdateProducto(productoData);
    if (validationErrors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', validationErrors);
    }

    const updatedProducto = await ProductoModel.update(id, productoData);
    if (!updatedProducto) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }
    return sendResponse(res, 200, 'Producto actualizado exitosamente', updatedProducto);
  } catch (error) {
    next(error);
  }
}

export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ProductoModel.delete(id);
    if (!deleted) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }
    return sendResponse(res, 200, 'Producto eliminado exitosamente');
  } catch (error) {
    next(error);
  }
}

export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const producto = await ProductoModel.getById(id);
    if (!producto) {
      return sendResponse(res, 404, 'Producto no encontrado');
    }
    return sendResponse(res, 200, 'Producto obtenido exitosamente', producto);
  } catch (error) {
    next(error);
  }
}

export const uploadProductoImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return sendResponse(res, 400, 'No se ha proporcionado ninguna imagen');
    }

    const imageUrl = await uploadImage(req.file.buffer);

    await ProductoModel.updateImage(id, imageUrl);
    return sendResponse(res, 200, 'Imagen subida exitosamente', imageUrl);
  } catch (error) {
    res.json({
      status: 500,
      message: 'Error al subir la imagen',
      error: error.message
    });
  }
}

export const getAllProductos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validation = validatePaginationParams(page, limit);

    if (!validation.isValid) {
      return sendResponse(res, 400, 'Parámetros de paginación inválidos', validation.errors);
    }

    const orderBy = validateOrderBy(req.query.order_by, PRODUCTO_ORDER_FIELDS);
    const order = validateOrder(req.query.order);

    // Procesar filtro de activo: 'all' = todos, '1' = activos, '0' = inactivos
    let activoFilter = undefined;
    if (req.query.activo === 'all') {
      activoFilter = 'all';
    } else if (req.query.activo === '0') {
      activoFilter = false;
    } else if (req.query.activo === '1') {
      activoFilter = true;
    }

    const filters = {
      id_tipo: req.query.tipo ? parseInt(req.query.tipo) : null,
      search: req.query.buscar || null,
      precio_min: req.query.precio_min ? parseFloat(req.query.precio_min) : null,
      precio_max: req.query.precio_max ? parseFloat(req.query.precio_max) : null,
      orderBy: orderBy,
      order: order,
      activo: activoFilter
    };

    const { productos, total } = await ProductoModel.getProductosPaginated(page, limit, filters);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return sendResponse(res, 200, 'Productos obtenidos exitosamente', {
      productos,
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
}