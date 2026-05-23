import { Router } from 'express';

import { usuarioControlador } from '../controladores/usuario-controlador';
import { verificarPermiso, verificarRol } from '../middlewares/autorizar';
import { resolverIdentidad } from '../middlewares/resolver-identidad';
import { Accion } from '../shared/permisos';

/**
 * Rutas del modulo de usuarios.
 *
 * NOTA: la restriccion "solo administrador" (REQ-004 sub-tarea de permisos)
 * depende del middleware de autorizacion de REQ-009, que aun no existe.
 * Cuando exista, se montara aqui antes del controlador. Por ahora el
 * endpoint queda abierto a proposito (acordado con el equipo).
 */
const usuarioRutas: Router = Router();

usuarioRutas.post(
  '/',
  resolverIdentidad,
  verificarPermiso(Accion.CREAR_USUARIO),
  (req, res, next) => {
    void usuarioControlador.crear(req, res, next);
  },
);

usuarioRutas.delete(
  '/:id',
  resolverIdentidad,
  verificarRol('administrador'),
  (req, res, next) => {
    void usuarioControlador.eliminar(req, res, next);
  },
);

export default usuarioRutas;
