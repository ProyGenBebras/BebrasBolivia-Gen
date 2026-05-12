export class ErrorNegocio extends Error {
  public readonly status: number;

  constructor(
    public readonly mensaje: string,
    status: number = 400,
  ) {
    super(mensaje);
    this.name = 'ErrorNegocio';
    this.message = mensaje;
    this.status = status;
  }
}
