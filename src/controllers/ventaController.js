import VentaModel from '../models/Venta.js';
import CarritoModel from '../models/Carrito.js';
import CarritoItemsModel from '../models/CarritoItems.js';
import ProductoModel from '../models/Producto.js';
import { sendResponse } from '../utils/customResponse.js';
import { validateVentas, validateVentasEstado } from '../utils/validations.js'
import { validatePaginationParams, validateOrderBy, validateOrder, VENTA_ORDER_FIELDS } from '../utils/pagination.js';

// Checkout simple: recibe items del carrito y crea la venta
export const checkout = async (req, res, next) => {
  try {
    const { items, metodoPago } = req.body;

    if (!items || items.length === 0) {
      return sendResponse(res, 400, 'El carrito está vacío');
    }

    // Crear carrito
    const carritoId = await CarritoModel.create(null);

    // Agregar items y calcular total
    let total = 0;
    for (const item of items) {
      const producto = await ProductoModel.getById(item.id);
      if (producto) {
        if (producto.stock < item.cantidad) {
          return sendResponse(res, 400, `Stock insuficiente para "${producto.titulo}". Disponible: ${producto.stock}`);
        }     
        await CarritoItemsModel.create(carritoId, item.id, item.cantidad, producto.precio);
        total += producto.precio * item.cantidad;
        
        // Descontar stock del producto
        await ProductoModel.update(item.id, { stock: producto.stock - item.cantidad });
      }
    }

    // Crear venta
    const venta = await VentaModel.create({
      idCarrito: carritoId,
      idCliente: null,
      total,
      metodoPago: metodoPago || 'efectivo',
      notas: null
    });

    await CarritoModel.updateEstado(carritoId, 'convertido');

    return sendResponse(res, 201, 'Compra realizada', { ventaId: venta.id, total });
  } catch (error) {
    next(error);
  }
}

export const createVenta = async (req, res, next) => {
  try {
    const { idCarrito, metodoPago, notas = null } = req.body;
    const validationErrors = validateVentas(idCarrito, metodoPago, notas);

    if (validationErrors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', validationErrors);
    }

    const [carrito] = await CarritoModel.getById(idCarrito);

    if (!carrito) {
      return sendResponse(res, 404, 'No se encontro el carrito')
    }

    const total = await CarritoItemsModel.getTotal(idCarrito)

    const dataFormateada = {
      idCarrito,
      idCliente: carrito.id_cliente || null,
      total: parseFloat(total),
      metodoPago: metodoPago.toLowerCase(),
      notas
    }

    const newVenta = await VentaModel.create(dataFormateada);

    return sendResponse(res, 201, 'Venta cargada con exito', newVenta)
  } catch (error) {
    next(error)
  }
}

export const getVentaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const venta = await VentaModel.getByIdWithItems(id);

    if (!venta) {
      return sendResponse(res, 404, 'Venta no encontrada');
    }

    return sendResponse(res, 200, 'Venta encontrada con exito', venta);
  } catch (error) {
    next(error);
  }
}

export const getVentasPaginated = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validation = validatePaginationParams(page, limit);

    if (!validation.isValid) {
      return sendResponse(res, 400, 'Parámetros de paginación inválidos', validation.errors);
    }

    const orderBy = validateOrderBy(req.query.order_by, VENTA_ORDER_FIELDS);
    const order = validateOrder(req.query.order);

    const filters = {
      precio_min: req.query.precio_min ? parseFloat(req.query.precio_min) : null,
      precio_max: req.query.precio_max ? parseFloat(req.query.precio_max) : null,
      estado: req.query.estado || null,
      metodo_pago: req.query.metodo_pago || null,
      orderBy: orderBy,
      order: order
    };

    const { ventas, total } = await VentaModel.getVentasPaginated(page, limit, filters);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return sendResponse(res, 200, 'Productos obtenidos exitosamente', {
      ventas,
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

export const updateVentaEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const errors = validateVentasEstado(estado);

    if (errors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', errors);
    }

    const venta = await VentaModel.getById(id);

    if (!venta) {
      return sendResponse(res, 404, 'Venta no encontrada');
    }
    await VentaModel.updateEstado(id, estado.toLowerCase());

    return sendResponse(res, 200, 'Estado de la venta actualizado con éxito');
  } catch (error) {
    next(error);
  }
}