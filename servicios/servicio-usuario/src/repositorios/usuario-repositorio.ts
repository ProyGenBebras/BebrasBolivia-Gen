import type { Prisma, PrismaClient, usuarios } from '@prisma/client';

import baseDeDatos from '../config/base-de-datos';

type ConexionBD = Pick<PrismaClient, 'usuarios'>;

// Datos para persistir un usuario nuevo. La contrasena debe llegar ya hasheada
// desde la capa de servicios; el repositorio solo persiste, no transforma datos.
export type DatosCrearUsuario = Prisma.usuariosCreateInput;

export type DatosActualizarUsuario =
  Pick<Partial<Prisma.usuariosUpdateInput>, 'nombres' | 'apellidos' | 'correo' | 'telefono'>;

// Ejemplo base: agregar nuevos metodos segun necesidades de cada modulo.
type UsuarioRepositorio = {
  buscarPorId(id: string): Promise<usuarios | null>;
  buscarPorCorreo(correo: string): Promise<usuarios | null>;
  crear(datos: DatosCrearUsuario): Promise<usuarios>;
  buscarPorCorreoExcluyendo(correo: string, idExcluir: string): Promise<usuarios | null>;
  actualizarPerfil(id: string, datos: DatosActualizarUsuario): Promise<usuarios>;
  eliminar(id: string): Promise<usuarios>;
  actualizarEstadoActivo(id: string, estaActivo: boolean): Promise<usuarios>;
};

export const crearUsuarioRepositorio = (conexionBD: ConexionBD): UsuarioRepositorio => ({
  async buscarPorId(id: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findUnique({ where: { id } });
  },

  async buscarPorCorreo(correo: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({ where: { correo } });
  },

  async crear(datos: DatosCrearUsuario): Promise<usuarios> {
    return conexionBD.usuarios.create({ data: datos });
  },

  async buscarPorCorreoExcluyendo(correo: string, idExcluir: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({
      where: {
        correo,
        id: { not: idExcluir },
      },
    });
  },

  async actualizarPerfil(id: string, datos: DatosActualizarUsuario): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: {
        ...datos,
        actualizado_en: new Date(),
      },
    });
  },

  async eliminar(id: string): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: { esta_activo: false },
    });
  },

  async actualizarEstadoActivo(id: string, estaActivo: boolean): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: { esta_activo: estaActivo, actualizado_en: new Date() },
    });
  },
});

export const usuarioRepositorio = crearUsuarioRepositorio(baseDeDatos);
