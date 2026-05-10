import { UsuarioRepositorio } from '../../src/repositorios/usuario.repositorio';
import { UsuarioServicio } from '../../src/servicios/usuario.servicio';
import { ErrorNegocio } from '../../src/utilidades/errores';
import type { CrearUsuarioDto } from '../../src/dtos/crear-usuario.dto';

const dtoBase: CrearUsuarioDto = {
  correo: 'admin@bebras.bo',
  contrasena: 'contrasenaSegura1',
  nombres: 'Ana',
  apellidos: 'Pérez',
  rol: 'administrador',
  telefono: undefined,
  nombreUsuario: undefined,
};

describe('UsuarioServicio', () => {
  let repositorio: UsuarioRepositorio;
  let servicio: UsuarioServicio;

  beforeEach(() => {
    repositorio = new UsuarioRepositorio();
    servicio = new UsuarioServicio(repositorio);
  });

  describe('crear', () => {
    it('debería crear un usuario cuando los datos son válidos', async () => {
      const usuario = await servicio.crear(dtoBase);

      expect(usuario.id).toBeDefined();
      expect(usuario.correo).toBe(dtoBase.correo);
      expect(usuario.rol).toBe(dtoBase.rol);
      expect(usuario.activo).toBe(true);
      expect(usuario.verificado).toBe(false);
      expect(usuario).not.toHaveProperty('contrasenaHash');
    });

    it('debería lanzar ErrorNegocio con código 409 cuando el correo ya existe', async () => {
      await servicio.crear(dtoBase);

      await expect(servicio.crear(dtoBase)).rejects.toThrow(ErrorNegocio);
      await expect(servicio.crear(dtoBase)).rejects.toMatchObject({ codigo: 409 });
    });

    it('debería lanzar ErrorNegocio con código 409 cuando el nombre de usuario ya existe', async () => {
      await servicio.crear({ ...dtoBase, nombreUsuario: 'admin01' });

      await expect(
        servicio.crear({ ...dtoBase, correo: 'otro@bebras.bo', nombreUsuario: 'admin01' }),
      ).rejects.toMatchObject({ codigo: 409 });
    });

    it('debería persistir el usuario en el repositorio', async () => {
      const usuario = await servicio.crear(dtoBase);

      const guardado = await repositorio.buscarPorId(usuario.id);
      expect(guardado).toBeDefined();
      expect(guardado?.correo).toBe(dtoBase.correo);
    });
  });
});
