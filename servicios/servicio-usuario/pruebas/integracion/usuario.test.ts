import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/db';
import { RolUsuario } from '@prisma/client';


// Borrar esto para que se conecte a la BD real
jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    estudiante: {
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    profesor: {
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));
// Hasta aquí hay que borrar o comentar

describe('Integración - API de Usuarios (Roles)', () => {
  beforeAll(() => {
    process.env.ROOT_ADMIN_EMAIL = 'admin.bolivia@bebras.org';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/usuarios/:id/rol', () => {
    it('debe devolver 200 y el rol del usuario', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@test.com',
        rol: RolUsuario.profesor,
      });

      const response = await request(app).get('/api/usuarios/user-123/rol');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 'user-123', email: 'test@test.com', rol: 'profesor' });
    });

    it('debe devolver 404 si el usuario no existe', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/usuarios/user-999/rol');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/usuarios/:id/rol', () => {
    it('debe cambiar de estudiante a profesor exitosamente y devolver 200', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@test.com',
        rol: RolUsuario.estudiante,
      });

      (prisma.estudiante.delete as jest.Mock).mockResolvedValue({});
      (prisma.profesor.upsert as jest.Mock).mockResolvedValue({});
      (prisma.usuario.update as jest.Mock).mockResolvedValue({ id: 'user-123', rol: RolUsuario.profesor });

      const response = await request(app)
        .patch('/api/usuarios/user-123/rol')
        .send({
          rol: 'profesor',
          datos_adicionales: {
            especialidad: 'Física',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.mensaje).toBe('Rol actualizado exitosamente');
      expect(response.body.usuario.rol).toBe('profesor');
    });

    it('debe devolver 403 si intentas cambiar el rol del admin root', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: 'root-admin',
        email: 'admin.bolivia@bebras.org',
        rol: RolUsuario.administrador,
      });

      const response = await request(app)
        .patch('/api/usuarios/root-admin/rol')
        .send({ rol: 'estudiante', datos_adicionales: { grado: 1, seccion: 'A' } });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('No se puede modificar el rol del administrador principal');
    });

    it('debe devolver 400 si faltan datos requeridos (ej. grado para estudiante)', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: 'test@test.com',
        rol: RolUsuario.coordinador,
      });

      const response = await request(app)
        .patch('/api/usuarios/user-123/rol')
        .send({ rol: 'estudiante' }); // Faltan datos_adicionales

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Faltan datos requeridos');
    });
  });
});
