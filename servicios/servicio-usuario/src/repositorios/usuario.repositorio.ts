import type { Usuario } from '../modelos/usuario.modelo.js';

export interface IUsuarioRepositorio {
  buscarPorId(id: string): Promise<Usuario | null>;
  eliminar(id: string): Promise<Usuario>;
}

export class UsuarioRepositorio implements IUsuarioRepositorio {
  async buscarPorId(_id: string): Promise<Usuario | null> {
    throw new Error('Repositorio no implementado aún — pendiente de Prisma');
  }

  async eliminar(_id: string): Promise<Usuario> {
    throw new Error('Repositorio no implementado aún — pendiente de Prisma');
  }
}
