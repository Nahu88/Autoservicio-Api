import mysql from 'mysql2/promise';

import environments from '../config/environments.js'

const pool = mysql.createPool({
  host: environments.database.host,
  user: environments.database.user,
  password: environments.database.password,
  database: environments.database.database,
  port: environments.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;