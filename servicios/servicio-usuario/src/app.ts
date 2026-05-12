/**
 * Configuración base de la aplicación Express
 * Inicialización minimalista de middleware y rutas
 */

import express, { type Application, type ErrorRequestHandler, type RequestHandler } from 'express';

import { type Usuario } from './dominio/usuario';
import { UsuarioRepositorio } from './repositorios/usuario-repositorio';
import { RolServicio } from './servicios/rol-servicio';

interface ErrorNegocio extends Error {
  status?: number;
}

const app: Application = express();
const usuarioRepositorio = new UsuarioRepositorio([
  { id: 'admin-1', nombre: 'Administrador Principal', rol: 'admin' },
  { id: 'est-1', nombre: 'Estudiante Demo', rol: 'estudiante' },
  { id: 'prof-1', nombre: 'Profesor Demo', rol: 'profesor' },
]);
const rolServicio = new RolServicio(usuarioRepositorio);

const obtenerUsuarioSolicitante = (idUsuarioSolicitante: unknown): Usuario | null => {
  if (typeof idUsuarioSolicitante !== 'string' || idUsuarioSolicitante.trim() === '') {
    return null;
  }

  return usuarioRepositorio.obtenerPorId(idUsuarioSolicitante);
};

const notFoundHandler: RequestHandler = (_req, res): void => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    status: 404,
  });
};

const errorHandler: ErrorRequestHandler = (err: ErrorNegocio, _req, res, _next): void => {
  console.error('Error:', err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Error interno del servidor';

  res.status(status).json({
    error: message,
    status,
  });
};

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas (placeholder)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'servicio-usuario' });
});

app.get('/roles', (_req, res) => {
  res.status(200).json({
    mensaje: 'Roles disponibles obtenidos correctamente',
    data: rolServicio.obtenerRolesDisponibles(),
  });
});

app.patch('/usuarios/:idUsuario/rol', (req, res, next) => {
  try {
    const usuarioSolicitante = obtenerUsuarioSolicitante(req.header('x-usuario-id'));
    const usuarioActualizado = rolServicio.asignarRol(
      req.params.idUsuario,
      req.body?.rol,
      usuarioSolicitante,
    );

    res.status(200).json({
      mensaje: 'Rol asignado correctamente',
      data: usuarioActualizado,
    });
  } catch (error) {
    next(error);
  }
});

// Manejo de rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware de error básico
app.use(errorHandler);

export default app;
