import { UsuarioServicio } from '../../src/servicios/usuario.servicio';
import { UsuarioRepositorioMock } from '../../src/repositorios/usuario.repositorio.mock';

describe('UsuarioServicio - TDD', () => {
  let servicio: UsuarioServicio;
  let repositorio: UsuarioRepositorioMock;

  beforeEach(() => {
    repositorio = new UsuarioRepositorioMock();
    servicio = new UsuarioServicio(repositorio);
  });

  describe('cambiarEstadoUsuario - Casos de prueba (RED ? GREEN)', () => {
    it('debe desactivar un usuario activo', async () => {
      const resultado = await servicio.cambiarEstadoUsuario('1', false);
      expect(resultado.estaActivo).toBe(false);
    });

    it('debe activar un usuario inactivo', async () => {
      const resultado = await servicio.cambiarEstadoUsuario('2', true);
      expect(resultado.estaActivo).toBe(true);
    });

    it('debe lanzar error si el usuario no existe', async () => {
      await expect(servicio.cambiarEstadoUsuario('999', true)).rejects.toThrow(
        'Usuario con id 999 no encontrado',
      );
    });
  });
});
