import { Request, Response } from 'express';
import { UsuarioController } from '../../../src/controladores/usuario.controller';
import { UsuarioService } from '../../../src/servicios/usuario.service';
import { RolUsuario } from '@prisma/client';

/*
TASK DEL REQ-008:
Task 1. Mostrar rol actual del usuario
Task 2. Permitir el cambio de rol
Task 3. Validar reglas (no quitar admin principal)
Task 4. Guardar cambios
Task 5. Confirmar actualización
*/

// Toto esto es la Task 5, prácticametne

jest.mock('../../../src/servicios/usuario.service');

describe('UsuarioController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerRol', () => {
    it('debe devolver 200 con el rol del usuario', async () => {
      mockReq.params = { id: 'user-1' };
      (UsuarioService.obtenerRolUsuario as jest.Mock).mockResolvedValue({ id: 'user-1', rol: RolUsuario.estudiante });

      await UsuarioController.obtenerRol(mockReq as Request, mockRes as Response);

      expect(UsuarioService.obtenerRolUsuario).toHaveBeenCalledWith('user-1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ id: 'user-1', rol: RolUsuario.estudiante });
    });

    it('debe devolver 404 si el usuario no existe', async () => {
      mockReq.params = { id: 'user-1' };
      (UsuarioService.obtenerRolUsuario as jest.Mock).mockRejectedValue(new Error('Usuario no encontrado'));

      await UsuarioController.obtenerRol(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
    });
  });

  describe('cambiarRol', () => {
    it('debe devolver 200 al cambiar exitosamente el rol', async () => {
      mockReq.params = { id: 'user-1' };
      mockReq.body = { rol: RolUsuario.profesor, datos_adicionales: { especialidad: 'Física' } };

      const mockResult = { id: 'user-1', rol: RolUsuario.profesor };
      (UsuarioService.cambiarRol as jest.Mock).mockResolvedValue(mockResult);

      await UsuarioController.cambiarRol(mockReq as Request, mockRes as Response);

      expect(UsuarioService.cambiarRol).toHaveBeenCalledWith('user-1', RolUsuario.profesor, { especialidad: 'Física' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        mensaje: 'Rol actualizado exitosamente',
        usuario: mockResult,
      });
    });

    it('debe devolver 400 si faltan datos obligatorios', async () => {
      mockReq.params = { id: 'user-1' };
      mockReq.body = { datos_adicionales: {} }; // Falta 'rol'

      await UsuarioController.cambiarRol(mockReq as Request, mockRes as Response);

      expect(UsuarioService.cambiarRol).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'El campo "rol" es requerido' });
    });

    it('debe devolver 403 si se intenta modificar al admin principal', async () => {
      mockReq.params = { id: 'root-admin' };
      mockReq.body = { rol: RolUsuario.estudiante };

      (UsuarioService.cambiarRol as jest.Mock).mockRejectedValue(new Error('No se puede modificar el rol del administrador principal'));

      await UsuarioController.cambiarRol(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No se puede modificar el rol del administrador principal' });
    });

    it('debe devolver 400 por otros errores de validación', async () => {
      mockReq.params = { id: 'user-1' };
      mockReq.body = { rol: RolUsuario.estudiante }; // Faltan datos adicionales

      (UsuarioService.cambiarRol as jest.Mock).mockRejectedValue(new Error('Faltan datos requeridos'));

      await UsuarioController.cambiarRol(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Faltan datos requeridos' });
    });
  });
});
