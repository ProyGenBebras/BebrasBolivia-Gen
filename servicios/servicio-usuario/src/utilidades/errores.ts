/**
 * Clase base de error para errores de negocio controlados.
 * Permite distinguir entre errores esperados y errores internos inesperados.
 */
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
