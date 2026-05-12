import { UsuarioServicio } from '../../src/servicios/usuario.servicio';
import { Usuario } from '../../src/modelos/usuario.modelo.js';
import type { IUsuarioRepositorio } from '../../src/repositorios/usuario.repositorio.js';
import { ErrorNegocio } from '../../src/utilidades/errores';

const crearRepositorioMock = (
  sobreescribir?: Partial<IUsuarioRepositorio>,
): IUsuarioRepositorio => ({
  buscarPorId: jest.fn(),
  eliminar: jest.fn(),
  ...sobreescribir,
});

const usuarioAdminMock: Usuario = {
  id: 'uuid-admin-123',
  correo: 'admin@bebras.bo',
  nombres: 'Admin',
  apellidos: 'Test',
  rol: 'administrador',
  activo: true,
  verificado: true,
  creadoEn: new Date(),
  actualizadoEn: new Date(),
};

const usuarioObjetivoMock: Usuario = {
  id: 'uuid-usuario-456',
  correo: 'estudiante@bebras.bo',
  nombres: 'Estudiante',
  apellidos: 'Test',
  rol: 'estudiante',
  activo: true,
  verificado: true,
  creadoEn: new Date(),
  actualizadoEn: new Date(),
};

describe('UsuarioServicio', () => {
  describe('eliminarUsuario', () => {
    it('eliminar logicamente un usaurio cuando el solicitante es administrador', async () => {
      const usuarioEliminadoMock = { ...usuarioObjetivoMock, activo: false };
      const repositorioMock = crearRepositorioMock({
        buscarPorId: jest
          .fn()
          .mockResolvedValueOnce(usuarioAdminMock)
          .mockResolvedValueOnce(usuarioObjetivoMock),
        eliminar: jest.fn().mockResolvedValue(usuarioEliminadoMock),
      });
      const servicio = new UsuarioServicio(repositorioMock);

      const resultado = await servicio.eliminarUsuario(usuarioObjetivoMock.id, usuarioAdminMock.id);

      expect(resultado.activo).toBe(false);
      expect(repositorioMock.eliminar).toHaveBeenCalledWith(usuarioObjetivoMock.id);
    });

    it('lanza errorNegocio 403 cuando el solicitante no es administrador', async () => {
      const solicitanteNoAdmin = { ...usuarioAdminMock, rol: 'profesor' as const };
      const repositorioMock = crearRepositorioMock({
        buscarPorId: jest.fn().mockResolvedValue(solicitanteNoAdmin),
      });
      const servicio = new UsuarioServicio(repositorioMock);

      await expect(
        servicio.eliminarUsuario(usuarioObjetivoMock.id, solicitanteNoAdmin.id),
      ).rejects.toThrow(new ErrorNegocio('No tiene permisos para eliminar usuarios', 403));
    });

    it('lanza erroNegocio 404 cuando el usuario a eliminar no existe', async () => {
      const repositorioMock = crearRepositorioMock({
        buscarPorId: jest.fn().mockResolvedValueOnce(usuarioAdminMock).mockResolvedValueOnce(null),
      });
      const servicio = new UsuarioServicio(repositorioMock);

      await expect(
        servicio.eliminarUsuario('uuid-inexistente', usuarioAdminMock.id),
      ).rejects.toThrow(new ErrorNegocio('Usuario no encontrado', 404));
    });

    it('lanza errorNegocio 400 cuando el usuario ya estaba eliminado', async () => {
      const usuarioYaEliminado = { ...usuarioObjetivoMock, activo: false };
      const repositorioMock = crearRepositorioMock({
        buscarPorId: jest
          .fn()
          .mockResolvedValueOnce(usuarioAdminMock)
          .mockResolvedValueOnce(usuarioYaEliminado),
      });
      const servicio = new UsuarioServicio(repositorioMock);

      await expect(
        servicio.eliminarUsuario(usuarioObjetivoMock.id, usuarioAdminMock.id),
      ).rejects.toThrow(new ErrorNegocio('El usuario ya fue eliminado', 400));
    });
  });
});
