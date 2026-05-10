/**
 * Configuración base de la aplicación Express
 * Inicialización minimalista de middleware y rutas
 */

import cors from 'cors';
import express, { type Application, type ErrorRequestHandler, type RequestHandler } from 'express';

import usuarioRuta from './rutas/usuario.ruta.js';
import { ErrorNegocio, ErrorValidacion } from './utilidades/errores.js';

const app: Application = express();

// Orígenes permitidos para llamadas cross-origin (frontend Next.js).
// En producción se debe restringir vía variable de entorno.
const origenesPermitidos = (process.env.CORS_ORIGENES ?? 'http://localhost:3000')
  .split(',')
  .map((origen) => origen.trim());

app.use(
  cors({
    origin: origenesPermitidos,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

const notFoundHandler: RequestHandler = (_req, res): void => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    status: 404,
  });
};

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next): void => {
  if (err instanceof ErrorValidacion) {
    res.status(err.codigo).json({ mensaje: err.mensaje, errores: err.errores });
    return;
  }
  if (err instanceof ErrorNegocio) {
    res.status(err.codigo).json({ mensaje: err.mensaje });
    return;
  }
  console.error('Error interno no controlado:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas (placeholder)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'servicio-usuario' });
});

// Rutas del dominio
app.use('/api/usuarios', usuarioRuta);

// Manejo de rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware de error básico
app.use(errorHandler);

export default app;
