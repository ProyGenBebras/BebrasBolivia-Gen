import { RolUsuario } from '@prisma/client';
import prisma from '../config/db';

export class UsuarioService {
  static async obtenerRolUsuario(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, email: true, rol: true },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario;
  }

  static async cambiarRol(id: string, nuevoRol: RolUsuario, datosAdicionales: any) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuario.email === process.env.ROOT_ADMIN_EMAIL) {
      throw new Error('No se puede modificar el rol del administrador principal');
    }
    // Regla: no dejar el sistema sin administradores
    if (usuario.rol === RolUsuario.administrador && nuevoRol !== RolUsuario.administrador) {
      const totalAdmins = await prisma.usuario.count({
        where: { rol: RolUsuario.administrador }
      });
      if (totalAdmins <= 1) {
        throw new Error('No se puede quitar el rol al último administrador del sistema');
      }
    }

    if (usuario.rol === nuevoRol) {
      return usuario;
    }

    // Validaciones roles estudiante y profesoe
    if (nuevoRol === RolUsuario.estudiante) {
      if (datosAdicionales.grado === undefined || !datosAdicionales.seccion) {
        throw new Error('Faltan datos requeridos para el rol de estudiante (grado, seccion)');
      }
    } else if (nuevoRol === RolUsuario.profesor) {
    }

    // Ejecutar actualización en transacción prisma
    await prisma.$transaction(async (tx) => {
      // 1. Limpiar extensiones viejas si es necesario, tipo si el estudiante se cambia a profesor
      if (usuario.rol === RolUsuario.estudiante) {
        await tx.estudiante.delete({ where: { usuarioId: id } }).catch(() => { });
      } else if (usuario.rol === RolUsuario.profesor) {
        await tx.profesor.delete({ where: { usuarioId: id } }).catch(() => { });
      }

      // 2. Crear/Actualizar nueva extensión
      if (nuevoRol === RolUsuario.estudiante) {
        await tx.estudiante.upsert({
          where: { usuarioId: id },
          update: {
            grado: datosAdicionales.grado,
            seccion: datosAdicionales.seccion,
            institucionId: datosAdicionales.institucion_id || null,
          },
          create: {
            usuarioId: id,
            grado: datosAdicionales.grado,
            seccion: datosAdicionales.seccion,
            institucionId: datosAdicionales.institucion_id || null,
          },
        });
      } else if (nuevoRol === RolUsuario.profesor) {
        await tx.profesor.upsert({
          where: { usuarioId: id },
          update: {
            especialidad: datosAdicionales.especialidad || null,
            institucionId: datosAdicionales.institucion_id || null,
          },
          create: {
            usuarioId: id,
            especialidad: datosAdicionales.especialidad || null,
            institucionId: datosAdicionales.institucion_id || null,
          },
        });
      }

      // 3. Actualizar el rol en la tabla principal
      await tx.usuario.update({
        where: { id },
        data: { rol: nuevoRol },
      });
    });

    return { ...usuario, rol: nuevoRol };
  }
}
