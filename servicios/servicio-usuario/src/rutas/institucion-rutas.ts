import { Router } from 'express';

import { Accion } from '../compartido/permisos';
import { institucionControlador } from '../controladores/institucion-controlador';
import { autenticarJwt } from '../middlewares/autenticar-jwt';
import { verificarPermiso } from '../middlewares/autorizar';

const institucionRutas: Router = Router();

/**
 * Rutas del módulo de instituciones.
 *
 * GET /:id - Obtener una institución por id (requiere VER_INSTITUCION)
 */
institucionRutas.get(
  '/:id',
  autenticarJwt,
  verificarPermiso(Accion.VER_INSTITUCION),
  (req, res, next) => {
    void institucionControlador.obtener(req, res, next);
  },
);

export default institucionRutas;
