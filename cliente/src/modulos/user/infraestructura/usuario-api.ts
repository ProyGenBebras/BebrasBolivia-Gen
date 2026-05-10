import type { CrearUsuarioPayload } from '../dominio/usuario';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4102';

export interface RespuestaCrearUsuario {
  mensaje: string;
  usuario: {
    id: string;
    correo: string;
    nombres: string;
    apellidos: string;
    rol: string;
  };
}

export interface ErrorApi {
  mensaje: string;
  errores?: Array<{ campo: string; mensaje: string }>;
}

export async function crearUsuarioApi(
  payload: CrearUsuarioPayload,
): Promise<RespuestaCrearUsuario> {
  const respuesta = await fetch(`${API_URL}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const cuerpo = (await respuesta.json()) as RespuestaCrearUsuario | ErrorApi;

  if (!respuesta.ok) {
    const error = cuerpo as ErrorApi;
    const detalle = error.errores?.map((e) => `${e.campo}: ${e.mensaje}`).join(' | ');
    throw new Error(detalle ? `${error.mensaje} — ${detalle}` : error.mensaje);
  }

  return cuerpo as RespuestaCrearUsuario;
}
