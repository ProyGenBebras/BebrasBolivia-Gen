/**
 * Utilidades HTTP compartidas por las capas de API del módulo.
 * La URL del backend se incrusta en build-time (ver docker-compose.yml / .env).
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4102/api/v1';

/** Error HTTP del backend con el status disponible para decidir en la UI (401, 403, ...). */
export class ErrorApi extends Error {
  public readonly status: number;

  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
  }
}

/** Construye los headers con el JWT si existe sesión activa. */
export function cabeceras(token: string | null): HeadersInit {
  const base: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    base['Authorization'] = `Bearer ${token}`;
  }
  return base;
}

/** Extrae el mensaje de error del cuerpo JSON del backend (o un fallback). */
export async function extraerMensajeError(respuesta: Response): Promise<string> {
  try {
    const cuerpo = (await respuesta.json()) as { error?: string };
    return cuerpo.error ?? `Error ${respuesta.status}`;
  } catch {
    return `Error ${respuesta.status}`;
  }
}
