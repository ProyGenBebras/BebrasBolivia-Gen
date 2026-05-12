// Los campos createdAt/updatedAt mantienen nombres de la librería Prisma (integración externa)
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  estaActivo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface RolConUsuarios extends Rol {
  _count: {
    usuarios: number;
  };
}

export interface UsuarioEnRol {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  estaActivo: boolean;
  creadoEn: Date;
}
