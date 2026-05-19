export type RolUsuario = 'administrador' | 'coordinador' | 'profesor' | 'estudiante';

export const ROLES_DISPONIBLES: { etiqueta: string; valor: RolUsuario }[] = [
  { etiqueta: 'Administrador', valor: 'administrador' },
  { etiqueta: 'Coordinador', valor: 'coordinador' },
  { etiqueta: 'Profesor', valor: 'profesor' },
  { etiqueta: 'Estudiante', valor: 'estudiante' },
];

// 2. Actualizamos el resumen del usuario para coincidir con la nueva base de datos
export interface UsuarioResumen {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: RolUsuario;
}

// 3.  Asignar un rol a un usuario
export interface CambiarRolPayload {
  usuarioId: string;
  nuevoRol: RolUsuario;
}
