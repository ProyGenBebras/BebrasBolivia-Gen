import type { instituciones } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import { crearInstitucionServicio } from '../servicios/institucion-servicio';

type InstitucionServicio = ReturnType<typeof crearInstitucionServicio>;

interface InstitucionPublica {
  id: string;
  nombre: string;
  codigo: string;
  estaActivo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

const aRespuestaPublica = (institucion: instituciones): InstitucionPublica => ({
  id: institucion.id,
  nombre: institucion.nombre,
  codigo: institucion.codigo,
  estaActivo: institucion.esta_activo,
  creadoEn: institucion.creado_en,
  actualizadoEn: institucion.actualizado_en,
});

interface InstitucionControlador {
  obtener(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const crearInstitucionControlador = (
  servicio: InstitucionServicio = crearInstitucionServicio(),
): InstitucionControlador => ({
  /**
   * GET /api/v1/instituciones/:id
   * Obtiene una institución por su identificador.
   */
  async obtener(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const institucion = await servicio.obtenerPorId(req.params.id);
      res.status(200).json({ data: aRespuestaPublica(institucion) });
    } catch (error) {
      next(error);
    }
  },
});

export const institucionControlador = crearInstitucionControlador();
