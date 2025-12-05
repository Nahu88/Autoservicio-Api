import pool from '../config/database.js';

const CarritoItemsModel = {
  create: async (carritoId, productoId, cantidad, precioUnitario) => {
    const subtotal = precioUnitario * cantidad;

    const [result] = await pool.query(
      'INSERT INTO carrito_items (id_carrito, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [carritoId, productoId, cantidad, precioUnitario, subtotal]
    );

    return {
      id: result.insertId,
      id_carrito: carritoId,
      id_producto: productoId,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal
    };
  },
  updateCantidad: async (id, cantidad, precioUnitario) => {
    const subtotal = precioUnitario * cantidad;

    const [result] = await pool.query(
      'UPDATE carrito_items SET cantidad = ?, subtotal = ? WHERE id = ?',
      [cantidad, subtotal, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id,
      cantidad: cantidad,
      subtotal: subtotal
    };
  },
  getByCarritoAndProducto: async (carritoId, productoId) => {
    const [rows] = await pool.query(
      'SELECT * FROM carrito_items WHERE id_carrito = ? AND id_producto = ?',
      [carritoId, productoId]
    );
    return rows[0] || null;
  },
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT ci.*, p.titulo, p.url_image FROM carrito_items ci JOIN productos p ON ci.id_producto = p.id WHERE ci.id_carrito = ?',
      [id]
    );
    return rows;
  },
  delete: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM carrito_items WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
  getTotal: async (id) => {
    const [rows] = await pool.query(
      'SELECT SUM(subtotal) AS total FROM carrito_items WHERE id_carrito = ?',
      [id]
    );
    return rows[0].total || 0;
  }
}

export default CarritoItemsModel;