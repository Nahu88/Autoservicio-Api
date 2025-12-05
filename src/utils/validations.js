
const Validator = {
  length: (min, max = Infinity) => {
    return (value) => {
      if (typeof value !== 'string') return false;
      const length = value.length;
      return length >= min && length <= max;
    }
  },
  min: (minValue) => {
    return (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return false;
      return value >= minValue;
    };
  },
  max: (maxValue) => {
    return (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return false;
      return value <= maxValue;
    }
  },
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  strongPassword: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
  notEmpty: (value) => {
    return value !== null && value !== undefined && value !== '';
  },
  isString: (value) => {
    return typeof value === 'string';
  },
  isInt: (value) => {
    return Number.isInteger(value);
  },
  isFloat: (value) => {
    return typeof value === 'number' && !Number.isNaN(value);
  },
  isUrl: (value) => {
    if (typeof value !== 'string') return false;
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  },
  range: (minValue, maxValue) => {
    return (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return false;
      return value >= minValue && value <= maxValue;
    }
  },
  optional: (value, validatorFunction) => {
    if (value === null || value === undefined || value === '') {
      return true;
    }
    return validatorFunction(value);
  },
  isBoolean: (value) => {
    return typeof value === 'boolean';
  },
  isPositive: (value) => {
    return value > 0;
  }
}

export const validateCreateProducto = ({ titulo, precio, stock, descripcion, id_usuario, id_tipo }) => {
  const errors = [];

  if (!Validator.notEmpty(titulo)) {
    errors.push('El titulo es obligatorio');
  } else if (!Validator.isString(titulo)) {
    errors.push('El titulo debe ser un texto');
  } else if (!Validator.length(3, 100)(titulo)) {
    errors.push('El titulo debe tener entre 3 y 100 caracteres');
  }

  if (!Validator.notEmpty(precio)) {
    errors.push('El precio es obligatorio');
  } else if (!Validator.isFloat(precio)) {
    errors.push('El precio debe ser un número');
  } else if (!Validator.isPositive(precio)) {
    errors.push('El precio debe ser mayor a 0');
  }

  if (!Validator.notEmpty(stock)) {
    errors.push('El stock es obligatorio');
  } else if (!Validator.isInt(stock)) {
    errors.push('El stock debe ser un número entero');
  } else if (!Validator.isPositive(stock)) {
    errors.push('El stock no puede ser negativo');
  }

  if (!Validator.optional(descripcion, Validator.isString)) {
    errors.push('La descripción debe ser un texto');
  }

  if (!Validator.isInt(id_usuario)) {
    errors.push('El id_usuario debe ser un número entero');
  }

  if (!Validator.notEmpty(id_tipo)) {
    errors.push('El id_tipo es obligatorio');
  } else if (!Validator.isInt(id_tipo)) {
    errors.push('El id_tipo debe ser un número entero');
  }

  return errors;
}

export const validateLogin = ({ email, password }) => {
  const errors = [];
  if (!Validator.notEmpty(email)) {
    errors.push('El correo electrónico es obligatorio');
  } else if (!Validator.email(email)) {
    errors.push('El correo electrónico no es válido');
  }
  if (!Validator.notEmpty(password)) {
    errors.push('La contraseña es obligatoria');
  } else if (!Validator.strongPassword(password)) {
    errors.push('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial');
  }
  return errors;
}

export const validateRegister = ({ nombre, email, password, admin }) => {
  const errors = [];
  if (!Validator.notEmpty(nombre)) {
    errors.push('El nombre es obligatorio');
  } else if (!Validator.isString(nombre)) {
    errors.push('El nombre debe ser un texto');
  } else if (!Validator.length(3, 64)(nombre)) {
    errors.push('El nombre debe tener entre 3 y 64 caracteres');
  }
  if (!Validator.notEmpty(email)) {
    errors.push('El correo electrónico es obligatorio');
  } else if (!Validator.email(email)) {
    errors.push('El correo electrónico no es válido');
  }
  if (!Validator.notEmpty(password)) {
    errors.push('La contraseña es obligatoria');
  } else if (!Validator.strongPassword(password)) {
    errors.push('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial');
  }
  if (!Validator.optional(admin, Validator.isBoolean)) {
    errors.push('El campo admin debe ser un valor booleano');
  }
  return errors;
}

