import { validarToken } from './validacionToken.js';

// Elementos del DOM
const btnImg = document.querySelector('.btn-upload-img');
const imgPreview = document.getElementById('imgPreview');
const form = document.getElementById('productoForm');

// Datos del formulario (vienen del data-attribute del form)
const modo = form.dataset.modo; // 'crear' o 'editar'
const productoId = form.dataset.id;

window.addEventListener('DOMContentLoaded', async () => {
  const usuarioValido = await validarToken();
  
  if (!usuarioValido) {
    window.location.href = '/api/admin/login-view';
    return;
  }

  form.addEventListener('submit', guardarProducto);
  
  if (btnImg && !btnImg.disabled) {
    btnImg.addEventListener('click', seleccionarImagen);
  }
});

function validarDatos(data) {
  if (!data.titulo || data.titulo.trim() === '') {
    return { valido: false, msg: 'El título es obligatorio.' };
  }
  if (!data.precio || parseFloat(data.precio) <= 0) {
    return { valido: false, msg: 'El precio debe ser mayor a 0.' };
  }
  if (data.stock === undefined || data.stock === '' || parseInt(data.stock) < 0) {
    return { valido: false, msg: 'El stock no puede ser negativo.' };
  }
  return { valido: true, msg: '' };
}

async function guardarProducto(e) {
  e.preventDefault();
  const errorDiv = document.getElementById('mensajeError');
  errorDiv.style.display = 'none';

  const dataProducto = {
    titulo: document.getElementById('titulo').value,
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value),
    id_tipo: parseInt(document.getElementById('id_tipo').value),
    descripcion: document.getElementById('descripcion').value || null
  };

  const validacion = validarDatos(dataProducto);

  if (!validacion.valido) {
    errorDiv.innerText = validacion.msg;
    errorDiv.style.display = 'block';
    return;
  }

  try {
    const token = localStorage.getItem('token');

    if (modo === 'crear') {
      // Obtener id del admin
      const idAdmin = await obtenerIdAdmin();
      dataProducto.id_usuario = idAdmin;

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
        // Guardar el ID del producto creado para subir imagen
        imgPreview.dataset.id = data.data.id;
        form.dataset.id = data.data.id;
        
        showAlert('Producto creado correctamente. Ahora puede subir la imagen.', 'success');

        // Habilitar botón de imagen
        btnImg.disabled = false;
        btnImg.textContent = 'Subir imagen';
        btnImg.addEventListener('click', seleccionarImagen);
      } else {
        showAlert(data.errors?.[0] || data.message || 'Error al crear producto', 'error');
      }
    } else {
      // MODO EDITAR - usar PUT
      const response = await fetch(`/api/productos/${productoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataProducto)
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Producto actualizado correctamente', 'success');
      } else {
        showAlert(data.errors?.[0] || data.message || 'Error al actualizar producto', 'error');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error al guardar el producto', 'error');
  }
}

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
    console.error('Error obteniendo admin:', error);
    return null;
  }
}

function seleccionarImagen() {
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
}

async function subirImagen(file) {
  try {
    const token = localStorage.getItem('token');

    if (!file.type.startsWith('image/')) {
      showAlert('Por favor seleccione una imagen válida', 'error');
      return;
    }

    const idProducto = imgPreview.dataset.id || form.dataset.id || productoId;

    if (!idProducto) {
      showAlert('Primero debe guardar el producto', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', file);

    // Mostrar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    btnImg.disabled = true;
    btnImg.textContent = 'Subiendo...';

    const response = await fetch(`/api/productos/${idProducto}/upload-image`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Imagen subida exitosamente', 'success');
      if (data.data) {
        imgPreview.src = data.data;
      }
      btnImg.disabled = false;
      btnImg.textContent = 'Cambiar imagen';
    } else {
      showAlert(data.message || 'Error al subir imagen', 'error');
      btnImg.disabled = false;
      btnImg.textContent = 'Reintentar';
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error al subir la imagen', 'error');
    btnImg.disabled = false;
    btnImg.textContent = 'Reintentar';
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
