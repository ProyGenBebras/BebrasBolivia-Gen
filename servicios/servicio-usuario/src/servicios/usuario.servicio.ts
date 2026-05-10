import type { CrearUsuarioDto } from '../dtos/crear-usuario.dto.js';
import type { UsuarioPublico } from '../modelos/usuario.modelo.js';
import { aUsuarioPublico } from '../modelos/usuario.modelo.js';
import { UsuarioRepositorio } from '../repositorios/usuario.repositorio.js';
import { ErrorNegocio } from '../utilidades/errores.js';

export class UsuarioServicio {
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

    // TODO(REQ-04 tarea 4 - Angel): reemplazar por hash bcrypt real.
    const contrasenaHash = await this.cifrarContrasena(dto.contrasena);

    // TODO(REQ-04 tarea 5 - Angel): incorporar reglas de asignación de rol inicial
    // (por ejemplo validar que solo un administrador pueda crear administradores).
    const usuarioCreado = await this.usuarioRepositorio.crear({
      correo: dto.correo,
      nombreUsuario: dto.nombreUsuario,
      contrasenaHash,
      rol: dto.rol,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
    });

    return aUsuarioPublico(usuarioCreado);
  }

  // TODO(REQ-04 tarea 4 - Angel): implementar bcrypt aquí. Stub temporal para
  // permitir que el endpoint funcione end-to-end mientras se integra el hash real.
  private async cifrarContrasena(contrasena: string): Promise<string> {
    return `pendiente-hash:${contrasena.length}`;
  }
}
