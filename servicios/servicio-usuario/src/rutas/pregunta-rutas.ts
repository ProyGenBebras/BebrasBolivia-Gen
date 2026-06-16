import { Router } from 'express';

import { Accion } from '../compartido/permisos';
import { preguntaControlador } from '../controladores/pregunta-controlador';
import { autenticarJwt } from '../middlewares/autenticar-jwt';
import { verificarPermiso } from '../middlewares/autorizar';

const preguntaRutas: Router = Router();

/**
 * Rutas del módulo de preguntas (banco de preguntas).
 *
 * GET /     - Listar preguntas activas (requiere VER_PREGUNTA)
 * GET /:id  - Obtener una pregunta por id (requiere VER_PREGUNTA)
 */
preguntaRutas.get(
  '/',
  autenticarJwt,
  verificarPermiso(Accion.VER_PREGUNTA),
  (req, res, next) => {
    void preguntaControlador.listar(req, res, next);
  },
);

preguntaRutas.get(
  '/:id',
  autenticarJwt,
  verificarPermiso(Accion.VER_PREGUNTA),
  (req, res, next) => {
    void preguntaControlador.obtener(req, res, next);
  },
);

export default preguntaRutas;
