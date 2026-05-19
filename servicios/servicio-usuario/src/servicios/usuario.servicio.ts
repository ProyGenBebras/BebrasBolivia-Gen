import { Usuario } from '../modelos/usuario';
import { UsuarioRepositorio } from '../repositorios/usuario.repositorio';

export class UsuarioServicio {
  constructor(private usuarioRepositorio: UsuarioRepositorio) {}

  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepositorio.listar();
  }
}
