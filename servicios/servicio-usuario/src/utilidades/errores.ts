/**
 * Error de negocio controlado. Lo lanzan las capas de servicio cuando una
 * regla del dominio no se cumple (ej. correo duplicado, rol invalido).
 * El middleware de errores lo traduce a una respuesta HTTP segura sin
 * exponer detalles internos al cliente.
 */
export class ErrorNegocio extends Error {
  public readonly codigo: number;

  constructor(mensaje: string, codigo = 400) {
    super(mensaje);
    this.name = 'ErrorNegocio';
    this.codigo = codigo;
  }
}
