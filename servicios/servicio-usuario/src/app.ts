/**
 * Configuración de la aplicación Express (sin escuchar el puerto).
 * Es la ÚNICA app del servicio: la usan tanto server.ts (producción) como los tests.
 */

import cors from 'cors';
import express, { type Application } from 'express';

import {
  manejadorErrorHttp,
  manejadorRutaNoEncontrada,
} from './compartido/infraestructura/http/manejador-error-http';
import rutasAuth from './rutas/auth-rutas';
import rutasHola from './rutas/hola-rutas';
import rutasInstitucion from './rutas/institucion-rutas';
import rutasPregunta from './rutas/pregunta-rutas';
import rutasRol from './rutas/rol-rutas';
import rutasUsuario from './rutas/usuario-rutas';

const app: Application = express();

// CORS: permite el origen del frontend
app.use(
  cors({
    origin: process.env.URL_CLIENTE ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// Parsers de body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck (usado por Docker / orquestadores)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'servicio-usuario' });
});

// Rutas del API
app.use('/api/v1/auth', rutasAuth);
app.use('/api/v1/hola', rutasHola);
app.use('/api/v1/roles', rutasRol);
app.use('/api/v1/usuarios', rutasUsuario);
app.use('/api/v1/instituciones', rutasInstitucion);
app.use('/api/v1/preguntas', rutasPregunta);

// Ruta no encontrada (404) y manejo centralizado de errores: siempre al final
app.use(manejadorRutaNoEncontrada);
app.use(manejadorErrorHttp);

export default app;
