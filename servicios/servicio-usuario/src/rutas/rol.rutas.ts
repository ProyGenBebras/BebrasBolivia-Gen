import { PrismaClient } from '@prisma/client';
import {
  Router,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from 'express';

import { manejarErrorNegocio, RolControlador } from '../controladores/rol.controlador.js';
import { RolRepositorio } from '../repositorios/rol.repositorio.js';
import { RolServicio } from '../servicios/rol.servicio.js';

/**
 * Envuelve un handler async para que Express no se queje del Promise<void>.
 * Resuelve @typescript-eslint/no-misused-promises en Router.get/post/put.
 */
function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next);
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