import { randomUUID } from 'crypto';

import cors from 'cors';
import express, { type Application, type ErrorRequestHandler, type RequestHandler } from 'express';

import rolRutas from './rutas/rol.rutas.js';
import { ErrorNegocio } from './utilidades/errores.js';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'servicio-usuario' });
});

app.use('/api/v1/roles', rolRutas);

const notFoundHandler: RequestHandler = (_req, res): void => {
  res.status(404).json({ error: 'Ruta no encontrada', status: 404 });
};

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next): void => {
  if (err instanceof ErrorNegocio) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  const referencia = randomUUID();
  console.error('Error interno no controlado:', referencia, err);
  res.status(500).json({
    error: 'Error interno del servidor',
    referencia,
  });
};

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
