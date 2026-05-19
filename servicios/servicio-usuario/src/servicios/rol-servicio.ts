import { rol_usuario } from '@prisma/client';

import type { CambiarRolDto } from '../dtos/rol.dto.js';
import type { RolRepositorio } from '../repositorios/rol-repositorio.js'; 

export class ErrorNegocio extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = 'ErrorNegocio';
    }
}

export class RolServicio {
    constructor(private readonly rolRepositorio: RolRepositorio) { }

    // Retorna todos los roles posibles para el frontend
    listarRolesDisponibles(): string[] {
        return Object.values(rol_usuario);
    }

    async obtenerUsuariosDeRol(
        rol: string
    ): Promise<{ id: string; nombres: string; apellidos: string; correo: string; rol: rol_usuario }[]> {
        // Validamos que el texto recibido sea un rol válido del ENUM
        if (!Object.values(rol_usuario).includes(rol as rol_usuario)) {
            throw new ErrorNegocio(`El rol '${rol}' no es válido.`, 400);
        }
        return this.rolRepositorio.obtenerUsuariosPorRol(rol as rol_usuario);
    }

    async cambiarRol(
        datos: CambiarRolDto
    ): Promise<{ id: string; nombres: string; correo: string; rol: rol_usuario }> {
        if (!Object.values(rol_usuario).includes(datos.nuevoRol)) {
            throw new ErrorNegocio(`El rol '${datos.nuevoRol}' no es válido.`, 400);
        }

        const usuario = await this.rolRepositorio.verificarUsuarioExiste(datos.usuarioId);
        if (!usuario) {
            throw new ErrorNegocio(`Usuario con id ${datos.usuarioId} no encontrado`, 404);
        }

        return this.rolRepositorio.actualizarRolUsuario(datos.usuarioId, datos.nuevoRol);
    }
}