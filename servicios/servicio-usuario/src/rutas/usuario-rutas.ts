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

// POST /api/v1/usuarios — crear usuario
usuarioRutas.post(
  '/',
  resolverIdentidad,
  verificarPermiso(Accion.CREAR_USUARIO),
  (req, res, next) => {
    void usuarioControlador.crear(req, res, next);
  },
);

// DELETE /api/v1/usuarios/:id — eliminar usuario (logico)
usuarioRutas.delete(
  '/:id',
  resolverIdentidad,
  verificarRol('administrador'),
  (req, res, next) => {
    void usuarioControlador.eliminar(req, res, next);
  },
);

// GET /api/v1/usuarios/:id/rol — obtener rol actual del usuario (REQ-08)
usuarioRutas.get(
  '/:id/rol',
  resolverIdentidad,
  verificarRol('administrador'),
  (req, res, next) => {
    void usuarioControlador.obtenerRolUsuario(req, res, next);
  },
);

// PATCH /api/v1/usuarios/:id/rol — cambiar rol con validaciones completas (REQ-08)
usuarioRutas.patch(
  '/:id/rol',
  resolverIdentidad,
  verificarRol('administrador'),
  (req, res, next) => {
    void usuarioControlador.modificarRolUsuario(req, res, next);
  },
);

export default usuarioRutas;
