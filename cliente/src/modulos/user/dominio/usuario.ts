export interface ResultadoCargaMasiva {
  exitosos: number;
  errores: ErrorFila[];
}

export interface ErrorFila {
  fila: number;
  motivo: string;
}
