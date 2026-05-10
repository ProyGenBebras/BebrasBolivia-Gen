export const ROLES_USUARIO = ['administrador', 'coordinador', 'profesor', 'estudiante'] as const;
export type RolUsuario = (typeof ROLES_USUARIO)[number];

export interface CrearUsuarioPayload {
  correo: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  rol: RolUsuario;
  telefono?: string;
  nombreUsuario?: string;
}
