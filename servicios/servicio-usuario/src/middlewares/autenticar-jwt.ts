import type { NextFunction, Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import type { UsuarioAutenticado } from '../compartido/tipos/usuario-autenticado';
import baseDeDatos from '../config/base-de-datos';
import { ErrorNoAutenticado } from '../utilidades/errores';
import { verificarAccessToken } from '../utilidades/jwt';

// Construye el objeto UsuarioAutenticado desde BD — misma consulta que resolver-identidad.
// Se exporta para poder reutilizarla en tests y en resolver-identidad durante la transición.
export const construirUsuarioAutenticado = async (id: string): Promise<UsuarioAutenticado> => {
  const registro = await baseDeDatos.usuarios.findUnique({
    where: { id },
    include: {
      coordinadores_institucion: {
        where: { esta_activo: true },
        select: { institucion_id: true },
      },
      profesores: {
        select: {
          profesores_grupos: {
            where: { esta_activo: true },
            select: { grupo_id: true },
          },
        },
      },
    },
  });

  if (!registro || !registro.esta_activo) {
    throw new ErrorNoAutenticado();
  }

  return {
    id: registro.id,
    rol: registro.rol,
    institucionIds: registro.coordinadores_institucion.map((c) => c.institucion_id),
    grupoIds: registro.profesores?.profesores_grupos.map((g) => g.grupo_id) ?? [],
  };
};

const autenticarJwtImpl = async (req: Request, next: NextFunction): Promise<void> => {
  try {
    const cabecera = req.headers.authorization;
    if (!cabecera?.startsWith('Bearer ')) {
      next(new ErrorNoAutenticado());
      return;
    }

    const token = cabecera.slice(7);
    const payload = verificarAccessToken(token);

    req.usuario = await construirUsuarioAutenticado(payload.sub);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(new ErrorNoAutenticado('Token inválido o expirado'));
      return;
    }
    next(error);
  }
};

export const autenticarJwt: RequestHandler = (req, _res, next): void => {
  void autenticarJwtImpl(req, next);
};
