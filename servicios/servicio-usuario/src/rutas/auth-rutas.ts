import { Router } from 'express';

import { authControlador } from '../controladores/auth-controlador';
import { autenticarJwt } from '../middlewares/autenticar-jwt';

const authRutas: Router = Router();

// POST /api/v1/auth/login — público, no requiere autenticación
authRutas.post('/login', (req, res, next) => {
  void authControlador.login(req, res, next);
});

// GET /api/v1/auth/me — requiere JWT válido
authRutas.get('/me', autenticarJwt, (req, res, next) => {
  void authControlador.me(req, res, next);
});

export default authRutas;
