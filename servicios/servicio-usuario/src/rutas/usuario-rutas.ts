import { Router } from 'express';
import multer from 'multer';

import { CargaMasivaControlador }
from '../controladores/carga-masiva.controlador';
import { usuarioControlador }
from '../controladores/usuario-controlador';
import {
  verificarPermiso,
  verificarRol,
}
from '../middlewares/autorizar';
import { resolverIdentidad }
from '../middlewares/resolver-identidad';
import { Accion }
from '../shared/permisos';

const usuarioRutas: Router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const cargaMasivaControlador =
  new CargaMasivaControlador();

/**
 * Rutas del modulo de usuarios.
 *
 * NOTA: la restriccion "solo administrador"
 * depende del middleware de autorizacion.
 */

/*
|--------------------------------------------------------------------------
| CREAR USUARIO
|--------------------------------------------------------------------------
*/

usuarioRutas.post(
  '/',
  resolverIdentidad,
  verificarPermiso(
    Accion.CREAR_USUARIO,
  ),

  (req, res, next) => {

    void usuarioControlador.crear(
      req,
      res,
      next,
    );

  },
);

/*
|--------------------------------------------------------------------------
| ELIMINAR USUARIO
|--------------------------------------------------------------------------
*/

usuarioRutas.delete(
  '/:id',

  resolverIdentidad,

  verificarRol(
    'administrador',
  ),

  (req, res, next) => {

    void usuarioControlador.eliminar(
      req,
      res,
      next,
    );

  },
);

/*
|--------------------------------------------------------------------------
| OBTENER ROL
|--------------------------------------------------------------------------
*/

usuarioRutas.get(
  '/:id/rol',

  resolverIdentidad,

  verificarRol(
    'administrador',
  ),

  (req, res, next) => {

    void usuarioControlador
      .obtenerRolUsuario(
        req,
        res,
        next,
      );

  },
);

/*
|--------------------------------------------------------------------------
| MODIFICAR ROL
|--------------------------------------------------------------------------
*/

usuarioRutas.patch(
  '/:id/rol',

  resolverIdentidad,

  verificarRol(
    'administrador',
  ),

  (req, res, next) => {

    void usuarioControlador
      .modificarRolUsuario(
        req,
        res,
        next,
      );

  },
);

/*
|--------------------------------------------------------------------------
| CARGA MASIVA
|--------------------------------------------------------------------------
*/

usuarioRutas.post(
  '/carga-masiva',

  upload.single('file'),

  (req, res) => {

    void cargaMasivaControlador
      .cargar(
        req,
        res,
      );

  },
);

/*
|--------------------------------------------------------------------------
| OBTENER USUARIO
|--------------------------------------------------------------------------
*/

usuarioRutas.get(
  '/:id',

  resolverIdentidad,

  verificarRol(
    'administrador',
  ),

  (req, res, next) => {
    void usuarioControlador.obtener(
      req,
      res,
      next,
    );
  },
);

/*
|--------------------------------------------------------------------------
| ACTUALIZAR PERFIL DE USUARIO
|--------------------------------------------------------------------------
*/

usuarioRutas.patch(
  '/:id',

  resolverIdentidad,

  verificarRol(
    'administrador',
  ),

  (req, res, next) => {
    void usuarioControlador.actualizar(
      req,
      res,
      next,
    );
  },
);

export default usuarioRutas;