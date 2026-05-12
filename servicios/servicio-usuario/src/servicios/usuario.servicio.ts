import { UsuarioRepositorio } from '../repositorios/usuario.repositorio';
import { Usuario } from '../modelos/usuario';

export class UsuarioServicio {
  constructor(private usuarioRepositorio: UsuarioRepositorio) {}

  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepositorio.listar();
  }
}
