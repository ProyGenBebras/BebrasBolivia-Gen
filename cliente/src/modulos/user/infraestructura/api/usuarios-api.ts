import type { Rol } from '../../dominio/rol';
import type { Paginacion, Usuario } from '../../dominio/usuario';

import { API_URL, cabeceras, ErrorApi, extraerMensajeError } from './http';

// ─── Tipos de respuesta ───────────────────────────────────────────────────────

interface RespuestaUsuario {
  data: Usuario;
}

interface RespuestaUsuarios {
  data: Usuario[];
  paginacion: Paginacion;
}

// ─── Payloads de entrada ──────────────────────────────────────────────────────

export interface ParametrosListarUsuarios {
  page?: number;
  limit?: number;
  rol?: Rol;
  estaActivo?: boolean;
  token: string | null;
}

export interface CrearUsuarioPayload {
  correo: string;
  nombres: string;
  apellidos: string;
  contrasena: string;
  rol: Rol;
  nombreUsuario?: string;
  telefono?: string;
}

export interface ActualizarUsuarioPayload {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
}

export interface ResultadoCargaMasiva {
  mensaje: string;
  totalProcesados?: number;
  insertados?: number;
  errores: string[];
  usuarios?: { id: string; correo: string }[];
}

// ─── Funciones de API ─────────────────────────────────────────────────────────

export async function listarUsuarios({
  page = 1,
  limit = 10,
  rol,
  estaActivo,
  token,
}: ParametrosListarUsuarios): Promise<RespuestaUsuarios> {
  const params: Record<string, string> = { page: String(page), limit: String(limit) };
  if (rol !== undefined) params['rol'] = rol;
  if (estaActivo !== undefined) params['estaActivo'] = String(estaActivo);

  const consulta = new URLSearchParams(params);
  const respuesta = await fetch(`${API_URL}/usuarios?${consulta.toString()}`, {
    headers: cabeceras(token),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  return (await respuesta.json()) as RespuestaUsuarios;
}

export async function crearUsuario(payload: CrearUsuarioPayload, token: string): Promise<Usuario> {
  const respuesta = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: cabeceras(token),
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  const json = (await respuesta.json()) as RespuestaUsuario;
  return json.data;
}

export async function obtenerUsuario(id: string, token: string): Promise<Usuario> {
  const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
    headers: cabeceras(token),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  const json = (await respuesta.json()) as RespuestaUsuario;
  return json.data;
}

export async function actualizarUsuario(
  id: string,
  payload: ActualizarUsuarioPayload,
  token: string,
): Promise<Usuario> {
  const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PATCH',
    headers: cabeceras(token),
    body: JSON.stringify(payload),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  const json = (await respuesta.json()) as RespuestaUsuario;
  return json.data;
}

export async function eliminarUsuario(id: string, token: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
    headers: cabeceras(token),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }
}

export async function cambiarEstado(
  id: string,
  estaActivo: boolean,
  token: string,
): Promise<Usuario> {
  const respuesta = await fetch(`${API_URL}/usuarios/${id}/estado`, {
    method: 'PATCH',
    headers: cabeceras(token),
    body: JSON.stringify({ estaActivo }),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  const json = (await respuesta.json()) as RespuestaUsuario;
  return json.data;
}

export async function cambiarRol(
  id: string,
  nuevoRol: Rol,
  token: string,
): Promise<{ id: string; correo: string; rol: Rol }> {
  const respuesta = await fetch(`${API_URL}/usuarios/${id}/rol`, {
    method: 'PATCH',
    headers: cabeceras(token),
    body: JSON.stringify({ nuevoRol }),
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  const json = (await respuesta.json()) as { data: { id: string; correo: string; rol: Rol } };
  return json.data;
}

// FormData: no usar cabeceras() para no sobreescribir el boundary de multipart
export async function cargaMasiva(file: File, token: string): Promise<ResultadoCargaMasiva> {
  const form = new FormData();
  form.append('file', file);

  const respuesta = await fetch(`${API_URL}/usuarios/carga-masiva`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: form,
  });

  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, await extraerMensajeError(respuesta));
  }

  return (await respuesta.json()) as ResultadoCargaMasiva;
}
