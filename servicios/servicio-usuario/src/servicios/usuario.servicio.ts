import type { Usuario } from '../modelos/usuario.modelo.js';
import type { IUsuarioRepositorio } from '../repositorios/usuario.repositorio.js';
import { ErrorNegocio } from '../utilidades/errores.js';

export interface IUsuarioServicio {
  eliminarUsuario(idUsuario: string, idSolicitante: string): Promise<Usuario>;
}

export class UsuarioServicio {
  constructor(private readonly usuarioRepositorio: IUsuarioRepositorio) {}

  async eliminarUsuario(idUsuario: string, idSolicitante: string): Promise<Usuario> {
    const solicitante = await this.usuarioRepositorio.buscarPorId(idSolicitante);

    if (!solicitante || solicitante.rol !== 'administrador') {
      throw new ErrorNegocio('No tiene permisos para eliminar usuarios', 403);
    }

    const usuario = await this.usuarioRepositorio.buscarPorId(idUsuario);

    if (!usuario) {
      throw new ErrorNegocio('Usuario no encontrado', 404);
    }

    if (!usuario.activo) {
      throw new ErrorNegocio('El usuario ya fue eliminado', 400);
    }

    return this.usuarioRepositorio.eliminar(idUsuario);
  }
}
