import { RolUsuario } from './roles';

export type Permiso =
  | 'gestionar_usuarios'
  | 'crear_examen'
  | 'editar_examen'
  | 'ver_resultados'
  | 'resolver_examen';

export const permisosPorRol: Record<RolUsuario, Permiso[]> = {
  administrador: [
    'gestionar_usuarios',
    'crear_examen',
    'editar_examen',
    'ver_resultados',
    'resolver_examen',
  ],
  examinador: ['ver_resultados'],
  profesor: ['ver_resultados'],
  estudiante: ['resolver_examen'],
};
