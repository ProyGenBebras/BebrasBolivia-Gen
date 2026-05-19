import app from '../../../src/app.js';
import request from 'supertest';


describe('API de Roles - /roles', () => {
    
    describe('POST /roles', () => {
        it('debería retornar 400 si falta el campo "nombre"', async () => {
            const respuesta = await request(app)
                .post('/api/v1/roles') 
                .send({ descripcion: 'Un rol sin nombre' });

            expect(respuesta.status).toBe(400);
            expect(respuesta.body).toHaveProperty('error', 'El campo nombre es requerido');
        });
    });

    describe('GET /roles/:id', () => {
        it('debería retornar 400 si el ID no es un número válido', async () => {
            const respuesta = await request(app)
                .get('/api/v1/roles/letras-invalidas');

            expect(respuesta.status).toBe(400);
            expect(respuesta.body).toHaveProperty('error', 'ID inválido');
        });
    });

    describe('PUT /roles/:id', () => {
        it('debería formatear correctamente el nombre (trim y toLowerCase)', async () => {
        });
    });
});