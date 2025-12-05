import { renderPaginacion } from './paginacion.js';
import { validarToken } from './validacionToken.js';

let ventas = [];
const API_BASE = '/api';

const exportBtn = document.querySelector('.generar-reporte');
const volverDashboardBtn = document.querySelector('.volver-dashboard');

window.addEventListener('DOMContentLoaded', async () => {
  const usuarioValido = await validarToken();
  if (usuarioValido) {
    const tbody = document.getElementById('productosBody');
    const paginacionContainer = document.getElementById('paginacion');

    await cargarVentas();

    paginacionContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-paginacion')) {
        const page = parseInt(e.target.dataset.page);
        const filtroActual = document.getElementById('filtroEstado')?.value || '';
        cargarVentas(filtroActual, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    tbody.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const ventaId = btn.dataset.id;

      if (btn.classList.contains('btn-ver-detalles')) {
        await verDetalles(ventaId);
      }

      if (btn.classList.contains('btn-editar')) {
        await editarVenta(ventaId);
      }
    });

    exportBtn.addEventListener('click', exportarReporte);
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

async function cargarVentas(filtro = '', pagina = 1) {
  const loading = document.getElementById('loading');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  loading.style.display = 'block';
  tableContainer.style.display = 'none';
  emptyState.style.display = 'none';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/ventas?page=${pagina}&estado=${filtro}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      window.location.href = '/api/admin/login-view';
      return;
    }

    const { data } = await response.json();

    ventas = data?.ventas || [];

    mostrarVentas();
    renderPaginacion(data.pagination);
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    showAlert('Error al cargar los ventas', 'error');
    emptyState.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

function mostrarVentas() {
  const tbody = document.getElementById('productosBody');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  let ventasFiltrados = ventas;

  tbody.innerHTML = '';
  ventasFiltrados.forEach(venta => {
    let badgeEstado;
    switch (venta.estado.toLowerCase()) {
      case 'pendiente':
        badgeEstado = 'badge-pendiente';
        break;
      case 'procesando':
        badgeEstado = 'badge-procesando';
        break;
      case 'completado':
        badgeEstado = 'badge-completado';
        break;
      default:
        badgeEstado = 'badge-cancelado';
    }
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${venta.id}</td>
            <td>${venta.cliente_nombre || 'Invitado'}</td>
            <td>${venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1).toLowerCase()}</td>
            <td>$${Number(venta.total).toLocaleString()}</td>
            <td>${new Date(venta.created_at).toLocaleDateString('es-AR')}</td>
            <td>
              <span class="badge ${badgeEstado}">
                ${venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1).toLowerCase()}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 5px;">
                <button class="btn btn-primary btn-small btn-editar" data-id="${venta.id}">
                  Editar
                </button>
                <button class="btn btn-secondary btn-small btn-ver-detalles" data-id="${venta.id}">
                  Ver detalles
                </button>
              </div>
            </td>
        `;

    tbody.appendChild(row);
  });

  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';
}

async function exportarReporte(e) {
  const token = localStorage.getItem('token');
  try {
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = 'Exportando...';
    button.disabled = true;

    const response = await fetch('/api/admin/export-ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar el reporte');
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;

    const filename = `reporte_ventas ${new Date().toISOString().split('T')[0]} .xlsx`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    button.textContent = originalText;
    button.disabled = false;

    showAlert('Reporte exportado exitosamente', 'success');
  } catch (error) {
    console.error('Error al descargar el reporte de ventas:', error);
    showAlert('Error al descargar el reporte de ventas', 'error');
  }
}

async function editarVenta(id) {
  document.getElementById('edicionVentaId').textContent = id;
  document.getElementById('edicionLoading').style.display = 'none';
  document.getElementById('edicionContent').style.display = 'block';

  const estadoSelect = document.getElementById('edicionEstado');
  const form = document.getElementById('formEdicion');

  abrirModal('modalEdicion');

  async function handleSubmit(event) {
    event.preventDefault();
    const nuevoEstado = estadoSelect.value;

    try {
      const response = await fetch(`${API_BASE}/ventas/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        showAlert('Estado actualizado correctamente', 'success');
        cerrarModal('modalEdicion');
        await cargarVentas();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      showAlert('Error al actualizar el estado: ' + error.message, 'error');
    }
  }

  form.onsubmit = handleSubmit;
}

async function verDetalles(id) {
  document.getElementById('detalleVentaId').textContent = id;
  abrirModal('modalDetalles');

  try {
    const response = await fetch(`${API_BASE}/ventas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const { data } = await response.json();

    document.getElementById('detalleCliente').textContent = data.cliente_nombre || 'Invitado';
    document.getElementById('detalleTotal').textContent = `$${Number(data.total).toLocaleString()}`;

    const itemsBody = document.getElementById('detalleItems');
    itemsBody.innerHTML = '';
    data.items.forEach((item) => {
      itemsBody.innerHTML += `
        <tr>
          <td>${item.titulo}</td>
          <td>${item.cantidad}</td>
          <td>$${Number(item.precio_unitario).toLocaleString()}</td>
          <td>$${Number(item.subtotal).toLocaleString()}</td>
        </tr>
      `;
    });

    document.getElementById('detallesLoading').style.display = 'none';
    document.getElementById('detallesContent').style.display = 'block';
  } catch (error) {
    console.error('Error al abrir el modal de detales:', error);
    cerrarModal('modalDetalles');
  }
}

function abrirModal(id) {
  document.getElementById(id).classList.add('show');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('show');
}

function volverDashboard() {
  window.location.href = '/api/admin/dashboard-view';
}

document.getElementById('filtroEstado').addEventListener('change', async (e) => {
  const filtro = e.target.value;
  await cargarVentas(filtro);
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-close-modal')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      cerrarModal(modal.id);
    }
  }
});