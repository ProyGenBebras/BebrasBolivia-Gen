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