import { Router } from 'express';

import { usuarioControlador } from '../controladores/usuario-controlador';

/**
 * Rutas del modulo de usuarios.
 *
 * NOTA: la restriccion "solo administrador" (REQ-004 sub-tarea de permisos)
 * depende del middleware de autorizacion de REQ-009, que aun no existe.
 * Cuando exista, se montara aqui antes del controlador. Por ahora el
 * endpoint queda abierto a proposito (acordado con el equipo).
 */
const usuarioRutas: Router = Router();

usuarioRutas.post('/', (req, res, next) => {
  void usuarioControlador.crear(req, res, next);
});

export default usuarioRutas;
