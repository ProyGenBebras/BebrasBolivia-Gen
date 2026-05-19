/*
import { Rol } from '../../dominio/rol';

export interface RolVista {
  id: number;
  nombre: string;
  etiqueta: string;
  descripcion: string;
  activo: boolean;
  totalUsuarios: number;
}

const ETIQUETAS: Record<string, string> = {
  adm: 'Administrador',
  examinador: 'Examinador',
  participante: 'Participante',
};

export function mapearRolAVista(rol: Rol): RolVista {
  return {
    id: rol.id,
    nombre: rol.nombre,
    etiqueta: ETIQUETAS[rol.nombre] ?? rol.nombre,
    descripcion: rol.descripcion ?? 'Sin descripción',
    activo: rol.activo,
    totalUsuarios: rol._count?.usuarios ?? 0,
  };
}

export function mapearRolesAVista(roles: Rol[]): RolVista[] {
  return roles.map(mapearRolAVista);
}
*/
import { Rol } from '../../dominio/rol';

export interface RolVista {
  id: number;
  nombre: string;
  etiqueta: string;
  descripcion: string;
  activo: boolean;
  totalUsuarios: number;
}

const ETIQUETAS: Record<string, string> = {
  administrador: 'Administrador',
  coordinador: 'Coordinador',
  profesor: 'Profesor',
  estudiante: 'Estudiante',
  adm: 'Administrador',
  examinador: 'Coordinador',
  participante: 'Estudiante',
};

export function mapearRolAVista(rol: Rol): RolVista {
  return {
    id: rol.id,
    nombre: rol.nombre,
    etiqueta: ETIQUETAS[rol.nombre] ?? rol.nombre,
    descripcion: rol.descripcion ?? 'Sin descripción',
    activo: rol.activo,
    totalUsuarios: rol._count?.usuarios ?? 0,
  };
}

export function mapearRolesAVista(roles: Rol[]): RolVista[] {
  return roles.map(mapearRolAVista);
}