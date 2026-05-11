import bcrypt from 'bcrypt';

import type { CrearUsuarioDto } from '../dtos/crear-usuario.dto.js';
import type { UsuarioPublico } from '../modelos/usuario.modelo.js';
import { aUsuarioPublico } from '../modelos/usuario.modelo.js';
import { UsuarioRepositorio } from '../repositorios/usuario.repositorio.js';
import { ErrorNegocio } from '../utilidades/errores.js';

export class UsuarioServicio {
  private readonly SALT_ROUNDS = 10;
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  async crear(dto: CrearUsuarioDto): Promise<UsuarioPublico> {
    const correoExistente = await this.usuarioRepositorio.buscarPorCorreo(dto.correo);
    if (correoExistente) {
      throw new ErrorNegocio('El correo ya está registrado', 409);
    }

    if (dto.nombreUsuario) {
      const nombreUsuarioExistente = await this.usuarioRepositorio.buscarPorNombreUsuario(
        dto.nombreUsuario,
      );
      if (nombreUsuarioExistente) {
        throw new ErrorNegocio('El nombre de usuario ya está registrado', 409);
      }
    }

    const rolAsignado = dto.rol;
    const contrasenaHash = await this.cifrarContrasena(dto.contrasena); 

    const usuarioCreado = await this.usuarioRepositorio.crear({
      correo: dto.correo,
      nombreUsuario: dto.nombreUsuario,
      contrasenaHash,
      rol: rolAsignado,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
    });

    return aUsuarioPublico(usuarioCreado);
  }

  private async cifrarContrasena(contrasena: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(contrasena, salt);
  }
}
