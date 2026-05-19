import { crearUsuarioServicio } from '../../src/servicios/usuario-servicio';
import { ErrorNegocio } from '../../src/utilidades/errores';

import type { CrearUsuarioDto } from '../../src/dtos/crear-usuario.dto';

const dto: CrearUsuarioDto = {
  correo: 'nuevo@bebras.com',
  nombres: 'Carlos',
  apellidos: 'Vargas',
  contrasena: 'claveSegura1',
  rol: 'profesor',
};

describe('UsuarioServicio', () => {
  describe('crear', () => {
    it('deberia crear el usuario cuando el correo no esta registrado', async () => {
      const buscarPorCorreo = jest.fn().mockResolvedValue(null);
      const crear = jest.fn().mockResolvedValue({ id: 'u1', correo: dto.correo });
      const hashear = jest.fn().mockResolvedValue('hash-fake');
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorCorreo, crear } as never,
        hasheador: { hashear },
      });

      const resultado = await servicio.crear(dto);

      expect(buscarPorCorreo).toHaveBeenCalledWith(dto.correo);
      expect(hashear).toHaveBeenCalledWith(dto.contrasena);
      expect(crear).toHaveBeenCalledWith(
        expect.objectContaining({ correo: dto.correo, contrasena_hash: 'hash-fake' }),
      );
      expect(resultado).toEqual({ id: 'u1', correo: dto.correo });
    });

    it('deberia lanzar ErrorNegocio cuando el correo ya esta registrado', async () => {
      const buscarPorCorreo = jest.fn().mockResolvedValue({ id: 'existente' });
      const crear = jest.fn();
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorCorreo, crear } as never,
        hasheador: { hashear: jest.fn() },
      });

      await expect(servicio.crear(dto)).rejects.toThrow(ErrorNegocio);
      expect(crear).not.toHaveBeenCalled();
    });

    it('deberia propagar el error si el hasheo no esta implementado', async () => {
      const servicio = crearUsuarioServicio({
        repositorio: {
          buscarPorCorreo: jest.fn().mockResolvedValue(null),
          crear: jest.fn(),
        } as never,
      });

      await expect(servicio.crear(dto)).rejects.toThrow(ErrorNegocio);
    });
  });

  describe('eliminarUsuario', () => {
    const adminMock = {
      id: 'uuid-admin-123',
      rol: 'administrador' as const,
      esta_activo: true,
    };

    const usuarioObjetivoMock = {
      id: 'uuid-usuario-456',
      rol: 'estudiante' as const,
      esta_activo: true,
    };

    it('deberia eliminar logicamente un usuario cuando el solicitante es administrador', async () => {
      const buscarPorId = jest
        .fn()
        .mockResolvedValueOnce(adminMock)
        .mockResolvedValueOnce(usuarioObjetivoMock);
      const eliminar = jest.fn().mockResolvedValue({ ...usuarioObjetivoMock, esta_activo: false });
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorId, eliminar } as never,
        hasheador: { hashear: jest.fn() },
      });

      const resultado = await servicio.eliminarUsuario(usuarioObjetivoMock.id, adminMock.id);

      expect(resultado.esta_activo).toBe(false);
      expect(eliminar).toHaveBeenCalledWith(usuarioObjetivoMock.id);
    });

    it('deberia lanzar ErrorNegocio 403 cuando el solicitante no es administrador', async () => {
      const buscarPorId = jest.fn().mockResolvedValue({ ...adminMock, rol: 'profesor' });
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorId } as never,
        hasheador: { hashear: jest.fn() },
      });

      await expect(servicio.eliminarUsuario(usuarioObjetivoMock.id, adminMock.id)).rejects.toThrow(
        new ErrorNegocio('No tiene permisos para eliminar usuarios', 403),
      );
    });

    it('deberia lanzar ErrorNegocio 404 cuando el usuario a eliminar no existe', async () => {
      const buscarPorId = jest.fn().mockResolvedValueOnce(adminMock).mockResolvedValueOnce(null);
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorId } as never,
        hasheador: { hashear: jest.fn() },
      });

      await expect(servicio.eliminarUsuario('uuid-inexistente', adminMock.id)).rejects.toThrow(
        new ErrorNegocio('Usuario no encontrado', 404),
      );
    });

    it('deberia lanzar ErrorNegocio 400 cuando el usuario ya estaba eliminado', async () => {
      const usuarioYaEliminado = { ...usuarioObjetivoMock, esta_activo: false };
      const buscarPorId = jest
        .fn()
        .mockResolvedValueOnce(adminMock)
        .mockResolvedValueOnce(usuarioYaEliminado);
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorId } as never,
        hasheador: { hashear: jest.fn() },
      });

      await expect(servicio.eliminarUsuario(usuarioObjetivoMock.id, adminMock.id)).rejects.toThrow(
        new ErrorNegocio('El usuario ya fue eliminado', 400),
      );
    });
  });
});
