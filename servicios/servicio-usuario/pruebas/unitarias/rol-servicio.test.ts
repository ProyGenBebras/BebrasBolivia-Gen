import { UsuarioRepositorio } from '../../src/repositorios/usuario-repositorio';
import { RolServicio } from '../../src/servicios/rol-servicio';

describe('RolServicio', () => {
  it('deberia asignar rol cuando el solicitante es administrador', () => {
    // Arrange
    const usuarioRepositorio = new UsuarioRepositorio([
      { id: 'admin-1', nombre: 'Admin', rol: 'admin' },
      { id: 'est-1', nombre: 'Estudiante', rol: 'estudiante' },
    ]);
    const rolServicio = new RolServicio(usuarioRepositorio);

    // Act
    const usuarioActualizado = rolServicio.asignarRol('est-1', 'profesor', {
      id: 'admin-1',
      nombre: 'Admin',
      rol: 'admin',
    });

    // Assert
    expect(usuarioActualizado).toEqual({
      id: 'est-1',
      nombre: 'Estudiante',
      rol: 'profesor',
    });
    expect(usuarioRepositorio.obtenerPorId('est-1')?.rol).toBe('profesor');
  });

  it('deberia rechazar asignacion cuando el solicitante no es administrador', () => {
    // Arrange
    const usuarioRepositorio = new UsuarioRepositorio([
      { id: 'admin-1', nombre: 'Admin', rol: 'admin' },
      { id: 'est-1', nombre: 'Estudiante', rol: 'estudiante' },
    ]);
    const rolServicio = new RolServicio(usuarioRepositorio);

    // Act + Assert
    expect(() =>
      rolServicio.asignarRol('est-1', 'profesor', {
        id: 'est-1',
        nombre: 'Estudiante',
        rol: 'estudiante',
      }),
    ).toThrow('Permisos insuficientes para asignar roles');
  });

  it('deberia rechazar asignacion cuando el rol no es valido', () => {
    // Arrange
    const usuarioRepositorio = new UsuarioRepositorio([
      { id: 'admin-1', nombre: 'Admin', rol: 'admin' },
      { id: 'est-1', nombre: 'Estudiante', rol: 'estudiante' },
    ]);
    const rolServicio = new RolServicio(usuarioRepositorio);

    // Act + Assert
    expect(() =>
      rolServicio.asignarRol('est-1', 'visitante', {
        id: 'admin-1',
        nombre: 'Admin',
        rol: 'admin',
      }),
    ).toThrow('Rol no valido');
  });
});
