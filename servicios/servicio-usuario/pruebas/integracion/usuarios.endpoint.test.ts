import request from 'supertest';
import app from '../../src/app';

const cuerpoValido = {
  correo: 'admin@bebras.bo',
  contrasena: 'contrasenaSegura1',
  nombres: 'Ana',
  apellidos: 'Pérez',
  rol: 'administrador',
};

describe('POST /api/usuarios', () => {
  it('debería crear un usuario y devolver 201', async () => {
    const respuesta = await request(app)
      .post('/api/usuarios')
      .send({ ...cuerpoValido, correo: `nuevo-${Date.now()}@bebras.bo` })
      .expect(201);

    expect(respuesta.body.usuario).toBeDefined();
    expect(respuesta.body.usuario.id).toBeDefined();
    expect(respuesta.body.usuario).not.toHaveProperty('contrasenaHash');
  });

  it('debería devolver 400 cuando faltan campos obligatorios', async () => {
    const respuesta = await request(app).post('/api/usuarios').send({}).expect(400);

    expect(respuesta.body.errores).toBeDefined();
    expect(Array.isArray(respuesta.body.errores)).toBe(true);
  });

  it('debería devolver 400 cuando el rol no está en el ENUM', async () => {
    await request(app)
      .post('/api/usuarios')
      .send({ ...cuerpoValido, correo: 'rol@bebras.bo', rol: 'superadmin' })
      .expect(400);
  });
});
