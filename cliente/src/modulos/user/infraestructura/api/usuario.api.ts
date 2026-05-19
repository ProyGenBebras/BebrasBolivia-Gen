import type { ResultadoCargaMasiva } from '../../dominio/usuario';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4102/api/v1';

export const usuarioApi = {
  cargarMasivo: async (_archivo: File): Promise<ResultadoCargaMasiva> => {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      exitosos: 4,
      errores: [{ fila: 3, motivo: 'Email duplicado' }],
    };
  },
};
