
export function renderPaginacion(paginacion) {
  const paginacionContainer = document.getElementById("paginacion");

  if (!paginacion) return;

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = paginacion;
  const maxBotones = 5;
  let inicio = Math.max(1, currentPage - Math.floor(maxBotones / 2));
  let fin = Math.min(totalPages, inicio + maxBotones - 1);

  paginacionContainer.innerHTML = '';

  if (hasPrevPage) {
    paginacionContainer.innerHTML += `
      <button class="btn-paginacion" data-page="${currentPage - 1}">
        ←
      </button>`;
  }

  if (fin - inicio < maxBotones - 1) {
    inicio = Math.max(1, fin - maxBotones + 1);
  }
  if (inicio > 1) {
    paginacionContainer.innerHTML += `
      <button class="btn-paginacion" data-page="1">1</button>`;
    if (inicio > 2) {
      paginacionContainer.innerHTML += `<span class="dots">...</span>`;
    }
  }

  for (let i = inicio; i <= fin; i++) {
    paginacionContainer.innerHTML += `
      <button class="btn-paginacion ${i === currentPage ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>`;
  }

  if (fin < totalPages) {
    if (fin < totalPages - 1) {
      paginacionContainer.innerHTML += `<span class="dots">...</span>`;
    }
    paginacionContainer.innerHTML += `
      <button class="btn-paginacion" data-page="${totalPages}">${totalPages}</button>`;
  }

  if (hasNextPage) {
    paginacionContainer.innerHTML += `
      <button class="btn-paginacion" data-page="${currentPage + 1}">
        →
      </button>`;
  }
}