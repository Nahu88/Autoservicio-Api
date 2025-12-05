export const getInfoVentasMes = (mesActual, mesAnterior, existeMesAnterior) => {
  const diferencia = mesActual - mesAnterior;
  let porcentaje;

  if (existeMesAnterior) {
    porcentaje = (diferencia / mesAnterior) * 100
  } else {
    porcentaje = 100;
  }
  return {
    cantidad: mesActual,
    variacion: porcentaje.toFixed(2) + '%',
    tipo: porcentaje >= 0 ? "aumento" : "descuento",
    diferencia
  }
}