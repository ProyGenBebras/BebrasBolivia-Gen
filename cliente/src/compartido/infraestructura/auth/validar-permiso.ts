import { permisosPorRol, Permiso } from './permisos';
import { RolUsuario } from './roles';

export function tienePermiso(rol: RolUsuario, permiso: Permiso): boolean {
  return permisosPorRol[rol]?.includes(permiso) ?? false;
}