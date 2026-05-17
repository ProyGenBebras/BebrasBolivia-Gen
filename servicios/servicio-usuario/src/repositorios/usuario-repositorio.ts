import type { PrismaClient, usuarios } from '@prisma/client';

import baseDeDatos from '../config/base-de-datos';

type ConexionBD = Pick<PrismaClient, 'usuarios'>;

// Ejemplo base: agregar nuevos metodos segun necesidades de cada modulo.
type UsuarioRepositorio = {
  buscarPorId(id: string): Promise<usuarios | null>;
  buscarPorCorreo(correo: string): Promise<usuarios | null>;
};

export const crearUsuarioRepositorio = (conexionBD: ConexionBD): UsuarioRepositorio => ({
  async buscarPorId(id: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findUnique({ where: { id } });
  },

  async buscarPorCorreo(correo: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({ where: { correo } });
  },
});

export const usuarioRepositorio = crearUsuarioRepositorio(baseDeDatos);
