import pool from '../config/database.js';

const ProductoModel = {
  create: async (producto) => {
    const { titulo, precio, stock, descripcion, sku, id_usuario, id_tipo } = producto;
    const [result] = await pool.query(
      'INSERT INTO productos (titulo, precio, stock, descripcion, sku, id_usuario, id_tipo, url_image) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)',
      [titulo, precio, stock, descripcion, sku, id_usuario, id_tipo]
    );
    return { id: result.insertId, ...producto };
  },
  update: async (id, producto) => {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(producto)) {
      if (value !== undefined) {
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    }

    valores.push(id);

    const query = `UPDATE productos SET ${campos.join(', ')} WHERE id = ?`;

    const [result] = await pool.query(query, valores);
    return result.affectedRows > 0 ? producto : null;
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ? AND activo = TRUE', [id]);
    return rows[0] || null;
  },
  getByIdAdmin: async (id) => {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id_usuario = ?', [id]);
    return rows[0] || null;
  },
  updateImage: async (id, url_image) => {
    const [result] = await pool.query(
      'UPDATE productos SET url_image = ? WHERE id = ?',
      [url_image, id]
    );

    return result.affectedRows > 0 ? { id, url_image } : null;
  },
  delete: async (id) => {
    const [result] = await pool.query('UPDATE productos SET activo = FALSE WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
  getProductosPaginated: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM productos';
    let countQuery = 'SELECT COUNT(*) as total FROM productos';
    const params = [];
    const whereClauses = [];

    // Si activo es 'all', traer todos. Si es undefined, traer solo activos
    if (filters.activo !== 'all') {
      whereClauses.push('activo = ?');
      params.push(filters.activo !== undefined ? filters.activo : true);
    }

    if (filters.id_tipo) {
      whereClauses.push('id_tipo = ?');
      params.push(filters.id_tipo);
    }

    if (filters.search) {
      whereClauses.push('titulo LIKE ?');
      params.push(`%${filters.search}%`);
    }

    if (filters.precio_min) {
      whereClauses.push('precio >= ?');
      params.push(filters.precio_min);
    }

    if (filters.precio_max) {
      whereClauses.push('precio <= ?');
      params.push(filters.precio_max);
    }

    if (whereClauses.length > 0) {
      const whereString = ' WHERE ' + whereClauses.join(' AND ');
      query += whereString;
      countQuery += whereString;
    }

    const allowedOrderField = {
      id: 'id',
      titulo: 'titulo',
      precio: 'precio',
      created_at: 'created_at'
    }

    const orderBy = allowedOrderField[filters.orderBy] || 'id';
    const order = filters.order === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${orderBy} ${order}`;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [productos] = await pool.query(query, params);

    const countParams = params.slice(0, - 2);
    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
      productos,
      total
    }
  },
  getCountProductos: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM productos WHERE activo = ?', [true]);
    return rows[0].total;
  },
  getCountProductosById: async (id) => {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM productos WHERE activo = ? and id_tipo = ?', [true, id]);
    return rows[0].total;
  }
};

export default ProductoModel;