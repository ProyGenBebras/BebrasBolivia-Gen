import { PrismaClient } from '@prisma/client';
import { Router, type Request, type Response, type NextFunction } from 'express';

import { manejarErrorNegocio, RolControlador } from '../controladores/rol.controlador.js';
import { RolRepositorio } from '../repositorios/rol.repositorio.js';
import { RolServicio } from '../servicios/rol.servicio.js';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

const prisma = new PrismaClient();
const rolRepositorio = new RolRepositorio(prisma);
const rolServicio = new RolServicio(rolRepositorio);
const rolControlador = new RolControlador(rolServicio);
const router = Router();

router.get('/', asyncHandler(rolControlador.listar));
router.post('/', asyncHandler(rolControlador.crear));
router.post('/asignar', asyncHandler(rolControlador.asignarRol));
router.get('/:id', asyncHandler(rolControlador.obtenerPorId));
router.get('/:id/usuarios', asyncHandler(rolControlador.obtenerUsuarios));
router.put('/:id', asyncHandler(rolControlador.actualizar));
router.use(manejarErrorNegocio);

export default router;
