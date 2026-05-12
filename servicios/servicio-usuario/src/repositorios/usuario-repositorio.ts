import { type Usuario } from '../dominio/usuario';

export class UsuarioRepositorio {
  private readonly usuariosPorId = new Map<string, Usuario>();

  public constructor(usuariosIniciales: Usuario[]) {
    usuariosIniciales.forEach((usuario) => {
      this.usuariosPorId.set(usuario.id, usuario);
    });
  }

  public obtenerPorId(idUsuario: string): Usuario | null {
    return this.usuariosPorId.get(idUsuario) ?? null;
  }

  public guardar(usuario: Usuario): void {
    this.usuariosPorId.set(usuario.id, usuario);
  }
}
