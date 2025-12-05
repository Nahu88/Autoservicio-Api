import * as XLSX from 'xlsx';

import VentaModel from '../models/Venta.js';
import ProductoModel from '../models/Producto.js';
import TipoModel from '../models/Tipo.js';
import ClienteModel from '../models/Cliente.js';
import { sendResponse } from '../utils/customResponse.js';

import { validatePaginationParams, validateOrderBy, validateOrder, VENTA_ORDER_FIELDS } from '../utils/pagination.js';
import { getInfoVentasMes } from '../utils/ventasHelper.js';

export const getAllVentas = async (req, res, next) => {
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

    const ventasPaginated = {
      ventas,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      }
    }
    ventasPaginated.ventas = ventas.map((venta) => ({
      ...venta,
      metodo_pago: venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1),
      estado: venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1),
      total: parseFloat(venta.total)
    }));

    res.render('ventas', { ventasPaginated });
  } catch (error) {
    next(error)
  }
}

export const getAllProductos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.order_by || 'id';
    const order = req.query.order || 'ASC';

    const filters = {
      id_tipo: req.query.tipo ? parseInt(req.query.tipo) : null,
      search: req.query.buscar || null,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : null,
      orderBy,
      order
    };

    const { productos, total } = await ProductoModel.getProductosPaginated(page, limit, filters);

    const tipos = await TipoModel.getAll();
    const totalPages = Math.ceil(total / limit);

    res.render('productos', {
      productos,
      tipos,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: req.query
    });
  } catch (error) {
    next(error);
  }
}

export const exportVentas = async (req, res, next) => {
  try {
    const ventas = await VentaModel.getAll();

    const dataExcel = ventas.map((venta) => ({
      'ID': venta.id,
      'Cliente': venta.cliente || 'Invitado',
      'Total': Number(venta.total).toFixed(2),
      'Estado': venta.estado,
      'Metodo Pago': venta.metodo_pago,
      'Notas': venta.notas,
      'Fecha de creacion': new Date(venta.created_at).toLocaleDateString('es-AR'),
      'Fecha de modificacion': new Date(venta.updated_at).toLocaleDateString('es-AR')
    }));
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx'
    });

    const fecha = new Date().toISOString().split('T')[0];

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=productos_${fecha}.xlsx`
    );

    res.send(excelBuffer);
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    res.render('login');
  } catch (error) {
    next(error);
  }
}

export const dashboard = async (req, res, next) => {
  try {
    const totalVentasMesActual = await VentaModel.getTotalVentasMesActual();
    const totalVentasMesPasado = await VentaModel.getVentasMesAnterior();

    const cantidadRemeras = await ProductoModel.getCountProductosById(1);
    const cantidadBuzos = await ProductoModel.getCountProductosById(2);

    const cantidadVentasMesActual = await VentaModel.getCantidadVentasMesActual();
    const cantidadVentasMesPasado = await VentaModel.getCantidadVentasMesAnterior();

    const cantidadClientesNuevos = await ClienteModel.getNewClientsLastWeek();
    const totalClientes = await ClienteModel.getTotalClients();

    const total_ventas_mes = getInfoVentasMes(totalVentasMesActual.total_vendido, totalVentasMesPasado.total_vendido, totalVentasMesPasado.cantidad_ventas > 0);

    const cantidad_ventas_mes = getInfoVentasMes(cantidadVentasMesActual, cantidadVentasMesPasado, cantidadVentasMesPasado > 0);

    const productos = {
      cantidadProductos: cantidadRemeras + cantidadBuzos,
      cantidadRemeras,
      cantidadBuzos
    }

    const clientes = {
      cant_clientes_nuevos: cantidadClientesNuevos,
      total: totalClientes
    }

    res.render('dashboard', { total_ventas_mes, productos, cantidad_ventas_mes, clientes });
  } catch (error) {
    next(error);
  }
}

export const getVentasSemanales = async (req, res, next) => {
  try {
    const ventasSemanales = await VentaModel.getTotalVentasSemanales();
    return res.json({ ventasSemanales });
  } catch (error) {
    next(error);
  }
}

export const administradores = async (req, res, next) => {
  try {
    res.render('administradores');
  } catch (error) {
    next(error);
  }
}

export const clientes = async (req, res, next) => {
  try {
    res.render('clientes');
  } catch (error) {
    next(error);
  }
}

export const productoForm = async (req, res, next) => {
  try {
    const { id } = req.query;
    const tipos = await TipoModel.getAll();
    
    let producto = null;
    let modo = 'crear';
    
    if (id) {
      producto = await ProductoModel.getById(id);
      if (producto) {
        modo = 'editar';
      }
    }
    
    res.render('producto-form', { producto, tipos, modo });
  } catch (error) {
    next(error);
  }
};
