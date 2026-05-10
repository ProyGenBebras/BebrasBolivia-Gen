import type { NextFunction, Request, Response } from 'express';

// TODO(REQ-09 - Willian/Juan Carlos): reemplazar este stub por la verificación
// real de rol administrador a partir del JWT cuando el middleware de
// autorización esté disponible.
export function verificarAdmin(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
