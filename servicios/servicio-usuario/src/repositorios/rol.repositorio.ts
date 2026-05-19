import { PrismaClient } from '@prisma/client';

import type { ActualizarRolDto, AsignarRolDto, CrearRolDto } from '../dtos/rol.dto.js';
import type { Rol, RolConUsuarios, UsuarioEnRol } from '../modelos/rol.modelo.js';

export class RolRepositorio {
  constructor(private readonly prisma: PrismaClient) {}

  async obtenerTodos(): Promise<RolConUsuarios[]> {
    return this.prisma.rol.findMany({
      include: {
        _count: {
          select: { usuarios: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async obtenerPorId(id: number): Promise<RolConUsuarios | null> {
    return this.prisma.rol.findUnique({
      where: { id },
      include: {
        _count: {
          select: { usuarios: true },
        },
      },
    });
  }

  async obtenerPorNombre(nombre: string): Promise<Rol | null> {
    return this.prisma.rol.findUnique({ where: { nombre } });
  }

  async crear(datos: CrearRolDto): Promise<Rol> {
    return this.prisma.rol.create({ data: datos });
  }

  async actualizar(id: number, datos: ActualizarRolDto): Promise<Rol> {
    return this.prisma.rol.update({ where: { id }, data: datos });
  }

  async asignarAUsuario(datos: AsignarRolDto): Promise<void> {
    await this.prisma.user.update({
      where: { id: datos.usuarioId },
      data: { rolId: datos.rolId },
    });
  }

  async obtenerUsuariosPorRol(rolId: number): Promise<UsuarioEnRol[]> {
    return this.prisma.user.findMany({
      where: { rolId },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        activo: true,
        createdAt: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }
}
