import request from 'supertest';

import app from '../../src/app';

describe('Infraestructura del servicio', () => {
  it('debe responder en ruta /health', async () => {
    const res = await request(app).get('/health').expect(200);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'servicio-usuario');
  });

  it('debe retornar 404 en ruta inexistente', async () => {
    await request(app).get('/ruta-que-no-existe').expect(404);
  });
});

describe('REQ-007 Asignar roles', () => {
  it('debe asignar un nuevo rol cuando el solicitante es admin', async () => {
    const respuesta = await request(app)
      .patch('/usuarios/est-1/rol')
      .set('x-usuario-id', 'admin-1')
      .send({ rol: 'profesor' })
      .expect(200);

    expect(respuesta.body).toEqual({
      mensaje: 'Rol asignado correctamente',
      data: {
        id: 'est-1',
        nombre: 'Estudiante Demo',
        rol: 'profesor',
      },
    });
  });

  it('debe rechazar la asignacion cuando no hay permisos de administrador', async () => {
    const respuesta = await request(app)
      .patch('/usuarios/prof-1/rol')
      .set('x-usuario-id', 'est-1')
      .send({ rol: 'admin' })
      .expect(403);

    expect(respuesta.body).toHaveProperty('error', 'Permisos insuficientes para asignar roles');
  });

  it('debe validar que el rol solicitado exista', async () => {
    const respuesta = await request(app)
      .patch('/usuarios/prof-1/rol')
      .set('x-usuario-id', 'admin-1')
      .send({ rol: 'visitante' })
      .expect(400);

    expect(respuesta.body).toHaveProperty('error', 'Rol no valido');
  });
});
