import type { usuarios } from '@prisma/client';
import bcrypt from 'bcrypt';

import type { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import {
  crearUsuarioRepositorio,
  usuarioRepositorio as repositorioPorDefecto,
} from '../repositorios/usuario-repositorio';
import { ErrorNegocio } from '../utilidades/errores';

type UsuarioRepositorio = ReturnType<typeof crearUsuarioRepositorio>;

/**
 * Puerto de hasheo de contrasenas.
 */
export interface HasheadorContrasena {
  hashear(contrasenaPlana: string): Promise<string>;
}

/**
 * Implementacion hasheo usando bcrypt (REQ-04).
 */
const hasheadorBcrypt: HasheadorContrasena = {
  async hashear(contrasenaPlana: string): Promise<string> {
    const rondasSal = 10;
    return bcrypt.hash(contrasenaPlana, rondasSal);
  }
};

interface DependenciasUsuarioServicio {
  repositorio?: UsuarioRepositorio;
  hasheador?: HasheadorContrasena;
}

interface UsuarioServicio {
  crear(dto: CrearUsuarioDto): Promise<usuarios>;
  eliminarUsuario(idUsuario: string, idSolicitante: string): Promise<usuarios>;
}

export const crearUsuarioServicio = (
  dependencias: DependenciasUsuarioServicio = {},
): UsuarioServicio => {
  const repositorio = dependencias.repositorio ?? repositorioPorDefecto;
  const hasheador = dependencias.hasheador ?? hasheadorBcrypt;

  return {
    /**
     * Crea un usuario nuevo a partir de los datos validados del formulario.
     * Aplica la regla de negocio de correo unico antes de persistir.
     */
    async crear(dto: CrearUsuarioDto): Promise<usuarios> {
      const correoRegistrado = await repositorio.buscarPorCorreo(dto.correo);
      if (correoRegistrado !== null) {
        throw new ErrorNegocio('El correo ya esta registrado', 409);
      }

      const contrasenaHash = await hasheador.hashear(dto.contrasena);

      return repositorio.crear({
        correo: dto.correo,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        contrasena_hash: contrasenaHash,
        rol: dto.rol,
        nombre_usuario: dto.nombreUsuario ?? null,
        telefono: dto.telefono ?? null,
      });
    },

    async eliminarUsuario(idUsuario: string, idSolicitante: string): Promise<usuarios> {
      const solicitante = await repositorio.buscarPorId(idSolicitante);

      if (!solicitante || solicitante.rol !== 'administrador') {
        throw new ErrorNegocio('No tiene permisos para eliminar usuarios', 403);
      }

      const usuario = await repositorio.buscarPorId(idUsuario);

      if (!usuario) {
        throw new ErrorNegocio('Usuario no encontrado', 404);
      }

      if (!usuario.esta_activo) {
        throw new ErrorNegocio('El usuario ya fue eliminado', 400);
      }

      return repositorio.eliminar(idUsuario);
    },
  };
};

export const usuarioServicio = crearUsuarioServicio();
