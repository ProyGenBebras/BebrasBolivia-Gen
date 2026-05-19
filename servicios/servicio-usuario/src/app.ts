import cors from 'cors';
import express, { type Application, type ErrorRequestHandler, type RequestHandler } from 'express';

import rolRutas from './rutas/rol.rutas.js';
import usuarioRutas from './rutas/usuario.rutas.js';

interface ErrorNegocio extends Error {
  status?: number;
}

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'servicio-usuario' });
});

app.use('/api/v1/roles', rolRutas);

app.use('/api/v1/usuarios', usuarioRutas);

const notFoundHandler: RequestHandler = (_req, res): void => {
  res.status(404).json({ error: 'Ruta no encontrada', status: 404 });
};

const errorHandler: ErrorRequestHandler = (err: ErrorNegocio, _req, res, _next): void => {
  console.error('Error:', err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Error interno del servidor';
  res.status(status).json({ error: message, status });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
