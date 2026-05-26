import type { NextFunction, Request, Response } from 'express';

import { UsuarioServicio } from '../servicios/usuario.servicio';

export class UsuarioControlador {
  constructor(private usuarioServicio: UsuarioServicio) {}

  async listar(_req: Request, res: Response, next: NextFunction): Promise<void> {
    const usuarios = await this.usuarioServicio.obtenerUsuarios().catch(next);
    if (usuarios) res.status(200).json(usuarios);
  }
}
