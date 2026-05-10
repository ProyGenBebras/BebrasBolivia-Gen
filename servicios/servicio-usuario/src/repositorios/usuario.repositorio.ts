import { randomUUID } from 'crypto';

import type { Usuario } from '../modelos/usuario.modelo.js';

export interface DatosCrearUsuario {
  correo: string;
  nombreUsuario?: string;
  contrasenaHash: string;
  rol: Usuario['rol'];
  nombres: string;
  apellidos: string;
  telefono?: string;
}

export class UsuarioRepositorio {
  private readonly usuarios: Map<string, Usuario> = new Map();

  async crear(datos: DatosCrearUsuario): Promise<Usuario> {
    const ahora = new Date();
    const usuario: Usuario = {
      id: randomUUID(),
      correo: datos.correo,
      nombreUsuario: datos.nombreUsuario ?? null,
      contrasenaHash: datos.contrasenaHash,
      rol: datos.rol,
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      telefono: datos.telefono ?? null,
      activo: true,
      verificado: false,
      creadoEn: ahora,
      actualizadoEn: ahora,
    };

    this.usuarios.set(usuario.id, usuario);
    return usuario;
  }

  async buscarPorId(id: string): Promise<Usuario | undefined> {
    return this.usuarios.get(id);
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | undefined> {
    const correoNormalizado = correo.toLowerCase();
    for (const usuario of this.usuarios.values()) {
      if (usuario.correo === correoNormalizado) {
        return usuario;
      }
    }
    return undefined;
  }

  async buscarPorNombreUsuario(nombreUsuario: string): Promise<Usuario | undefined> {
    for (const usuario of this.usuarios.values()) {
      if (usuario.nombreUsuario === nombreUsuario) {
        return usuario;
      }
    }
    return undefined;
  }
}
