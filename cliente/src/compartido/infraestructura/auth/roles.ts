export type RolUsuario = 'administrador' | 'examinador' | 'profesor' | 'estudiante';

export const ROLES = {
  ADMINISTRADOR: 'administrador',
  EXAMINADOR: 'coordinador',
  PROFESOR: 'profesor',
  ESTUDIANTE: 'estudiante',
} as const;
