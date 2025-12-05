let productos = [];
const API_BASE = '/api';

// Verificar autenticación al cargar a
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (data.status !== 401) {
    await cargarProductos();
  } else {
    window.location.href = '/api/admin/login-view';
    return;
  }
});

function showAlert(message, type = 'success') {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type} show`;

  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

async function cargarProductos() {
  const loading = document.getElementById('loading');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  loading.style.display = 'block';
  tableContainer.style.display = 'none';
  emptyState.style.display = 'none';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/productos?activo=all&limit=100`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      window.location.href = '/api/admin/login-view';
      return;
    }

    const data = await response.json();

    // La API devuelve paginación, extraemos los productos
    productos = data.data?.productos || data.data || [];

    mostrarProductos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    showAlert('Error al cargar los productos', 'error');
    emptyState.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

function mostrarProductos() {
  const tbody = document.getElementById('productosBody');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');
  const filtro = document.getElementById('filtroEstado').value;

  let productosFiltrados = productos;

  // Aplicar filtro
  if (filtro === 'activo') {
    productosFiltrados = productos.filter(p => p.activo === 1 || p.activo === true);
  } else if (filtro === 'inactivo') {
    productosFiltrados = productos.filter(p => p.activo === 0 || p.activo === false);
  }

  if (productosFiltrados.length === 0) {
    tableContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  tbody.innerHTML = '';
  productosFiltrados.forEach(producto => {
    const esActivo = producto.activo === 1 || producto.activo === true;
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${producto.id}</td>
            <td>
                ${producto.url_image
        ? `<img src="${producto.url_image}" class="product-image" alt="${producto.titulo}">`
        : '<span>Sin imagen</span>'}
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.sku || 'N/A'}</td>
            <td>$${Number(producto.precio).toLocaleString()}</td>
            <td>${producto.stock || 0}</td>
            <td>
                <span class="badge ${esActivo ? 'badge-active' : 'badge-inactive'}">
                    ${esActivo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-primary btn-small" onclick="editarProducto(${producto.id})">
                        Editar
                    </button>
                    ${esActivo
        ? `<button class="btn btn-danger btn-small" onclick="confirmarEliminar(${producto.id})">Eliminar</button>`
        : `<button class="btn btn-success btn-small" onclick="confirmarActivar(${producto.id})">Activar</button>`
      }
                </div>
            </td>
        `;

    tbody.appendChild(row);
  });

  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';
}

function agregarProducto() {
  window.location.href = '/api/admin/producto-form';
}

function editarProducto(id) {
  window.location.href = `/api/admin/producto-form?id=${id}`;
}

function confirmarEliminar(id) {
  const producto = productos.find(p => p.id === id);
  const nombreProducto = producto ? producto.titulo : 'este producto';
  mostrarModal(
    'Confirmar eliminación',
    `¿Está seguro de que desea eliminar "${nombreProducto}"? El producto pasará a estado inactivo.`,
    () => eliminarProducto(id)
  );
}

function confirmarActivar(id) {
  mostrarModal(
    'Confirmar activación',
    '¿Está seguro de que desea activar este producto?',
    () => activarProducto(id)
  );
}

async function eliminarProducto(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Producto eliminado exitosamente', 'success');
      await cargarProductos();
    } else {
      showAlert(data.message || 'Error al eliminar el producto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error al eliminar el producto', 'error');
  } finally {
    cerrarModal();
  }
}

async function activarProducto(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activo: 1 })
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Producto activado exitosamente', 'success');
      await cargarProductos();
    } else {
      showAlert(data.message || 'Error al activar el producto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error al activar el producto', 'error');
  } finally {
    cerrarModal();
  }
}

function mostrarModal(titulo, mensaje, callback) {
  const modal = document.getElementById('modalConfirm');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const btnConfirmar = document.getElementById('btnConfirmar');

  modalTitle.textContent = titulo;
  modalMessage.textContent = mensaje;

  // Remover listeners anteriores
  const newBtn = btnConfirmar.cloneNode(true);
  btnConfirmar.parentNode.replaceChild(newBtn, btnConfirmar);

  newBtn.addEventListener('click', callback);

  modal.classList.add('show');
}

function cerrarModal() {
  const modal = document.getElementById('modalConfirm');
  modal.classList.remove('show');
}

function volver() {
  localStorage.removeItem('token');
  window.location.href = '/api/admin/dashboard-view';
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalConfirm').addEventListener('click', (e) => {
  if (e.target.id === 'modalConfirm') {
    cerrarModal();
  }
});
