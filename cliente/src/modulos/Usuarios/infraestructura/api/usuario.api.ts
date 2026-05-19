import type { CrearUsuarioPayload, Usuario } from '../../dominio/usuario';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4102/api/v1';

async function peticion<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });

  if (!respuesta.ok) {
    const cuerpo = (await respuesta.json()) as { error?: string };
    throw new Error(cuerpo.error ?? `Error ${respuesta.status}`);
  }

  const json = (await respuesta.json()) as { data: T };
  return json.data;
}

export const usuarioApi = {
  crear: (datos: CrearUsuarioPayload): Promise<Usuario> =>
    peticion<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(datos) }),
};
