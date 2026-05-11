import { Request, Response } from 'express';
import { UsuarioService } from '../servicios/usuario.service';
import { RolUsuario } from '@prisma/client';

export class UsuarioController {
  static async obtenerRol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.obtenerRolUsuario(id);
      res.status(200).json(usuario);
    } catch (error: any) {
      if (error.message === 'Usuario no encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  static async cambiarRol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rol, datos_adicionales } = req.body;

      if (!rol) {
        res.status(400).json({ error: 'El campo "rol" es requerido' });
        return;
      }

      if (!Object.values(RolUsuario).includes(rol)) {
        res.status(400).json({ error: 'Rol inválido' });
        return;
      }

      const datosAdicionalesSeguros = datos_adicionales || {};
      const usuarioActualizado = await UsuarioService.cambiarRol(id, rol as RolUsuario, datosAdicionalesSeguros);

      res.status(200).json({
        mensaje: 'Rol actualizado exitosamente',
        usuario: usuarioActualizado,
      });
    } catch (error: any) {
      if (error.message === 'Usuario no encontrado') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'No se puede modificar el rol del administrador principal') {
        res.status(403).json({ error: error.message });
      } else if (error.message.includes('Faltan datos requeridos')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
}
