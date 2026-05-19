import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { manejarErrorNegocio, RolControlador } from 'src/controladores/rol-controlador.js';

import { RolRepositorio } from '../repositorios/rol-repositorio.js';
import { RolServicio } from '../servicios/rol-servicio.js';

const prisma = new PrismaClient();
const rolRepositorio = new RolRepositorio(prisma);
const rolServicio = new RolServicio(rolRepositorio);
const rolControlador = new RolControlador(rolServicio);

const router = Router();

// Esta ruta no es asíncrona, así que pasa directo sin problemas
router.get('/', rolControlador.listarRolesDisponibles);

// Envolvemos las rutas asíncronas con una función flecha y la palabra 'void'
router.get('/:rol/usuarios', (req, res, next) => {
    void rolControlador.obtenerUsuariosPorRol(req, res, next);
});

router.patch('/asignar', (req, res, next) => {
    void rolControlador.cambiarRol(req, res, next);
});

// Middleware de manejo de errores
router.use(manejarErrorNegocio);

export default router;