import { Usuario } from '../modelos/usuario';

export interface UsuarioRepositorio {
  listar(): Promise<Usuario[]>;
}
