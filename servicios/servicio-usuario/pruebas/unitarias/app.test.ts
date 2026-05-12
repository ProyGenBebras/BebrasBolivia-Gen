import request from 'supertest';

import app from '../../src/app';

describe('Infraestructura - Aplicacion Express (Usuario)', () => {
  describe('Configuracion base de la aplicacion', () => {
    it('deberia crear una instancia de aplicacion Express valida', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('deberia responder con 404 para rutas no definidas', async () => {
      await request(app).get('/ruta-inexistente').expect(404);
    });

    it('deberia listar roles disponibles para el selector de interfaz', async () => {
      const respuesta = await request(app).get('/roles').expect(200);

      expect(respuesta.body).toEqual({
        mensaje: 'Roles disponibles obtenidos correctamente',
        data: ['estudiante', 'profesor', 'admin'],
      });
    });
  });
});
