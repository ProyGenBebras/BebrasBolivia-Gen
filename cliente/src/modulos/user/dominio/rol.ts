/**
 * Roles del dominio, alineados con el enum `rol_usuario` del backend
 * (GET /api/v1/roles devuelve estos mismos valores).
 */
export type Rol = 'administrador' | 'coordinador' | 'profesor' | 'estudiante';

/** Etiqueta legible para mostrar en la UI. */
export const ETIQUETA_ROL: Record<Rol, string> = {
  administrador: 'Administrador',
  coordinador: 'Coordinador',
  profesor: 'Profesor',
  estudiante: 'Estudiante',
};

/** Descripción breve de cada rol. */
export const DESCRIPCION_ROL: Record<Rol, string> = {
  administrador: 'Acceso total: gestiona usuarios, roles e instituciones.',
  coordinador: 'Gestiona su institución asignada y sus usuarios.',
  profesor: 'Gestiona sus grupos y consulta el banco de preguntas.',
  estudiante: 'Rinde exámenes y accede a práctica y resultados.',
};
