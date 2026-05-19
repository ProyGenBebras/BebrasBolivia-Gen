import { crearUsuarioServicio } from '../../src/servicios/usuario-servicio';
import { ErrorNegocio } from '../../src/utilidades/errores';

import type { CrearUsuarioDto } from '../../src/dtos/crear-usuario.dto';

const dto: CrearUsuarioDto = {
  correo: 'nuevo@bebras.com',
  nombres: 'Carlos',
  apellidos: 'Vargas',
  contrasena: 'claveSegura1',
  rol: 'profesor',
};

describe('UsuarioServicio', () => {
  describe('crear', () => {
    it('deberia crear el usuario cuando el correo no esta registrado', async () => {
      const buscarPorCorreo = jest.fn().mockResolvedValue(null);
      const crear = jest.fn().mockResolvedValue({ id: 'u1', correo: dto.correo });
      const hashear = jest.fn().mockResolvedValue('hash-fake');
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorCorreo, crear } as never,
        hasheador: { hashear },
      });

      const resultado = await servicio.crear(dto);

      expect(buscarPorCorreo).toHaveBeenCalledWith(dto.correo);
      expect(hashear).toHaveBeenCalledWith(dto.contrasena);
      expect(crear).toHaveBeenCalledWith(
        expect.objectContaining({ correo: dto.correo, contrasena_hash: 'hash-fake' }),
      );
      expect(resultado).toEqual({ id: 'u1', correo: dto.correo });
    });

    it('deberia lanzar ErrorNegocio cuando el correo ya esta registrado', async () => {
      const buscarPorCorreo = jest.fn().mockResolvedValue({ id: 'existente' });
      const crear = jest.fn();
      const servicio = crearUsuarioServicio({
        repositorio: { buscarPorCorreo, crear } as never,
        hasheador: { hashear: jest.fn() },
      });

      await expect(servicio.crear(dto)).rejects.toThrow(ErrorNegocio);
      expect(crear).not.toHaveBeenCalled();
    });

    it('deberia propagar el error si el hasheo no esta implementado', async () => {
      const servicio = crearUsuarioServicio({
        repositorio: {
          buscarPorCorreo: jest.fn().mockResolvedValue(null),
          crear: jest.fn(),
        } as never,
      });

      await expect(servicio.crear(dto)).rejects.toThrow(ErrorNegocio);
    });
  });
});
