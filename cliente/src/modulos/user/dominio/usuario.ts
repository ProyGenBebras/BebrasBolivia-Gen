import type { Rol } from './rol';

/**
 * Usuario público tal como lo expone el backend
 * (GET /api/v1/usuarios — nunca incluye contrasena_hash).
 */
export interface Usuario {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: Rol;
  nombreUsuario: string | null;
  telefono: string | null;
  estaActivo: boolean;
  estaVerificado: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

/** Metadatos de paginación que acompañan a los listados. */
export interface Paginacion {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
