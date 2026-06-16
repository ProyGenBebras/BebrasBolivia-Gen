import { describe, expect, it, jest, afterEach } from '@jest/globals';

import { obtenerRoles } from '../../src/modulos/user/infraestructura/api/roles-api';

describe('roles-api - obtenerRoles', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('devuelve la lista de roles cuando la respuesta es correcta', async () => {
    const rolesEsperados = ['administrador', 'coordinador', 'profesor', 'estudiante'];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: rolesEsperados }),
    }) as unknown as typeof fetch;

    await expect(obtenerRoles()).resolves.toEqual(rolesEsperados);
  });

  it('lanza un error cuando la respuesta no es ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }) as unknown as typeof fetch;

    await expect(obtenerRoles()).rejects.toThrow('Error 500');
  });
});
