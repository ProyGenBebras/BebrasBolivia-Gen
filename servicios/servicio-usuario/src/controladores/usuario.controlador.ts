import type { Request, Response } from 'express';

import type { IUsuarioServicio } from '../servicios/usuario.servicio.js';
import { ErrorNegocio } from '../utilidades/errores.js';

export class UsuarioControlador {
  constructor(private readonly usuarioServicio: IUsuarioServicio) {}

  async eliminarUsuario(req: Request, res: Response): Promise<void> {
    const idSolicitante = req.headers['x-usuario-id'];

    if (!idSolicitante || typeof idSolicitante !== 'string') {
      res.status(400).json({ mensaje: 'Falta el identificador del solicitante' });
      return;
    }

    try {
      await this.usuarioServicio.eliminarUsuario(req.params.id, idSolicitante);
      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      if (error instanceof ErrorNegocio) {
        res.status(error.codigo).json({ mensaje: error.mensaje });
        return;
      }
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
}
