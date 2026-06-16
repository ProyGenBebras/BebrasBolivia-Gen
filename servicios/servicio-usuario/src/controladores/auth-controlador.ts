import type { NextFunction, Request, Response } from 'express';

import { authServicio, crearAuthServicio } from '../servicios/auth-servicio';
import { validarLogin } from '../utilidades/validar-login';

type AuthServicio = ReturnType<typeof crearAuthServicio>;

interface AuthControlador {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  me(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const crearAuthControlador = (servicio: AuthServicio = authServicio): AuthControlador => ({
  async login(req, res, next): Promise<void> {
    try {
      const dto = validarLogin(req.body);
      const ip = req.ip;
      const resultado = await servicio.login(dto, ip);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next): Promise<void> {
    try {
      if (!req.usuario) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }
      const usuario = await servicio.obtenerActual(req.usuario.id);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  },
});

export const authControlador = crearAuthControlador();
