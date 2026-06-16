import { Router } from 'express';

/**
 * Ruta de demostración del pipeline CI/CD ("Hola Mundo").
 * Pública y sin lógica de negocio: es la prueba visible de que el Despliegue
 * Continuo propagó los cambios al servidor (localhost Linux).
 */
const holaRutas: Router = Router();

// GET /api/v1/hola — saludo de prueba del deploy
holaRutas.get('/', (_req, res) => {
  res.status(200).json({ mensaje: 'Hola Mundo' });
});

export default holaRutas;
