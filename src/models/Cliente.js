import pool from '../config/database.js';

const ClienteModel = {
  create: async (cliente) => {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(cliente)) {
      if (value !== undefined) {
        campos.push(key);
        valores.push(value);
      }
    }
    const query = `INSERT INTO clientes (${campos.join(', ')}) VALUES (${campos.map(() => '?').join(', ')})`;
    const [result] = await pool.query(query, valores);

    return { id: result.insertId, ...cliente };
  },
  getNewClientsLastWeek: async () => {
    const [results] = await pool.query(
      `SELECT COUNT(*) AS nuevos_clientes
        FROM clientes 
        WHERE created_at >= NOW() - INTERVAL 7 DAY`
    );

    return results[0].nuevos_clientes;
  },
  getTotalClients: async () => {
    const [results] = await pool.query(
      `SELECT COUNT(*) AS total_clientes
        FROM clientes`
    );
    return results[0].total_clientes;
  },
  getAllClientsPaginated: async (page, limit) => {
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM clientes LIMIT ? OFFSET ?';

    let countQuery = 'SELECT COUNT(*) as total FROM clientes';

    const params = [limit, offset];

    const [results] = await pool.query(query, params);

    const [countResults] = await pool.query(countQuery);

    return {
      clientes: results,
      total: countResults[0].total
    };
  }
};

export default ClienteModel;