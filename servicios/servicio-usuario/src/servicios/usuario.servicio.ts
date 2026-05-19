import type { UsuarioEnRol } from '../modelos/rol.modelo.js';
import type { UsuarioRepositorio } from '../repositorios/usuario.repositorio.js';

import { ErrorNegocio } from './rol.servicio.js';

export { ErrorNegocio };

export class UsuarioServicio {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  async cambiarEstado(id: number, activo: boolean): Promise<UsuarioEnRol> {
    const usuario = await this.usuarioRepositorio.obtenerPorId(id);
    if (!usuario) {
      throw new ErrorNegocio(`Usuario con id ${id} no encontrado`, 404);
    }
    return this.usuarioRepositorio.cambiarEstado(id, activo);
  }
}
