import type { PrismaClient, rol_usuario, usuarios } from '@prisma/client';

import baseDeDatos from '../config/base-de-datos.js';

type ConexionBD = Pick<PrismaClient, 'usuarios'>;

export interface DatosCrearUsuario {
  correo: string;
  nombreUsuario?: string;
  contrasenaHash: string;
  rol: rol_usuario;
  nombres: string;
  apellidos: string;
  telefono?: string;
}

type UsuarioRepositorio = {
  buscarPorId(id: string): Promise<usuarios | null>;
  buscarPorCorreo(correo: string): Promise<usuarios | null>;
  buscarPorNombreUsuario(nombreUsuario: string): Promise<usuarios | null>;
  crear(datos: DatosCrearUsuario): Promise<usuarios>;
};

export const crearUsuarioRepositorio = (conexionBD: ConexionBD): UsuarioRepositorio => ({
  
  async buscarPorId(id: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findUnique({ where: { id } });
  },

  async buscarPorCorreo(correo: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({ where: { correo: correo.toLowerCase() } });
  },

  async buscarPorNombreUsuario(nombreUsuario: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({ where: { nombre_usuario: nombreUsuario } });
  },

  async crear(datos: DatosCrearUsuario): Promise<usuarios> {
    return conexionBD.usuarios.create({
      data: {
        correo: datos.correo.toLowerCase(),
        nombre_usuario: datos.nombreUsuario,
        contrasena_hash: datos.contrasenaHash,
        rol: datos.rol,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        telefono: datos.telefono,
      },
    });
  }
});

export const usuarioRepositorio = crearUsuarioRepositorio(baseDeDatos);