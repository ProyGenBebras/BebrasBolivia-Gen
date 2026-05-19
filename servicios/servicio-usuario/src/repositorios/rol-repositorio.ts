import { PrismaClient, rol_usuario } from '@prisma/client';

export class RolRepositorio {
    constructor(private readonly prisma: PrismaClient) { }

    async obtenerUsuariosPorRol(
        rolBuscado: rol_usuario
    ): Promise<{ id: string; nombres: string; apellidos: string; correo: string; rol: rol_usuario }[]> {
        return this.prisma.usuarios.findMany({
            where: { 
                rol: rolBuscado,
                esta_activo: true 
            },
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                correo: true,
                rol: true
            },
            orderBy: { nombres: 'asc' },
        });
    }

    async actualizarRolUsuario(
        usuarioId: string, 
        nuevoRol: rol_usuario
    ): Promise<{ id: string; nombres: string; correo: string; rol: rol_usuario }> {
        return this.prisma.usuarios.update({
            where: { id: usuarioId },
            data: { 
                rol: nuevoRol,
                actualizado_en: new Date()
            },
            select: {
                id: true,
                nombres: true,
                correo: true,
                rol: true
            }
        });
    }

    async verificarUsuarioExiste(
        usuarioId: string
    ): Promise<{ id: string } | null> {
        return this.prisma.usuarios.findUnique({
            where: { id: usuarioId },
            select: { id: true }
        });
    }
}