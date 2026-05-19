
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ProtegerRuta } from '@/compartido/infraestructura/auth/proteger-ruta';
import { ROLES } from '@/compartido/infraestructura/auth/roles';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Restringir acceso a rutas', () => {
  let contenedor: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    pushMock.mockClear();
    contenedor = document.createElement('div');
    document.body.appendChild(contenedor);
    root = createRoot(contenedor);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    document.body.removeChild(contenedor);
  });

  it('debería mostrar el contenido cuando el usuario tiene permiso', () => {
    act(() => {
      root.render(
        <ProtegerRuta rolUsuario={ROLES.ADMINISTRADOR} permisoRequerido="gestionar_roles">
          <p>Contenido protegido de roles</p>
        </ProtegerRuta>,
      );
    });

    expect(contenedor.textContent).toContain('Contenido protegido de roles');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('debería redirigir a acceso denegado cuando el usuario no tiene permiso', () => {
    act(() => {
      root.render(
        <ProtegerRuta rolUsuario={ROLES.ESTUDIANTE} permisoRequerido="gestionar_roles">
          <p>Contenido protegido de roles</p>
        </ProtegerRuta>,
      );
    });

    expect(contenedor.textContent).not.toContain('Contenido protegido de roles');
    expect(pushMock).toHaveBeenCalledWith('/acceso-denegado?motivo=sin-permiso');
  });

  it('debería redirigir a acceso denegado cuando no existe usuario autenticado', () => {
    act(() => {
      root.render(
        <ProtegerRuta rolUsuario={null} permisoRequerido="gestionar_roles">
          <p>Contenido protegido de roles</p>
        </ProtegerRuta>,
      );
    });

    expect(contenedor.textContent).not.toContain('Contenido protegido de roles');
    expect(pushMock).toHaveBeenCalledWith('/acceso-denegado?motivo=no-autenticado');
  });
});