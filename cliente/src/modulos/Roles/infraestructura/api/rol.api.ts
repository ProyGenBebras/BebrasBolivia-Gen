import { USER_SERVICE_URL } from './config';

import type { RolUsuario, Usuario } from '@/modulos/Usuarios/dominio/usuario';

const API_BASE_URL = USER_SERVICE_URL;

export const rolApi = {
  // 1. Obtener los usuarios que tienen un rol específico
  obtenerUsuariosPorRol: async (rol: RolUsuario): Promise<Usuario[]> => {
    const respuesta = await fetch(`${API_BASE_URL}/api/v1/roles/${rol}/usuarios`);

    if (!respuesta.ok) {
      throw new Error('Error al obtener los usuarios');
    }

    // Le decimos a TypeScript exactamente qué forma tiene el JSON
    const json = (await respuesta.json()) as { data: Usuario[] };
    return json.data;
  },

  // 2. Cambiar el rol de un usuario existente
  asignarRol: async (usuarioId: string, nuevoRol: RolUsuario): Promise<Usuario> => {
    const respuesta = await fetch(`${API_BASE_URL}/api/v1/roles/asignar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuarioId, nuevoRol }),
    });

    if (!respuesta.ok) {
      // También tipamos la respuesta de error
      const errorJson = (await respuesta.json()) as { error?: string };
      throw new Error(errorJson.error ?? 'Error al asignar el nuevo rol');
    }

    // Le decimos a TypeScript que aquí esperamos un solo Usuario dentro de "data"
    const json = (await respuesta.json()) as { data: Usuario };
    return json.data;
  },
};
