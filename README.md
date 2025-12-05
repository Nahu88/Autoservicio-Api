# Autoservicio API

API REST para gestión de productos, carritos y ventas de un autoservicio.

## 🚀 Requisitos Previos

- Docker
- Docker Compose

## 📦 Instalación y Configuración

### 1. Clonar el repositorio

```bash
  git clone https://github.com/AbigailSC/TP_Progra3_Back.git autoservicio-api
  cd autoservicio-api
```

### 2. Configurar variables de entorno

Crear un archivo `.env.docker` en la raíz del proyecto con las siguientes variables:

```env
DB_HOST=mysql_db
DB_USER=tu_user
DB_PASSWORD=tu_password
DB_NAME=autoservicio_db
DB_PORT=tu_puerto
PORT=tu_puerto

MYSQL_ROOT_PASSWORD=tu_mysql_pass
MYSQL_DATABASE=autoservicio_db

PMA_HOST=mysql_db
PMA_PORT=3306
```

Y crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

DB_HOST=localhost
DB_USER=tu_user
DB_PASSWORD=tu_password
DB_NAME=autoservicio_db
DB_PORT=tu_puerto
PORT=tu_puerto
JWT_SECRET=palabra_secreta_jwt
JWT_EXPIRES_IN=tiempo_expiracion_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_cloud_key
CLOUDINARY_API_SECRET=tu_cloud_api_secret_key

### 3. Levantar el proyecto por primera vez

```bash
# Construir y levantar los contenedores
docker-compose up -d
```

## 🔄 Reiniciar desde Cero

Si necesitas reiniciar el proyecto eliminando todos los datos:

```bash
# 1. Detener y eliminar contenedores, volúmenes y redes
docker-compose down -v

# 2. (Opcional) Eliminar también las imágenes
docker-compose down -v --rmi all

# 3. Verificar que se eliminaron los volúmenes
docker volume ls

# 4. Si queda algún volumen, eliminarlo manualmente
docker volume rm tp_grupal_back_mysql-data

# 5. Levantar todo de nuevo desde cero
docker-compose up -d
```

## 📊 Acceso a los Servicios

Una vez levantados los contenedores:

- **API**: http://localhost:4000
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3307

### Credenciales por defecto

**phpMyAdmin / MySQL:**

- Usuario: (definido en `.env.docker`)
- Contraseña: (definida en `.env.docker`)

**Usuarios de la aplicación:**

- Email: `admin@autoservicio.com`
- Password: `Admin123!`
