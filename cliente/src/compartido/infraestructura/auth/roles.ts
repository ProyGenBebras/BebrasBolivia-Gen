export type RolUsuario = 'administrador' | 'coordinador' | 'profesor' | 'estudiante';

export const ROLES = {
  ADMINISTRADOR: 'administrador',
  COORDINADOR: 'coordinador',
  PROFESOR: 'profesor',
  ESTUDIANTE: 'estudiante',
} as const satisfies Record<string, RolUsuario>;