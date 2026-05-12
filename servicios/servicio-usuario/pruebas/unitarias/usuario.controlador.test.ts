import type { Request, Response } from 'express';
import { UsuarioControlador } from '../../src/controladores/usuario.controlador.js';
import { ErrorNegocio } from '../../src/utilidades/errores.js';
import type { IUsuarioServicio } from '../../src/servicios/usuario.servicio.js';

const crearServicioMock = (sobreescribir?: Partial<IUsuarioServicio>): IUsuarioServicio => ({
  eliminarUsuario: jest.fn(),
  ...sobreescribir,
});

const crearResMock = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('UsuarioControlador', () => {
  describe('eliminarUsuario', () => {
    it('debe responder 200 cuando el usuario es eliminado correctamente', async () => {
      // Arrange
      const servicioMock = crearServicioMock({
        eliminarUsuario: jest.fn().mockResolvedValue({ id: 'uuid-usuario-456', activo: false }),
      });
      const req = {
        params: { id: 'uuid-usuario-456' },
        headers: { 'x-usuario-id': 'uuid-admin-123' },
      } as unknown as Request;
      const res = crearResMock() as Response;
      const controlador = new UsuarioControlador(servicioMock);

      await controlador.eliminarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Usuario eliminado correctamente',
      });
    });

    it('debe responder 403 cuando el servicio lanza ErrorNegocio de permisos', async () => {
      const servicioMock = crearServicioMock({
        eliminarUsuario: jest
          .fn()
          .mockRejectedValue(new ErrorNegocio('No tiene permisos para eliminar usuarios', 403)),
      });
      const req = {
        params: { id: 'uuid-usuario-456' },
        headers: { 'x-usuario-id': 'uuid-no-admin' },
      } as unknown as Request;
      const res = crearResMock() as Response;
      const controlador = new UsuarioControlador(servicioMock);

      await controlador.eliminarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'No tiene permisos para eliminar usuarios',
      });
    });

    it('debe responder 404 cuando el servicio lanza ErrorNegocio de no encontrado', async () => {
      const servicioMock = crearServicioMock({
        eliminarUsuario: jest
          .fn()
          .mockRejectedValue(new ErrorNegocio('Usuario no encontrado', 404)),
      });
      const req = {
        params: { id: 'uuid-inexistente' },
        headers: { 'x-usuario-id': 'uuid-admin-123' },
      } as unknown as Request;
      const res = crearResMock() as Response;
      const controlador = new UsuarioControlador(servicioMock);

      await controlador.eliminarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Usuario no encontrado',
      });
    });

    it('debe responder 500 cuando ocurre un error inesperado', async () => {
      const servicioMock = crearServicioMock({
        eliminarUsuario: jest.fn().mockRejectedValue(new Error('Error de base de datos')),
      });
      const req = {
        params: { id: 'uuid-usuario-456' },
        headers: { 'x-usuario-id': 'uuid-admin-123' },
      } as unknown as Request;
      const res = crearResMock() as Response;
      const controlador = new UsuarioControlador(servicioMock);

      await controlador.eliminarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Error interno del servidor',
      });
    });

    it('debe responder 400 cuando falta el header x-usuario-id', async () => {
      const servicioMock = crearServicioMock();
      const req = {
        params: { id: 'uuid-usuario-456' },
        headers: {},
      } as unknown as Request;
      const res = crearResMock() as Response;
      const controlador = new UsuarioControlador(servicioMock);

      await controlador.eliminarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Falta el identificador del solicitante',
      });
    });
  });
});
