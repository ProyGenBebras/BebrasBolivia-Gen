export interface ErroresPerfil {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
}

export const REGEX_NOMBRES = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_TELEFONO = /^\d{7,15}$/;

export function validarPerfil(datos: {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}): ErroresPerfil {
  const nuevosErrores: ErroresPerfil = {};

  if (!datos.nombres.trim()) {
    nuevosErrores.nombres = 'El nombre es obligatorio';
  } else if (datos.nombres.trim().length < 2) {
    nuevosErrores.nombres = 'El nombre debe tener al menos 2 caracteres';
  } else if (datos.nombres.trim().length > 25) {
    nuevosErrores.nombres = 'El nombre no debe exceder los 25 caracteres';
  } else if (!REGEX_NOMBRES.test(datos.nombres.trim())) {
    nuevosErrores.nombres = 'El nombre solo puede contener letras y espacios';
  }

  if (!datos.apellidos.trim()) {
    nuevosErrores.apellidos = 'Los apellidos son obligatorios';
  } else if (datos.apellidos.trim().length < 2) {
    nuevosErrores.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
  } else if (datos.apellidos.trim().length > 25) {
    nuevosErrores.apellidos = 'Los apellidos no deben exceder los 25 caracteres';
  } else if (!REGEX_NOMBRES.test(datos.apellidos.trim())) {
    nuevosErrores.apellidos = 'Los apellidos solo pueden contener letras y espacios';
  }

  if (!datos.correo.trim()) {
    nuevosErrores.correo = 'El correo es obligatorio';
  } else if (!REGEX_EMAIL.test(datos.correo.trim())) {
    nuevosErrores.correo = 'El correo no tiene un formato válido';
  } else if (datos.correo.trim().length > 100) {
    nuevosErrores.correo = 'El correo es demasiado largo';
  }

  if (!datos.telefono.trim()) {
    nuevosErrores.telefono = 'El teléfono es obligatorio';
  } else if (!REGEX_TELEFONO.test(datos.telefono.trim())) {
    nuevosErrores.telefono = 'Ingrese un teléfono válido (7-15 dígitos)';
  }

  return nuevosErrores;
}
