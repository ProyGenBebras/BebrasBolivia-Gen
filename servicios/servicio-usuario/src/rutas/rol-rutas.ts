import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

import { manejarErrorNegocio, RolControlador } from '../controladores/rol-controlador';
import { autenticarJwt } from '../middlewares/autenticar-jwt';
import { verificarRol } from '../middlewares/autorizar';
import { RolRepositorio } from '../repositorios/rol-repositorio';
import { RolServicio } from '../servicios/rol-servicio';

const prisma = new PrismaClient();
const rolRepositorio = new RolRepositorio(prisma);
const rolServicio = new RolServicio(rolRepositorio);
const rolControlador = new RolControlador(rolServicio);

const rolRutas: Router = Router();

// GET /api/v1/roles — lista todos los valores del enum rol_usuario
rolRutas.get('/', rolControlador.listarRolesDisponibles);

// GET /api/v1/roles/:rol/usuarios — lista usuarios que tienen ese rol
rolRutas.get('/:rol/usuarios', autenticarJwt,verificarRol('administrador'), (req, res, next) => {
    void rolControlador.obtenerUsuariosPorRol(req, res, next);
});

// Middleware de manejo de errores de negocio especifico de este router
rolRutas.use(manejarErrorNegocio);

export default rolRutas;