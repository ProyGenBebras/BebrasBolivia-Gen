import bcrypt from 'bcrypt';

import type { CrearUsuarioDto } from '../dtos/crear-usuario.dto.js';
import type { UsuarioPublico } from '../modelos/usuario.modelo.js';
import { aUsuarioPublico } from '../modelos/usuario.modelo.js';
import { usuarioRepositorio } from '../repositorios/usuario-repositorio.js';
import { ErrorNegocio } from '../utilidades/errores.js';

type Repositorio = typeof usuarioRepositorio;

export class UsuarioServicio {
  private readonly SALT_ROUNDS = 10;
  
  constructor(private readonly repo: Repositorio = usuarioRepositorio) {}

  async crear(dto: CrearUsuarioDto): Promise<UsuarioPublico> {
    const correoExistente = await this.repo.buscarPorCorreo(dto.correo);
    if (correoExistente) {
      throw new ErrorNegocio('El correo ya está registrado', 409);
    }

    if (dto.nombreUsuario) {
      const nombreUsuarioExistente = await this.repo.buscarPorNombreUsuario(dto.nombreUsuario);
      if (nombreUsuarioExistente) {
        throw new ErrorNegocio('El nombre de usuario ya está registrado', 409);
      }
    }

    const contrasenaHash = await this.cifrarContrasena(dto.contrasena); 

    const usuarioCreado = await this.repo.crear({
      correo: dto.correo,
      nombreUsuario: dto.nombreUsuario,
      contrasenaHash,
      rol: dto.rol, 
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
    });

    const usuarioMapeado = {
      ...usuarioCreado,
      nombreUsuario: usuarioCreado.nombre_usuario,
      contrasenaHash: usuarioCreado.contrasena_hash,
      activo: usuarioCreado.esta_activo,
      verificado: usuarioCreado.esta_verificado,
      creadoEn: usuarioCreado.creado_en,
      actualizadoEn: usuarioCreado.actualizado_en,
    };

    return aUsuarioPublico(usuarioMapeado);
  }

  private async cifrarContrasena(contrasena: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(contrasena, salt);
  }
}