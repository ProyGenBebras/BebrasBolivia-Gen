import type { ResultadoCargaMasiva } from '../../dominio/usuario';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4102/api/v1';

export const usuarioApi = {
  cargarMasivo: async (archivo: File): Promise<ResultadoCargaMasiva> => {
    const formulario = new FormData();
    formulario.append('archivo', archivo);

    const respuesta = await fetch(`${BASE_URL}/usuarios/carga-masiva`, {
      method: 'POST',
      body: formulario,
    });

    if (!respuesta.ok) {
      const cuerpo = (await respuesta.json()) as { error?: string };
      throw new Error(cuerpo.error ?? `Error ${respuesta.status}`);
    }

    return respuesta.json() as Promise<ResultadoCargaMasiva>;
  },
};