export const validateUpdateProducto = ({ titulo, precio, stock, descripcion, id_tipo }) => {
  const errors = [];
  if (!Validator.optional(titulo, Validator.isString)) {
    errors.push('El titulo debe ser un texto');
  } else if (!Validator.optional(titulo, Validator.length(3, 100))) {
    errors.push('El titulo debe tener entre 3 y 100 caracteres');
  }

  if (!Validator.optional(precio, Validator.isFloat)) {
    errors.push('El precio debe ser un número');
  } else if (!Validator.optional(precio, Validator.isPositive)) {
    errors.push('El precio debe ser mayor a 0');
  }

  if (!Validator.optional(stock, Validator.isInt)) {
    errors.push('El stock debe ser un número entero');
  } else if (!Validator.optional(stock, Validator.isPositive)) {
    errors.push('El stock no puede ser negativo');
  }

  if (!Validator.optional(descripcion, Validator.isString)) {
    errors.push('La descripción debe ser un texto');
  }

  if (!Validator.optional(id_tipo, Validator.isInt)) {
    errors.push('El id_tipo debe ser un número entero');
  }

  return errors;
}

export const validateCliente = ({ nombre, email, telefono }) => {
  const errors = [];

  if (!Validator.notEmpty(nombre)) {
    errors.push('El nombre es obligatorio');
  } else if (!Validator.isString(nombre)) {
    errors.push('El nombre debe ser un texto');
  } else if (!Validator.length(3, 100)(nombre)) {
    errors.push('El nombre debe tener entre 3 y 100 caracteres');
  }

  if (!Validator.optional(email, Validator.email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (!Validator.optional(telefono, Validator.length(7, 15))) {
    errors.push('El teléfono debe tener entre 7 y 15 caracteres');
  }
  return errors;
}

export const validateCarrito = (cliente_id) => {
  const errors = [];

  if (!Validator.optional(cliente_id, Validator.isInt)) {
    errors.push('El id del cliente debe ser un número entero');
  }

  return errors;
}

export const validateCarritoEstado = (id, estado) => {
  const errors = [];
  const estados = ['activo', 'abandonado', 'convertido'];
  if (!Validator.optional(Number(id), Validator.isInt)) {
    errors.push('El id del cliente debe ser un número entero');
  }
  if (!Validator.notEmpty(estado)) {
    errors.push('El estado es obligatorio');
  } else if (!estados.includes(estado.toLowerCase())) {
    errors.push('El estado del carrito debe ser ("activo", "abandonado" o "convertido")')
  }
  return errors;
}

export const validateAddCarritoItems = (carritoId, productoId, cantidad) => {
  const errors = [];

  if (!Validator.notEmpty(carritoId)) {
    errors.push('El carritoId es obligatorio');
  } else if (!Validator.isInt(carritoId)) {
    errors.push('El carritoId debe ser un numero entero');
  }

  if (!Validator.notEmpty(productoId)) {
    errors.push('El productoId es obligatorio');
  } else if (!Validator.isInt(productoId)) {
    errors.push('El productoId debe ser un numero entero');
  }

  if (!Validator.notEmpty(cantidad)) {
    errors.push('La cantidad es obligatoria');
  } else if (!Validator.isInt(cantidad)) {
    errors.push('El campo cantidad debe ser un numero entero');
  } else if (!Validator.isPositive(cantidad)) {
    errors.push('La cantidad debe ser un numero positivo')
  }

  return errors;
}

export const validateVentas = (idCarrito, metodoPago, notas) => {
  const errors = [];
  const metodos = ['efectivo', 'tarjeta', 'transferencia', 'qr'];

  if (!Validator.notEmpty(idCarrito)) {
    errors.push('El id del carrito es obligatoria');
  } else if (!Validator.isInt(idCarrito)) {
    errors.push('El id del carrito debe ser un numero entero');
  }

  if (!Validator.notEmpty(metodoPago)) {
    errors.push('El metodo de pago es obligatorio')
  } else if (!metodos.includes(metodoPago.toLowerCase())) {
    errors.push('El metodo de pago no es valido, debe ser "efectivo", "tarjeta", "transferencia" o "qr"')
  }

  if (!Validator.optional(notas, Validator.isString)) {
    errors.push('La nota debe ser un texto');
  } else if (!Validator.optional(notas, Validator.length(3, 100))) {
    errors.push('La nota debe ser tener una longitud de entre 3 y 100 caracteres');
  }

  return errors;
}

export const validateVentasEstado = (estado) => {
  const errors = [];
  const estados = ['pendiente', 'procesando', 'completado', 'cancelado'];
  if (!Validator.notEmpty(estado)) {
    errors.push('El estado es obligatorio');
  } else if (!estados.includes(estado.toLowerCase())) {
    errors.push('El estado de la venta debe ser ("pendiente", "procesando", "completado" o "cancelado")')
  }
  return errors;
}