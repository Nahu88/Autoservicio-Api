import pool from '../config/database.js';

const Venta = {
  create: async (data) => {
    const { idCarrito, idCliente, total, metodoPago, notas } = data;

    const [result] = await pool.query('INSERT INTO ventas(id_carrito, id_cliente, total, estado, metodo_pago, notas) VALUES(?,?,?,?,?,?)',
      [idCarrito, idCliente, total, 'pendiente', metodoPago, notas])

    return {
      id: result.insertId,
      id_carrito: idCarrito,
      id_cliente: idCliente,
      total,
      metodo_pago: metodoPago,
      notas,
      estado: 'pendiente'
    }
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM ventas WHERE id = ?',
      [id])

    return rows[0] || null;
  },
  getVentasPaginated: async (page, limit, filters = {}) => {
    const offset = (page - 1) * limit;

    let query = `
      SELECT v.*, c.nombre as cliente_nombre 
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM ventas v';
    const params = [];
    const whereClauses = [];

    if (filters.estado) {
      whereClauses.push('v.estado LIKE ?');
      params.push(`%${filters.estado}%`);
    }

    if (filters.metodo_pago) {
      whereClauses.push('v.metodo_pago LIKE ?');
      params.push(`%${filters.metodo_pago}%`);
    }

    if (filters.precio_min) {
      whereClauses.push('v.total >= ?');
      params.push(filters.precio_min);
    }

    if (filters.precio_max) {
      whereClauses.push('v.total <= ?');
      params.push(filters.precio_max);
    }

    if (whereClauses.length > 0) {
      const whereString = ' WHERE ' + whereClauses.join(' AND ');
      query += whereString;
      countQuery += whereString;
    }

    const allowedOrderField = {
      id: 'v.id',
      total: 'v.total',
      created_at: 'v.created_at'
    }

    const orderBy = allowedOrderField[filters.orderBy] || 'id';
    const order = filters.order === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${orderBy} ${order}`;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [ventas] = await pool.query(query, params);

    const countParams = params.slice(0, - 2);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
      ventas,
      total
    }
  },
  getByCliente: async (idCliente) => {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE id_cliente = ? ORDER BY created_at DESC',
      [idCliente]
    );
    return rows;
  },
  getByIdWithItems: async (id) => {
    const [venta] = await pool.query(
      `
        SELECT v.*, cl.nombre as cliente_nombre
        FROM ventas v
        LEFT JOIN clientes cl ON v.id_cliente = cl.id
        WHERE v.id = ?
      `,
      [id]
    );

    if (venta.length === 0) return null;

    const [items] = await pool.query(
      `SELECT ci.*, p.titulo, p.url_image 
      FROM carrito_items ci 
      JOIN productos p ON ci.id_producto = p.id
      WHERE ci.id_carrito = ?`,
      [venta[0].id_carrito]
    );

    return {
      ...venta[0],
      items
    };
  },
  updateEstado: async (id, estado) => {
    const [result] = await pool.query(
      'UPDATE ventas SET estado = ? WHERE id = ?',
      [estado, id]
    );
    return result.affectedRows > 0;
  },
  getByEstado: async (estado) => {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE estado = ? ORDER BY created_at DESC',
      [estado]
    );
    return rows;
  },
  getByDateRange: async (fechaInicio, fechaFin) => {
    const [rows] = await pool.query(
      `SELECT * FROM ventas 
      WHERE created_at BETWEEN ? AND ? 
      ORDER BY created_at DESC`,
      [fechaInicio, fechaFin]
    );
    return rows;
  },
  getTotalByPeriod: async (fechaInicio, fechaFin) => {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as cantidad_ventas,
        SUM(total) as total_vendido,
        AVG(total) as promedio_venta
        FROM ventas 
        WHERE created_at BETWEEN ? AND ? 
        AND estado != 'cancelado'`,
      [fechaInicio, fechaFin]
    );
    return rows[0];
  },
  getTotalVentasMesActual: async () => {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as cantidad_ventas,
        SUM(total) as total_vendido,
        AVG(total) as promedio_venta
      FROM ventas
      WHERE YEAR(created_at) = YEAR(CURDATE())
        AND MONTH(created_at) = MONTH(CURDATE())
        AND estado != 'cancelado'`
    );
    return rows[0];
  },
  getVentasMesAnterior: async () => {
    const [rows] = await pool.query(
      `SELECT 
      COUNT(*) as cantidad_ventas,
      SUM(total) as total_vendido,
      AVG(total) as promedio_venta
    FROM ventas 
    WHERE YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND estado != 'cancelado'`
    );
    return rows[0];
  },
  getCantidadVentasMesActual: async () => {
    const [rows] = await pool.query(
      `
      SELECT COUNT(*) as cantidad_ventas
      FROM ventas
      WHERE YEAR(created_at) = YEAR(CURDATE())
        AND MONTH(created_at) = MONTH(CURDATE())
        AND estado != 'cancelado'`
    );
    return rows[0].cantidad_ventas;
  },
  getCantidadVentasMesAnterior: async () => {
    const [rows] = await pool.query(
      `
      SELECT COUNT(*) as cantidad_ventas
      FROM ventas
      WHERE YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND estado != 'cancelado'`
    );
    return rows[0].cantidad_ventas;
  },
  getTotalVentasSemanales: async () => {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) AS fecha,
        DAYNAME(created_at) AS dia,
        SUM(total) AS monto
      FROM ventas
      WHERE created_at >= CURDATE() - INTERVAL 7 DAY
        AND created_at < CURDATE() + INTERVAL 1 DAY
        AND estado != 'cancelado'
      GROUP BY DATE(created_at), DAYNAME(created_at)
      ORDER BY DATE(created_at) ASC;
      `);
    return rows;
  },
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT v.*, c.nombre as cliente_nombre 
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id
    `);
    return rows;
  }
}

export default Venta;