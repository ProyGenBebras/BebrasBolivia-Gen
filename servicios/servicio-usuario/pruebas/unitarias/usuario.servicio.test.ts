import { usuarioRepositorio } from '../../src/repositorios/usuario-repositorio';
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
  let repositorio: typeof usuarioRepositorio;
  let servicio: UsuarioServicio;

  beforeEach(() => {
    const usuariosGuardados: any[] = [];

    repositorio = {
      buscarPorId: async (id) => usuariosGuardados.find(u => u.id === id) || null,
      buscarPorCorreo: async (correo) => usuariosGuardados.find(u => u.correo === correo) || null,
      buscarPorNombreUsuario: async (nombre) => usuariosGuardados.find(u => u.nombre_usuario === nombre) || null,
      crear: async (datos) => {
        const nuevo = {
          id: 'uuid-falso-123',
          correo: datos.correo,
          nombre_usuario: datos.nombreUsuario || null,
          contrasena_hash: datos.contrasenaHash,
          rol: datos.rol,
          nombres: datos.nombres,
          apellidos: datos.apellidos,
          telefono: datos.telefono || null,
          esta_activo: true,
          esta_verificado: false,
          creado_en: new Date(),
          actualizado_en: new Date(),
        };
        usuariosGuardados.push(nuevo);
        return nuevo as any;
      }
    };

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