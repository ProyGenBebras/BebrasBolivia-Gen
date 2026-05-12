export interface CrearRolDto {
  nombre: string;
  descripcion?: string;
}

export interface ActualizarRolDto {
  nombre?: string;
  descripcion?: string;
  estaActivo?: boolean;
}

export interface AsignarRolDto {
  usuarioId: number;
  rolId: number;
}
