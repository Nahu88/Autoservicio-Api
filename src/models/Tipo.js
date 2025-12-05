import pool from '../config/database.js';

const TipoModel = {
  getAll: async () => {
  const [results] = await pool.query('SELECT * FROM tipos');
  return results;
  },
  getById: async (id) => {
  const [results] = await pool.query('SELECT * FROM tipos WHERE id = ?', [id]);
  return results[0];
  }
};

export default TipoModel;