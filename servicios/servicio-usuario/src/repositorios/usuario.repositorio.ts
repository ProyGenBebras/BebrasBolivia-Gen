import { PrismaClient } from '@prisma/client';

import type { UsuarioEnRol } from '../modelos/rol.modelo.js';

export class UsuarioRepositorio {
  constructor(private readonly prisma: PrismaClient) {}

  async obtenerPorId(id: number): Promise<UsuarioEnRol | null> {
    const usuario = await this.prisma.usuarios.findFirst({
      where: { id: String(id) },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        esta_activo: true,
        creado_en: true,
      },
    });
    if (!usuario) return null;
    return {
      id: Number(usuario.id),
      nombre: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.correo,
      activo: usuario.esta_activo,
      createdAt: usuario.creado_en,
    };
  }

  async cambiarEstado(id: number, activo: boolean): Promise<UsuarioEnRol> {
    const usuario = await this.prisma.usuarios.update({
      where: { id: String(id) },
      data: { esta_activo: activo },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        esta_activo: true,
        creado_en: true,
      },
    });
    return {
      id: Number(usuario.id),
      nombre: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.correo,
      activo: usuario.esta_activo,
      createdAt: usuario.creado_en,
    };
  }
}
