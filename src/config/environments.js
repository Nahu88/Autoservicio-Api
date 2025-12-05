import 'dotenv/config';

const environments = {
  port: process.env.PORT || 4000,
  database: {
    host: process.env.DB_HOST || 'mysql_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'test_password',
    database: process.env.DB_NAME || 'autoservicio_db',
    port: process.env.DB_PORT || 3306
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'test',
    api_key: process.env.CLOUDINARY_API_KEY || 'apikey',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'api_secret'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'coso_123',
    expires_in: process.env.JWT_EXPIRES_IN || '1d'
  }
}

export default environments;