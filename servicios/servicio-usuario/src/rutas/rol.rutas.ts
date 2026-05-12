import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { manejarErrorNegocio, RolControlador } from '../controladores/rol.controlador.js';
import { RolRepositorio } from '../repositorios/rol.repositorio.js';
import { RolServicio } from '../servicios/rol.servicio.js';

const prisma = new PrismaClient();
const rolRepositorio = new RolRepositorio(prisma);
const rolServicio = new RolServicio(rolRepositorio);
const rolControlador = new RolControlador(rolServicio);

const router = Router();

router.get('/', rolControlador.listar);
router.post('/', rolControlador.crear);
router.post('/asignar', rolControlador.asignarRol);
router.get('/:id', rolControlador.obtenerPorId);
router.get('/:id/usuarios', rolControlador.obtenerUsuarios);
router.put('/:id', rolControlador.actualizar);

router.use(manejarErrorNegocio);

export default router;