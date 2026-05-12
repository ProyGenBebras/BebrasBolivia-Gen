export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    activo: boolean;
    createdAt: string;
}

export interface CambiarEstadoPayload {
    activo: boolean;
}