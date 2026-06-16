import type { NextFunction, Request, Response } from 'express';

import { RolServicio } from '../servicios/rol-servicio';
import { ErrorNegocio } from '../utilidades/errores';

export class RolControlador {
    constructor(private readonly rolServicio: RolServicio) { }

    // GET /api/v1/roles
    listarRolesDisponibles = (_req: Request, res: Response, next: NextFunction): void => {
        try {
            // Ya no es asíncrono porque solo devuelve el ENUM
            const roles = this.rolServicio.listarRolesDisponibles();
            res.status(200).json({ data: roles });
        } catch (error) {
            next(error);
        }
    };

    // GET /api/v1/roles/:rol/usuarios (Ej: /api/v1/roles/profesor/usuarios)
    obtenerUsuariosPorRol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const rolParam = req.params.rol;
            if (!rolParam) {
                res.status(400).json({ error: 'El parámetro rol en la URL es requerido' });
                return;
            }
            
            const usuarios = await this.rolServicio.obtenerUsuariosDeRol(rolParam);
            res.status(200).json({ data: usuarios });
        } catch (error) {
            next(error);
        }
    };

}

export function manejarErrorNegocio(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (error instanceof ErrorNegocio) {
        res.status(error.codigo).json({ error: error.message });
        return;
    }
    next(error);
}