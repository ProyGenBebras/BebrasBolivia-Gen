import type { CrearUsuarioPayload, RolUsuario } from '../dominio/usuario';
import { ROLES_USUARIO } from '../dominio/usuario';

const LONGITUD_MINIMA_CONTRASENA = 8;
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EstadoFormularioUsuario {
  correo: string;
  nombres: string;
  apellidos: string;
  contrasena: string;
  rol: RolUsuario;
  nombreUsuario: string;
  telefono: string;
}

export type ErroresFormulario = Partial<Record<keyof EstadoFormularioUsuario, string>>;

/**
 * Valida los campos obligatorios del formulario antes de enviarlo al backend.
 * Devuelve un mapa de errores por campo; vacio significa que es valido.
 * El backend vuelve a validar: esta capa es solo para feedback inmediato.
 */
export function validarFormularioUsuario(estado: EstadoFormularioUsuario): ErroresFormulario {
  const errores: ErroresFormulario = {};

  if (!estado.correo.trim()) {
    errores.correo = 'El correo es obligatorio';
  } else if (!PATRON_CORREO.test(estado.correo.trim())) {
    errores.correo = 'El correo no tiene un formato valido';
  }

  if (!estado.nombres.trim()) {
    errores.nombres = 'Los nombres son obligatorios';
  }

  if (!estado.apellidos.trim()) {
    errores.apellidos = 'Los apellidos son obligatorios';
  }

  if (!estado.contrasena) {
    errores.contrasena = 'La contrasena es obligatoria';
  } else if (estado.contrasena.length < LONGITUD_MINIMA_CONTRASENA) {
    errores.contrasena = `La contrasena debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres`;
  }

  const rolValido = ROLES_USUARIO.some((opcion) => opcion.valor === estado.rol);
  if (!rolValido) {
    errores.rol = 'Debe seleccionar un rol valido';
  }

  return errores;
}

/** Construye el payload limpio para el backend a partir del estado del formulario. */
export function construirPayload(estado: EstadoFormularioUsuario): CrearUsuarioPayload {
  return {
    correo: estado.correo.trim().toLowerCase(),
    nombres: estado.nombres.trim(),
    apellidos: estado.apellidos.trim(),
    contrasena: estado.contrasena,
    rol: estado.rol,
    nombreUsuario: estado.nombreUsuario.trim() || undefined,
    telefono: estado.telefono.trim() || undefined,
  };
}
