import type { Rol } from '../../dominio/rol';

import { API_URL } from './http';

interface RespuestaRoles {
  data: Rol[];
}

/**
 * Obtiene la lista de roles disponibles desde el backend (GET /api/v1/roles).
 * Este endpoint no requiere autenticación.
 */
export async function obtenerRoles(): Promise<Rol[]> {
  const respuesta = await fetch(`${API_URL}/roles`, {
    headers: { Accept: 'application/json' },
  });

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los roles`);
  }

  const json = (await respuesta.json()) as RespuestaRoles;
  return json.data;
}
