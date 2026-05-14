import { crearUsuarioRepositorio } from '../../src/repositorios/usuario-repositorio';

describe('UsuarioRepositorio', () => {
  it('deberia buscar por id', async () => {
    const findUnique = jest.fn().mockResolvedValue({ id: 'u1' });
    const repositorio = crearUsuarioRepositorio({
      usuarios: { findUnique, findFirst: jest.fn() },
    } as never);

    const resultado = await repositorio.buscarPorId('u1');

    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'u1' } });
    expect(resultado).toEqual({ id: 'u1' });
  });

  it('deberia buscar por correo', async () => {
    const findFirst = jest.fn().mockResolvedValue({ correo: 'a@b.com' });
    const repositorio = crearUsuarioRepositorio({
      usuarios: { findUnique: jest.fn(), findFirst },
    } as never);

    const resultado = await repositorio.buscarPorCorreo('a@b.com');

    expect(findFirst).toHaveBeenCalledWith({ where: { correo: 'a@b.com' } });
    expect(resultado).toEqual({ correo: 'a@b.com' });
  });
});
