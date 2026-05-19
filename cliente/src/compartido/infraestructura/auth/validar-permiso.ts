import type { Permiso } from './permisos';
import { permisosPorRol } from './permisos';
import type { RolUsuario } from './roles';

export function tienePermiso(rol: RolUsuario, permiso: Permiso): boolean {
  return permisosPorRol[rol]?.includes(permiso) ?? false;
}

export function tieneAlgunPermiso(rol: RolUsuario, permisos: Permiso[]): boolean {
  return permisos.some((permiso) => tienePermiso(rol, permiso));
}

export function tieneTodosLosPermisos(rol: RolUsuario, permisos: Permiso[]): boolean {
  return permisos.every((permiso) => tienePermiso(rol, permiso));
}