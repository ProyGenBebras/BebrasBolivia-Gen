export interface Rol {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        usuarios: number;
    };
}

export interface UsuarioResumen {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    activo: boolean;
    createdAt: string;
}

export interface CrearRolPayload {
    nombre: string;
    descripcion?: string;
}

export interface ActualizarRolPayload {
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
}

export interface AsignarRolPayload {
    usuarioId: number;
    rolId: number;
}