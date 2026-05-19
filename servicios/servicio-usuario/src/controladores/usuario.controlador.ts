import { Request, Response } from 'express';

import { UsuarioServicio } from '../servicios/usuario.servicio';

export class UsuarioControlador {
  constructor(private usuarioServicio: UsuarioServicio) {}

  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this.usuarioServicio.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      res.status(500).json({ error: 'Error al listar usuarios' });
    }
  }
}
