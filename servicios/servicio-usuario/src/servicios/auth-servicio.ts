import type { usuarios } from '@prisma/client';
import bcrypt from 'bcrypt';

import type { LoginDto } from '../dtos/login.dto';
import {
  crearUsuarioRepositorio,
  usuarioRepositorio as repositorioPorDefecto,
} from '../repositorios/usuario-repositorio';
import { ErrorNegocio, ErrorNoAutenticado } from '../utilidades/errores';
import { firmarAccessToken } from '../utilidades/jwt';

import type { HasheadorContrasena } from './usuario-servicio';

type UsuarioRepositorio = ReturnType<typeof crearUsuarioRepositorio>;

interface DependenciasAuthServicio {
  repositorio?: UsuarioRepositorio;
  hasheador?: HasheadorContrasena;
}

export interface RespuestaLogin {
  token: string;
  usuario: UsuarioPublico;
}

export interface UsuarioPublico {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: usuarios['rol'];
  nombreUsuario: string | null;
  telefono: string | null;
  estaActivo: boolean;
  estaVerificado: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

export const aRespuestaPublica = (u: usuarios): UsuarioPublico => ({
  id: u.id,
  correo: u.correo,
  nombres: u.nombres,
  apellidos: u.apellidos,
  rol: u.rol,
  nombreUsuario: u.nombre_usuario,
  telefono: u.telefono,
  estaActivo: u.esta_activo,
  estaVerificado: u.esta_verificado,
  creadoEn: u.creado_en,
  actualizadoEn: u.actualizado_en,
});

interface AuthServicio {
  login(dto: LoginDto, ip?: string): Promise<RespuestaLogin>;
  obtenerActual(id: string): Promise<UsuarioPublico>;
}

export const crearAuthServicio = (
  dependencias: DependenciasAuthServicio = {},
): AuthServicio => {
  const repositorio = dependencias.repositorio ?? repositorioPorDefecto;
  // El hasheador se inyecta directamente (con su método comparar)
  const hasheador: HasheadorContrasena = dependencias.hasheador ?? {
    hashear: async (plana: string) => bcrypt.hash(plana, 10),
    comparar: async (plana: string, hash: string) => bcrypt.compare(plana, hash),
  };

  return {
    async login(dto: LoginDto, ip?: string): Promise<RespuestaLogin> {
      const usuario = await repositorio.buscarPorCorreo(dto.correo);

      // Mensaje genérico: no revelamos si el correo existe
      if (!usuario || !usuario.esta_activo) {
        throw new ErrorNoAutenticado('Credenciales incorrectas');
      }

      if (usuario.bloqueado_hasta && usuario.bloqueado_hasta > new Date()) {
        const minutos = Math.ceil(
          (usuario.bloqueado_hasta.getTime() - Date.now()) / 60000,
        );
        throw new ErrorNegocio(
          `Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutos} min`,
          423,
        );
      }

      const contrasenaValida = await hasheador.comparar(
        dto.contrasena,
        usuario.contrasena_hash,
      );

      if (!contrasenaValida) {
        await repositorio.registrarIntentoFallido(usuario.id);
        throw new ErrorNoAutenticado('Credenciales incorrectas');
      }

      await repositorio.registrarLoginExitoso(usuario.id, ip);

      const token = firmarAccessToken({ sub: usuario.id, rol: usuario.rol });

      return { token, usuario: aRespuestaPublica(usuario) };
    },

    async obtenerActual(id: string): Promise<UsuarioPublico> {
      const usuario = await repositorio.buscarPorId(id);
      if (!usuario || !usuario.esta_activo) {
        throw new ErrorNoAutenticado();
      }
      return aRespuestaPublica(usuario);
    },
  };
};

export const authServicio = crearAuthServicio();
