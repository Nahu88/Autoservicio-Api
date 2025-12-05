export const validatePaginationParams = (page, limit) => {
  const errors = [];

  if (page < 1) {
    errors.push('La página debe ser un número entero mayor o igual a 1.');
  }

  if (limit < 1) {
    errors.push('El límite debe ser un número entero mayor o igual a 1.');
  }

  if (limit > 100) {
    errors.push('El límite no debe ser mayor a 100.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export const validateOrderBy = (orderBy, allowedFields) => {
  const field = orderBy?.toLowerCase();

  if (!field || !allowedFields[field]) {
    return allowedFields[Object.keys(allowedFields)[0]];
  }
  console.log(allowedFields[field]);
  return allowedFields[field];
};

export const validateOrder = (order) => {
  const direction = order?.toUpperCase();
  return direction === 'ASC' ? 'ASC' : 'DESC';
};

export const PRODUCTO_ORDER_FIELDS = {
  'id': 'id',
  'titulo': 'titulo',
  'precio': 'precio',
  'created_at': 'created_at',
};

export const VENTA_ORDER_FIELDS = {
  'id': 'id',
  'total': 'total',
  'created_at': 'created_at',
};