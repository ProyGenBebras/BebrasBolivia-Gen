export interface CrearRolDto {
    nombre: string;
    descripcion?: string;
}

export interface ActualizarRolDto {
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
}

export interface AsignarRolDto {
    usuarioId: number;
    rolId: number;
}