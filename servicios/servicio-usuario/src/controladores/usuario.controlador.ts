import type { NextFunction, Request, Response } from 'express';

import type { CrearUsuarioDto } from '../dtos/crear-usuario.dto.js';
import { UsuarioServicio } from '../servicios/usuario.servicio.js';

export class UsuarioControlador {
  constructor(private readonly usuarioServicio: UsuarioServicio) {}

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CrearUsuarioDto;
      const usuario = await this.usuarioServicio.crear(dto);
      res.status(201).json({
        mensaje: 'Usuario creado correctamente',
        usuario,
      });
    } catch (error) {
      next(error);
    }
  };
}
