import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

export function validarCuerpo<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const errores = formatearErroresZod(resultado.error);
      res.status(400).json({ mensaje: 'Datos inválidos', errores });
      return;
    }
    req.body = resultado.data;
    next();
  };
}

function formatearErroresZod(error: ZodError): Array<{ campo: string; mensaje: string }> {
  return error.issues.map((issue) => ({
    campo: issue.path.join('.') || '(raíz)',
    mensaje: issue.message,
  }));
}
