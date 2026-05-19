import type { NextFunction, Request, Response } from 'express';

import type { ActualizarRolDto, AsignarRolDto, CrearRolDto } from '../dtos/rol.dto.js';
import { ErrorNegocio, RolServicio } from '../servicios/rol.servicio.js';

export class RolControlador {
    constructor(private readonly rolServicio: RolServicio) { }

    listar = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roles = await this.rolServicio.listar();
            res.status(200).json({ data: roles });
        } catch (error) {
            next(error);
        }
    };

    obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const rol = await this.rolServicio.obtenerPorId(id);
            res.status(200).json({ data: rol });
        } catch (error) {
            next(error);
        }
    };

    crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body as Partial<CrearRolDto>;
            if (!body.nombre || typeof body.nombre !== 'string') {
                res.status(400).json({ error: 'El campo nombre es requerido' });
                return;
            }
            const datos: CrearRolDto = {
                nombre: body.nombre.trim().toLowerCase(),
                descripcion: body.descripcion,
            };
            const rol = await this.rolServicio.crear(datos);
            res.status(201).json({ data: rol });
        } catch (error) {
            next(error);
        }
    };

    actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const body = req.body as Partial<ActualizarRolDto>;
            const datos: ActualizarRolDto = {};
            if (body.nombre !== undefined) datos.nombre = body.nombre.trim().toLowerCase();
            if (body.descripcion !== undefined) datos.descripcion = body.descripcion;
            if (body.activo !== undefined) datos.activo = body.activo;

            const rol = await this.rolServicio.actualizar(id, datos);
            res.status(200).json({ data: rol });
        } catch (error) {
            next(error);
        }
    };

    asignarRol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const body = req.body as Partial<AsignarRolDto>;
            if (!body.usuarioId || !body.rolId) {
                res.status(400).json({ error: 'usuarioId y rolId son requeridos' });
                return;
            }
            await this.rolServicio.asignarRol({ usuarioId: body.usuarioId, rolId: body.rolId });
            res.status(200).json({ mensaje: 'Rol asignado correctamente' });
        } catch (error) {
            next(error);
        }
    };

    obtenerUsuarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ error: 'ID inválido' });
                return;
            }
            const usuarios = await this.rolServicio.obtenerUsuariosDeRol(id);
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
        res.status(error.status).json({ error: error.message });
        return;
    }
    next(error);
}