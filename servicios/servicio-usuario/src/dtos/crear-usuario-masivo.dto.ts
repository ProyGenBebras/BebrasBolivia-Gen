export interface CrearUsuarioMasivoDto {
  nombre: string;
  apellidos: string;
  email: string;
  rolId: number;
}

export interface ResultadoCargaMasiva {
  exitosos: number;
  errores: ErrorFila[];
}

export interface ErrorFila {
  fila: number;
  motivo: string;
}