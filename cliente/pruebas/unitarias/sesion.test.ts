import { describe, expect, it, beforeEach } from '@jest/globals';

import { cerrarSesion, iniciarSesion, obtenerToken } from '../../src/modulos/user/aplicacion/sesion';

const TOKEN_EJEMPLO = 'eyJhbGciOiJIUzI1NiJ9.test.token';

describe('sesion - manejo de token JWT en localStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('sin sesión devuelve null', () => {
    expect(obtenerToken()).toBeNull();
  });

  it('iniciarSesion guarda el token y obtenerToken lo recupera', () => {
    iniciarSesion(TOKEN_EJEMPLO);
    expect(obtenerToken()).toBe(TOKEN_EJEMPLO);
  });

  it('cerrarSesion elimina el token guardado', () => {
    iniciarSesion(TOKEN_EJEMPLO);
    cerrarSesion();
    expect(obtenerToken()).toBeNull();
  });
});
