import { Router, type NextFunction, type Request, type Response } from 'express';

import { UsuarioControlador } from '../controladores/usuario.controlador.js';
import { CrearUsuarioSchema } from '../dtos/crear-usuario.dto.js';
import { validarCuerpo } from '../middlewares/validar-cuerpo.middleware.js';
import { verificarAdmin } from '../middlewares/verificar-admin.middleware.js';
import { usuarioRepositorio } from '../repositorios/usuario-repositorio.js';
import { UsuarioServicio } from '../servicios/usuario.servicio.js';

const usuarioServicio = new UsuarioServicio(usuarioRepositorio);
const usuarioControlador = new UsuarioControlador(usuarioServicio);

const usuarioRuta = Router();

usuarioRuta.post(
  '/',
  verificarAdmin,
  validarCuerpo(CrearUsuarioSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    void usuarioControlador.crear(req, res, next);
  },
);

export default usuarioRuta;