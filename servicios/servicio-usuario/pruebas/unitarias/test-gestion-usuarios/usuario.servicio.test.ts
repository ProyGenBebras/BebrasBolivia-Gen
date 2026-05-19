import { ErrorNegocio, UsuarioServicio } from '../../../src/servicios/usuario.servicio';
import { UsuarioRepositorio } from '../../../src/repositorios/usuario.repositorio';
import { PrismaClient } from '@prisma/client';

jest.mock('../../../src/repositorios/usuario.repositorio');

describe('UsuarioServicio (Pruebas Unitarias)', () => {
  let usuarioServicio: UsuarioServicio;
  let usuarioRepositorioMock: jest.Mocked<UsuarioRepositorio>;

  beforeEach(() => {
    jest.clearAllMocks();
    const prismaFake = {} as PrismaClient;
    usuarioRepositorioMock = new UsuarioRepositorio(prismaFake) as jest.Mocked<UsuarioRepositorio>;
    usuarioServicio = new UsuarioServicio(usuarioRepositorioMock);
  });

  describe('cambiarEstado', () => {
    it('debería activar un usuario existente', async () => {
      const usuarioSimulado = {
        id: 1,
        nombre: 'Ana',
        apellidos: 'Lopez',
        email: 'ana@test.com',
        activo: true,
        createdAt: new Date(),
      };
      usuarioRepositorioMock.obtenerPorId.mockResolvedValue(usuarioSimulado);
      usuarioRepositorioMock.cambiarEstado.mockResolvedValue({ ...usuarioSimulado, activo: true });

      const resultado = await usuarioServicio.cambiarEstado(1, true);

      expect(resultado.activo).toBe(true);
      expect(usuarioRepositorioMock.cambiarEstado).toHaveBeenCalledWith(1, true);
    });

    it('debería desactivar un usuario existente', async () => {
      const usuarioSimulado = {
        id: 1,
        nombre: 'Ana',
        apellidos: 'Lopez',
        email: 'ana@test.com',
        activo: true,
        createdAt: new Date(),
      };
      usuarioRepositorioMock.obtenerPorId.mockResolvedValue(usuarioSimulado);
      usuarioRepositorioMock.cambiarEstado.mockResolvedValue({ ...usuarioSimulado, activo: false });

      const resultado = await usuarioServicio.cambiarEstado(1, false);

      expect(resultado.activo).toBe(false);
      expect(usuarioRepositorioMock.cambiarEstado).toHaveBeenCalledWith(1, false);
    });

    it('debería lanzar ErrorNegocio (404) si el usuario no existe', async () => {
      usuarioRepositorioMock.obtenerPorId.mockResolvedValue(null);

      await expect(usuarioServicio.cambiarEstado(999, true)).rejects.toThrow(ErrorNegocio);
      await expect(usuarioServicio.cambiarEstado(999, true)).rejects.toMatchObject({
        status: 404,
        message: 'Usuario con id 999 no encontrado',
      });
      expect(usuarioRepositorioMock.cambiarEstado).not.toHaveBeenCalled();
    });
  });
});
