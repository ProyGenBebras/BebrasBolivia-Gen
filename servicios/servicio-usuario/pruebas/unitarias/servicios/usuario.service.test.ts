import { RolUsuario } from '@prisma/client';
import prisma from '../../../src/config/db';
import { UsuarioService } from '../../../src/servicios/usuario.service';

/*
TASK DEL REQ-008:
Task 1. Mostrar rol actual del usuario
Task 2. Permitir el cambio de rol
Task 3. Validar reglas (no quitar admin principal)
Task 4. Guardar cambios
Task 5. Confirmar actualización
*/

// Mockear prisma
jest.mock('../../../src/config/db', () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({}),
    },
    estudiante: {
      delete: jest.fn().mockResolvedValue({}),
      upsert: jest.fn().mockResolvedValue({}),
    },
    profesor: {
      delete: jest.fn().mockResolvedValue({}),
      upsert: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

describe('UsuarioService - Modificar Roles (REQ-008)', () => {
  const rootAdminEmail = 'admin.bolivia@bebras.org'; // O lo que sea, es para simular el correo del admin nomás

  beforeAll(() => {
    process.env.ROOT_ADMIN_EMAIL = rootAdminEmail;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TASK 1 ----- Mostrar rol actual del usuario

  describe('Task 1: Mostrar rol actual del usuario', () => {
    it('debe devolver el usuario con su rol actual', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@bebras.org',
        rol: RolUsuario.estudiante,
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await UsuarioService.obtenerRolUsuario('user-1');

      expect(prisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { id: true, email: true, rol: true },
      });
      expect(result).toEqual({ id: 'user-1', email: 'test@bebras.org', rol: 'estudiante' });
    });

    it('debe lanzar error si el usuario no existe', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(UsuarioService.obtenerRolUsuario('no-existe')).rejects.toThrow('Usuario no encontrado');
    });
  });

  // TASK 2 y 4 ----- Permitir el cambio de rol ; Guardar cambios

  describe('Task 2 y 4: Permitir cambio de rol y guardar cambios', () => {
    it('debe permitir cambiar de coordinador a administrador sin modificar extensiones', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'coord@bebras.org',
        rol: RolUsuario.coordinador,
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.usuario.update as jest.Mock).mockResolvedValue({ ...mockUser, rol: RolUsuario.administrador });

      const result = await UsuarioService.cambiarRol('user-1', RolUsuario.administrador, {});

      expect(prisma.usuario.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { rol: RolUsuario.administrador },
      });
      expect(result.rol).toBe(RolUsuario.administrador);
    });

    it('debe cambiar de estudiante a profesor (borrar estudiante, crear/actualizar profesor)', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'estudiante@bebras.org',
        rol: RolUsuario.estudiante,
      };

      const datosAdicionales = {
        especialidad: 'Matemáticas',
        institucion_id: 'inst-1',
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.usuario.update as jest.Mock).mockResolvedValue({ ...mockUser, rol: RolUsuario.profesor });

      await UsuarioService.cambiarRol('user-1', RolUsuario.profesor, datosAdicionales);

      expect(prisma.$transaction).toHaveBeenCalled();

      // Debe borrar el registro en estudiante
      expect(prisma.estudiante.delete).toHaveBeenCalledWith({
        where: { usuarioId: 'user-1' },
      });

      // Debe crear/actualizar el registro en profesor
      expect(prisma.profesor.upsert).toHaveBeenCalledWith({
        where: { usuarioId: 'user-1' },
        update: {
          especialidad: datosAdicionales.especialidad,
          institucionId: datosAdicionales.institucion_id,
        },
        create: {
          usuarioId: 'user-1',
          especialidad: datosAdicionales.especialidad,
          institucionId: datosAdicionales.institucion_id,
        },
      });

      expect(prisma.usuario.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { rol: RolUsuario.profesor },
      });
    });

    it('debe cambiar de profesor a estudiante (borrar profesor, crear/actualizar estudiante)', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'profesor@bebras.org',
        rol: RolUsuario.profesor,
      };

      const datosAdicionales = {
        grado: 5,
        seccion: 'B',
        institucion_id: 'inst-1',
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.usuario.update as jest.Mock).mockResolvedValue({ ...mockUser, rol: RolUsuario.estudiante });

      await UsuarioService.cambiarRol('user-1', RolUsuario.estudiante, datosAdicionales);

      expect(prisma.profesor.delete).toHaveBeenCalledWith({
        where: { usuarioId: 'user-1' },
      });

      expect(prisma.estudiante.upsert).toHaveBeenCalledWith({
        where: { usuarioId: 'user-1' },
        update: {
          grado: datosAdicionales.grado,
          seccion: datosAdicionales.seccion,
          institucionId: datosAdicionales.institucion_id,
        },
        create: {
          usuarioId: 'user-1',
          grado: datosAdicionales.grado,
          seccion: datosAdicionales.seccion,
          institucionId: datosAdicionales.institucion_id,
        },
      });
    });

    it('debe lanzar error si faltan datos adicionales al cambiar a estudiante', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'coord@bebras.org',
        rol: RolUsuario.coordinador,
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(UsuarioService.cambiarRol('user-1', RolUsuario.estudiante, { grado: 5 }))
        .rejects.toThrow('Faltan datos requeridos para el rol de estudiante (grado, seccion)');
    });
  });

  // TASK 3 ----- Validar reglas (no quitar admin principal)

  describe('Task 3: Validar reglas (no quitar admin principal)', () => {
    it('debe lanzar un error si se intenta cambiar el rol del root admin', async () => {
      const mockUser = {
        id: 'root-admin',
        email: rootAdminEmail,
        rol: RolUsuario.administrador,
      };

      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(UsuarioService.cambiarRol('root-admin', RolUsuario.coordinador, {}))
        .rejects.toThrow('No se puede modificar el rol del administrador principal');
    });
  });
});
