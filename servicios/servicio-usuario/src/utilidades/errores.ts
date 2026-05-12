export class ErrorNegocio extends Error {
  constructor(
    public readonly mensaje: string,
    public readonly codigo: number = 400,
  ) {
    super(mensaje);
    this.name = 'ErrorNegocio';
    this.message = mensaje;
  }
}
