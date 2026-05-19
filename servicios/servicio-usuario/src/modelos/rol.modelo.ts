export interface Rol {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
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
    activo: boolean;
    createdAt: Date;
}