import { PrismaClient } from '@prisma/client';

import type { UsuarioEnRol } from '../modelos/rol.modelo.js';

export class UsuarioRepositorio {
  constructor(private readonly prisma: PrismaClient) {}

  async obtenerPorId(id: number): Promise<UsuarioEnRol | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        activo: true,
        createdAt: true,
      },
    });
  }

  async cambiarEstado(id: number, activo: boolean): Promise<UsuarioEnRol> {
    return this.prisma.user.update({
      where: { id },
      data: { activo },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        activo: true,
        createdAt: true,
      },
    });
  }
}
