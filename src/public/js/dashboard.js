import { validarToken } from './validacionToken.js';

// Genero la estructura base de los ultimos 7 días (fecha y nombre del dia) inicializados con monto 0.
function generarUltimos7dias() {
  const dias = [];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const diaSemana = fecha.getDay();

    dias.push({
      fecha: fecha.toISOString().split('T')[0],
      dia: nombresDias[diaSemana],
      monto: 0
    });
  }
  return dias;
}

// Realizo la petición a la API para obtener los datos crudos de las ventas registradas en la semana.
async function getVentasSemanales() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:4000/api/admin/ventas-semanales`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });
    const data = await response.json();

    return data.ventasSemanales;
  } catch (error) {
    console.error('Error al obtener las ventas semanales:', error);
  }
}

// Combino el calendario de los últimos 7 días con los datos de la API para mapear los montos correctos por cada dia
async function generarArrayVentas() {
  const ventasSemanales = await getVentasSemanales();
  const ultimos7Dias = generarUltimos7dias();

  const ventasMapeadas = ultimos7Dias.map((dia) => {
    const ventaEncontrada = ventasSemanales.find((venta) => {
      const fechaDb = new Date(venta.fecha).toISOString().split('T')[0];
      return fechaDb === dia.fecha;
    })

    return {
      fecha: dia.fecha,
      dia: dia.dia,
      monto: ventaEncontrada ? parseFloat(ventaEncontrada.monto) : 0
    }
  });
  return ventasMapeadas;
}

// Calculo las alturas proporcionales y genero el HTML dinamico para visualizar el grafico de barras en el DOM
async function renderChart() {
  const ventasSemanales = await generarArrayVentas();
  const chartContainer = document.getElementById('ventas-chart');
  const maxMonto = Math.max(...ventasSemanales.map(v => v.monto)); // monto maximo de las barras

  chartContainer.innerHTML = ventasSemanales.map((venta) => {
    const altura = (venta.monto / maxMonto) * 100;
    return `
      <div class="bar" style="height: ${altura}%">
        <div class="bar-value">$${(venta.monto / 1000).toFixed(0)}k</div>
        <div class="bar-label">${venta.dia}</div>
      </div>
    `;
  }).join('');
}

// Función auxiliar para inicializar otros indicadores o estadísticas generales del dashboard.
async function cargarEstadisticas() {
  try {
    console.log('Dashboard cargado');
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

// Punto de entrada: verifica la autenticacion, carga datos del perfil e inicia el renderizado de la vista
window.addEventListener('DOMContentLoaded', async () => {
  const usuario = await validarToken();

  if (usuario) {
    document.getElementById('admin-nombre').textContent = usuario.nombre || 'Admin';
    document.getElementById('admin-email').textContent = usuario.email || '';
    document.getElementById('admin-inicial').textContent = (usuario.nombre || 'A').charAt(0);

    renderChart();
    cargarEstadisticas();
  } else {
    window.location.href = '/api/admin/login-view';
    return;
  }
});

document.querySelector('#logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/api/admin/login-view';
});