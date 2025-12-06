import db from './database.js';

const createTables = async () => {
  try {
    console.log('🔧 Verificando y creando tablas...');

    // Crear tabla tipos
    await db.query(`
      CREATE TABLE IF NOT EXISTS tipos(
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(32) NOT NULL
      )
    `);

    // Crear tabla usuarios
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios(
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(64) NOT NULL,
        email VARCHAR(64) UNIQUE NOT NULL,
        admin BOOLEAN DEFAULT FALSE,
        updated_by INT,
        created_by INT,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Agregar foreign keys a usuarios después de crear la tabla
    await db.query(`
      ALTER TABLE usuarios 
      ADD CONSTRAINT fk_usuarios_updated_by 
      FOREIGN KEY (updated_by) REFERENCES usuarios(id) 
      ON DELETE SET NULL
    `).catch(() => {}); // Ignorar si ya existe

    await db.query(`
      ALTER TABLE usuarios 
      ADD CONSTRAINT fk_usuarios_created_by 
      FOREIGN KEY (created_by) REFERENCES usuarios(id) 
      ON DELETE SET NULL
    `).catch(() => {}); // Ignorar si ya existe

    // Crear tabla clientes
    await db.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_nombre (nombre)
      )
    `);

    // Crear tabla productos
    await db.query(`
      CREATE TABLE IF NOT EXISTS productos(
        id INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(64) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        descripcion TEXT,
        sku VARCHAR(32) UNIQUE NOT NULL,
        url_image VARCHAR(100),
        id_usuario INT NOT NULL,
        id_tipo INT NOT NULL,
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(id_tipo) REFERENCES tipos(id),
        FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
        INDEX idx_titulo (titulo),
        INDEX idx_activo (activo),
        INDEX idx_tipo (id_tipo)
      )
    `);

    // Crear tabla carritos
    await db.query(`
      CREATE TABLE IF NOT EXISTS carritos(
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_cliente INT,
        estado ENUM('activo', 'abandonado', 'convertido') DEFAULT 'activo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(id_cliente) REFERENCES clientes(id),
        INDEX idx_estado (estado)
      )
    `);

    // Crear tabla carrito_items
    await db.query(`
      CREATE TABLE IF NOT EXISTS carrito_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_carrito INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_carrito) REFERENCES carritos(id),
        FOREIGN KEY (id_producto) REFERENCES productos(id),
        INDEX idx_carrito (id_carrito),
        INDEX idx_producto (id_producto)
      )
    `);

    // Crear tabla ventas
    await db.query(`
      CREATE TABLE IF NOT EXISTS ventas(
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_carrito INT NOT NULL,
        id_cliente INT,
        total DECIMAL(10, 2) NOT NULL,
        estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente',
        metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'qr') DEFAULT 'efectivo',
        notas TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_carrito) REFERENCES carritos(id),
        FOREIGN KEY (id_cliente) REFERENCES clientes(id),
        INDEX idx_estado (estado),
        INDEX idx_created (created_at)
      )
    `);

    console.log('✅ Tablas verificadas/creadas correctamente');
  } catch (error) {
    console.error('❌ Error al crear tablas:', error.message);
  }
};

export default createTables;
