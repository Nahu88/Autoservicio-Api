import pool from '../config/database.js';

const CarritoModel = {
  create: async (clienteId) => {
    console.log("🚀 ~ clienteId:", clienteId)

    const [result] = await pool.query(
      'INSERT INTO carritos (id_cliente) VALUES (?)',
      [clienteId]
    );
    return result.insertId;
  },
  getActiveByCliente: async (clienteId) => {
    const [rows] = await pool.query(
      'SELECT * FROM carritos WHERE id_cliente = ? AND estado = ? ORDER BY created_at DESC LIMIT 1',
      [clienteId, 'activo']
    );
    return rows[0] || null;
  },
  getById: async (carritoId) => {
    const [result] = await pool.query('SELECT * FROM carritos WHERE id = ?',
      [carritoId]
    );
    return result;
  },
  updateEstado: async (carritoId, estado) => {
    const [result] = await pool.query(
      'UPDATE carritos SET estado = ? WHERE id = ?',
      [estado, carritoId]
    );
    return result.affectedRows > 0;
  }
}

export default CarritoModel;