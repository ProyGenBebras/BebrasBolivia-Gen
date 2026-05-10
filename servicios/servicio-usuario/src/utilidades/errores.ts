export class ErrorNegocio extends Error {
  public readonly mensaje: string;
  public readonly codigo: number;

  constructor(mensaje: string, codigo = 400) {
    super(mensaje);
    this.name = 'ErrorNegocio';
    this.mensaje = mensaje;
    this.codigo = codigo;
  }
}

export class ErrorValidacion extends ErrorNegocio {
  public readonly errores: Array<{ campo: string; mensaje: string }>;

  constructor(errores: Array<{ campo: string; mensaje: string }>) {
    super('Datos inválidos', 400);
    this.name = 'ErrorValidacion';
    this.errores = errores;
  }
}
