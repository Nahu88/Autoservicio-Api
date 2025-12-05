import CarritoItemsModel from '../models/CarritoItems.js';
import ProductoModel from '../models/Producto.js';
import { sendResponse } from '../utils/customResponse.js';
import { validateAddCarritoItems } from '../utils/validations.js'

export const addItemToCart = async (req, res, next) => {
  try {
    const { carritoId, productoId, cantidad } = req.body;
    const errors = validateAddCarritoItems(carritoId, productoId, cantidad);
    if (errors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', { errors });
    }

    const producto = await ProductoModel.getById(productoId);

    if (!producto) {
      return sendResponse(req, 404, 'Producto no encontrado')
    }

    if (cantidad > producto.stock) {
      return sendResponse(res, 400, 'La cantidad no puede ser superior a la cantidad en stock del producto')
    }

    const itemExistente = await CarritoItemsModel.getByCarritoAndProducto(carritoId, productoId);

    let item;

    if (itemExistente) {
      item = await CarritoItemsModel.updateCantidad(itemExistente.id, cantidad, producto.precio);
    } else {
      item = await CarritoItemsModel.create(carritoId, productoId, cantidad, producto.precio);
    }

    const total = await CarritoItemsModel.getTotal(carritoId);

    return sendResponse(res, 201, 'Item agregado al carrito', { item, total });
  } catch (error) {
    next(error)
  }
}

export const getItemsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const carritoItems = await CarritoItemsModel.getById(id);

    return sendResponse(res, 200, 'Items del carrito', carritoItems)
  } catch (error) {
    next(error);
  }
}