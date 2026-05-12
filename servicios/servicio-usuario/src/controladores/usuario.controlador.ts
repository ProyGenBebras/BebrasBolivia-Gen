import type { NextFunction, Request, Response } from 'express';
import { ErrorNegocio, UsuarioServicio } from '../servicios/usuario.servicio.js';

export class UsuarioControlador {
    constructor(private readonly usuarioServicio: UsuarioServicio) {}

    cambiarEstado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const { activo } = req.body as { activo?: boolean };
            if (typeof activo !== 'boolean') {
                res.status(400).json({ error: 'El campo activo es requerido y debe ser boolean' });
                return;
            }
            const usuario = await this.usuarioServicio.cambiarEstado(id, activo);
            res.status(200).json({ data: usuario });
        } catch (error) {
            next(error);
        }
    };
}

export function manejarErrorNegocioUsuario(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (error instanceof ErrorNegocio) {
        res.status(error.status).json({ error: error.message });
        return;
    }
    next(error);
}