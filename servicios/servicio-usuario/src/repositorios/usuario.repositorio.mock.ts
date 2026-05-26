import { Usuario } from '../modelos/usuario';

import { UsuarioRepositorio } from './usuario.repositorio';

export class UsuarioRepositorioMock implements UsuarioRepositorio {
  private usuarios: Usuario[] = [
    {
      id: '1',
      nombre: 'Juan Perez',
      email: 'juan@example.com',
      fechaCreacion: new Date(),
    },
    {
      id: '2',
      nombre: 'Maria Garcia',
      email: 'maria@example.com',
      fechaCreacion: new Date(),
    },
  ];

  async listar(): Promise<Usuario[]> {
    return this.usuarios;
  }
}
