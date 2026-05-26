import type { Prisma, PrismaClient, usuarios } from '@prisma/client';

import baseDeDatos from '../config/base-de-datos';

type ConexionBD = Pick<PrismaClient, 'usuarios'>;

// Datos para persistir un usuario nuevo. La contrasena debe llegar ya hasheada
// desde la capa de servicios; el repositorio solo persiste, no transforma datos.
export type DatosCrearUsuario = Prisma.usuariosCreateInput;

// Ejemplo base: agregar nuevos metodos segun necesidades de cada modulo.
type UsuarioRepositorio = {
  buscarPorId(id: string): Promise<usuarios | null>;
  buscarPorCorreo(correo: string): Promise<usuarios | null>;
  crear(datos: DatosCrearUsuario): Promise<usuarios>;
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
