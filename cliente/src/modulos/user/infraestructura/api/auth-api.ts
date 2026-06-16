import type { Usuario } from '../../dominio/usuario';

import { API_URL, cabeceras, ErrorApi, extraerMensajeError } from './http';

interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

export async function login(correo: string, contrasena: string): Promise<RespuestaLogin> {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: cabeceras(null),
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  return (await respuesta.json()) as RespuestaLogin;
}

export async function obtenerActual(token: string): Promise<Usuario> {
  const respuesta = await fetch(`${API_URL}/auth/me`, {
    headers: cabeceras(token),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  return (await respuesta.json()) as Usuario;
}
