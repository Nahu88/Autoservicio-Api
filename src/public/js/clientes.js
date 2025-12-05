import { renderPaginacion } from './paginacion.js';
import { validarToken } from './validacionToken.js';

let clientes = [];
const API_BASE = '/api';

const volverDashboardBtn = document.querySelector('.volver-dashboard');

window.addEventListener('DOMContentLoaded', async () => {
  const usuarioValido = await validarToken();


  if (usuarioValido) {
    const paginacionContainer = document.getElementById('paginacion');
    await cargarClientes();

    paginacionContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-paginacion')) {
        const page = parseInt(e.target.dataset.page);
        cargarClientes(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    volverDashboardBtn.addEventListener('click', volverDashboard);
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

async function cargarClientes(pagina = 1) {
  const loading = document.getElementById('loading');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  loading.style.display = 'block';
  tableContainer.style.display = 'none';
  emptyState.style.display = 'none';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/clientes?page=${pagina}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      window.location.href = '/api/admin/login-view';
      return;
    }

    if (!response.ok) {
      throw new Error('Error al obtener los clientes');
    }

    const { data } = await response.json();

    clientes = data?.clientes || [];

    mostrarClientes();
    renderPaginacion(data.pagination);
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    showAlert('Error al cargar los ventas', 'error');
    emptyState.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

function mostrarClientes() {
  const tbody = document.getElementById('clientesBody');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  tbody.innerHTML = '';
  clientes.forEach(cliente => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nombre}</td>
      <td>${new Date(cliente.created_at).toLocaleDateString('es-AR')}</td>
    `;
    tbody.appendChild(row);
  });

  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';
}

function volverDashboard() {
  window.location.href = '/api/admin/dashboard-view';
}
