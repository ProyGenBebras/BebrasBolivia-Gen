import { PrismaClient, rol_usuario } from '@prisma/client';

import type { ActualizarRolDto, AsignarRolDto, CrearRolDto } from '../dtos/rol.dto.js';
import type { Rol, RolConUsuarios, UsuarioEnRol } from '../modelos/rol.modelo.js';

const ROL_ID: Record<rol_usuario, number> = {
  administrador: 1,
  coordinador: 2,
  profesor: 3,
  estudiante: 4,
};

const ID_ROL: Record<number, rol_usuario> = Object.fromEntries(
  Object.entries(ROL_ID).map(([k, v]) => [v, k as rol_usuario])
) as Record<number, rol_usuario>;

function enumARol(valor: rol_usuario, count = 0): RolConUsuarios {
  return {
    id: ROL_ID[valor],
    nombre: valor,
    descripcion: null,
    activo: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    _count: { usuarios: count },
  };
}

export class RolRepositorio {
  constructor(private readonly prisma: PrismaClient) {}

  async obtenerTodos(): Promise<RolConUsuarios[]> {
    const conteos = await this.prisma.usuarios.groupBy({
      by: ['rol'],
      _count: { id: true },
    });
    const mapaConteo = Object.fromEntries(
      conteos.map((c) => [c.rol, c._count.id])
    );
    return Object.values(rol_usuario).map((valor) =>
      enumARol(valor, mapaConteo[valor] ?? 0)
    );
  }

  async obtenerPorId(id: number): Promise<RolConUsuarios | null> {
    const valor = ID_ROL[id];
    if (!valor) return null;
    const count = await this.prisma.usuarios.count({ where: { rol: valor } });
    return enumARol(valor, count);
  }

  async obtenerPorNombre(nombre: string): Promise<Rol | null> {
    const valor = nombre as rol_usuario;
    if (!Object.values(rol_usuario).includes(valor)) return null;
    return enumARol(valor);
  }

  async crear(_datos: CrearRolDto): Promise<Rol> {
    throw new Error('Los roles son valores fijos del sistema y no pueden crearse.');
  }

  async actualizar(id: number, datos: ActualizarRolDto): Promise<Rol> {
    const rol = await this.obtenerPorId(id);
    if (!rol) throw new Error(`Rol con id ${id} no encontrado`);
    return { ...rol, ...datos };
  }

  async asignarAUsuario(datos: AsignarRolDto): Promise<void> {
    const valor = ID_ROL[datos.rolId];
    if (!valor) throw new Error(`Rol con id ${datos.rolId} no encontrado`);
    await this.prisma.usuarios.update({
      where: { id: String(datos.usuarioId) },
      data: { rol: valor },
    });
  }

  async obtenerUsuariosPorRol(rolId: number): Promise<UsuarioEnRol[]> {
    const valor = ID_ROL[rolId];
    if (!valor) return [];
    const usuarios = await this.prisma.usuarios.findMany({
      where: { rol: valor },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        esta_activo: true,
        creado_en: true,
      },
      orderBy: { nombres: 'asc' },
    });
    return usuarios.map((u) => ({
      id: Number(u.id),
      nombre: u.nombres,
      apellidos: u.apellidos,
      email: u.correo,
      activo: u.esta_activo,
      createdAt: u.creado_en,
    }));
  }
}
