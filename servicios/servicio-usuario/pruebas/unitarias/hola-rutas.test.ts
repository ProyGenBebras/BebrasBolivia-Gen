import request from 'supertest';

import app from '../../src/app';

describe('Ruta de demostración CI/CD - GET /api/v1/hola', () => {
  it('debería responder 200 con el mensaje "Hola Mundo"', async () => {
    const respuesta = await request(app).get('/api/v1/hola').expect(200);
    expect(respuesta.body).toEqual({ mensaje: 'Hola Mundo' });
  });
});
