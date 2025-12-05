import { validarToken } from './validacionToken.js';

const volverDashboardBtn = document.querySelector('.volver-dashboard');
const btnImg = document.querySelector('.btn-upload-img');
const imgPreview = document.querySelector('.container__img-product img');

const submitForm = document.querySelector('#crearProducto');
const tituloProducto = document.querySelector('#titulo');
const precioProducto = document.querySelector('#precio');
const stockProducto = document.querySelector('#stock');
const tipoProducto = document.querySelector('#id_tipo');
const descripcionProducto = document.querySelector('#descripcion');

window.addEventListener('DOMContentLoaded', async () => {
  const usuarioValido = await validarToken();
  if (usuarioValido) {
    btnImg.disabled = true;
    btnImg.classList.add("disabled");

    volverDashboardBtn.addEventListener('click', volverProductos);
    submitForm.addEventListener('submit', guardarProducto);

    btnImg.addEventListener('click', () => {
      const inputFile = document.createElement('input');
      inputFile.type = 'file';
      inputFile.accept = 'image/*';

      inputFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          subirImagen(file);
        }
      });

      inputFile.click();
    });
  } else {
    window.location.href = '/api/admin/login-view';
    return;
  }
});

function volverProductos() {
  window.location.href = '/api/admin/productos-view';
};

function validarDatos(data) {
  if (!data.titulo || data.titulo.trim() === "") {
    return { valido: false, msg: "El título es obligatorio." };
  }
  if (!data.precio || parseFloat(data.precio) <= 0) {
    return { valido: false, msg: "El precio debe ser mayor a 0." };
  }
  if (!data.stock || parseInt(data.stock) < 0) {
    return { valido: false, msg: "El stock no puede ser negativo." };
  }
  return { valido: true, msg: "" };
};

async function guardarProducto(e) {
  e.preventDefault();
  const errorDiv = document.getElementById('mensajeError');
  errorDiv.style.display = 'none';

  const idAdmin = await obtenerIdAdmin();

  const dataProducto = {
    titulo: tituloProducto.value,
    precio: parseFloat(precioProducto.value),
    stock: parseInt(stockProducto.value),
    id_tipo: parseInt(tipoProducto.value),
    id_usuario: idAdmin,
    descripcion: descripcionProducto.value || null
  }

  const validacion = validarDatos(dataProducto);

  if (!validacion.valido) {
    errorDiv.innerText = validacion.msg;
    errorDiv.style.display = 'block';
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataProducto)
    });

    const data = await response.json();

    if (data.status === 201) {
      imgPreview.dataset.id = data.data.id;

      showAlert('Producto creado correctamente', 'success');

      btnImg.disabled = false;
      btnImg.classList.remove("disabled");
    } else {
      showAlert(data.errors[0], 'error');
    }
  } catch (error) {
    showAlert('Error al crear producto: ' + data.errors[0], 'error');
  }
};

async function obtenerIdAdmin() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const { data } = await response.json();
    return data.id;
  } catch (error) {
    console.log(error);
  }
};

async function subirImagen(file) {
  try {
    const token = localStorage.getItem('token');

    if (!file.type.startsWith('image/')) {
      showAlert('Por favor seleccione una imagen válida', 'error');
      return;
    }

    const productoId = imgPreview.dataset.id;

    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('producto_id', productoId);

    const reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    btnImg.disabled = true;
    btnImg.textContent = 'Subiendo...';

    const response = await fetch(`/api/productos/${productoId}/upload-image`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Imagen subida exitosamente', 'success');
      if (data.url_image) {
        imgPreview.src = data.url_image;
      }
      btnImg.disabled = false;
      btnImg.textContent = 'Subido con exito';
    }
  } catch (error) {
    showAlert('Error al intentar subir la imagen: ' + data.errors[0], 'error');
  }
}

function showAlert(message, type = 'success') {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type} show`;

  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}