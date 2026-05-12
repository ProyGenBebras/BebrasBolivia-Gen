import { PrismaClient } from '@prisma/client';
import { Router, type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { manejarErrorNegocioUsuario, UsuarioControlador } from '../controladores/usuario.controlador.js';
import { UsuarioRepositorio } from '../repositorios/usuario.repositorio.js';
import { UsuarioServicio } from '../servicios/usuario.servicio.js';

function asyncHandler(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        void fn(req, res, next);
    };
}

const prisma = new PrismaClient();
const usuarioRepositorio = new UsuarioRepositorio(prisma);
const usuarioServicio = new UsuarioServicio(usuarioRepositorio);
const usuarioControlador = new UsuarioControlador(usuarioServicio);

const router = Router();

router.patch('/:id/estado', asyncHandler(usuarioControlador.cambiarEstado));

router.use(manejarErrorNegocioUsuario);

export default router;
