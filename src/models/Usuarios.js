import pool from '../config/database.js';

const UsuarioModel = {
  getAll: async (page, limit) => {
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM usuarios LIMIT ? OFFSET ?';

    let countQuery = 'SELECT COUNT(*) as total FROM usuarios';

    const params = [limit, offset];

    const [results] = await pool.query(query, params);

    const [countResults] = await pool.query(countQuery);

    return {
      usuarios: results,
      total: countResults[0].total
    };
  },
  getById: async (id) => {
    const [results] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return results[0];
  },
  getByEmail: async (email) => {
    const [results] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return results[0];
  },
  create: async (usuario) => {
    const { nombre, email, password, admin = true, createdBy, updatedBy } = usuario;

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, admin, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, password, admin, createdBy, updatedBy]
    );
    return { id: result.insertId, ...usuario };
  },
  update: async (id, data) => {
    const { nombre, password, updatedBy, createdBy } = data;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, password = ?, updated_by = ?, created_by = ? WHERE id = ?',
      [nombre, password, updatedBy, createdBy, id]
    );
    return result;
  },
  delete: async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
  }
};

export default UsuarioModel;