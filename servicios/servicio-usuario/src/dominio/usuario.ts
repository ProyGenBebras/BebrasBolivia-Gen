export const ROLES_PERMITIDOS = ['estudiante', 'profesor', 'admin'] as const;

export type RolUsuario = (typeof ROLES_PERMITIDOS)[number];

export interface Usuario {
  id: string;
  nombre: string;
  rol: RolUsuario;
}

export interface UsuarioConPermisoAdmin extends Usuario {
  rol: 'admin';
}
