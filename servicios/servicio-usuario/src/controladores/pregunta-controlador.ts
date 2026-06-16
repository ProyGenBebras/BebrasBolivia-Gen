import type { preguntas } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import { crearPreguntaServicio } from '../servicios/pregunta-servicio';

type PreguntaServicio = ReturnType<typeof crearPreguntaServicio>;

interface PreguntaPublica {
  id: string;
  titulo: string;
  contenido: string;
  categoriaId: string | null;
  dificultad: preguntas['dificultad'];
  puntaje: number;
  explicacion: string | null;
  estaActivo: boolean;
  creadoPor: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

const aRespuestaPublica = (pregunta: preguntas): PreguntaPublica => ({
  id: pregunta.id,
  titulo: pregunta.titulo,
  contenido: pregunta.contenido,
  categoriaId: pregunta.categoria_id,
  dificultad: pregunta.dificultad,
  puntaje: pregunta.puntaje,
  explicacion: pregunta.explicacion,
  estaActivo: pregunta.esta_activo,
  creadoPor: pregunta.creado_por,
  creadoEn: pregunta.creado_en,
  actualizadoEn: pregunta.actualizado_en,
});

interface PreguntaControlador {
  listar(req: Request, res: Response, next: NextFunction): Promise<void>;
  obtener(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const crearPreguntaControlador = (
  servicio: PreguntaServicio = crearPreguntaServicio(),
): PreguntaControlador => ({
  /**
   * GET /api/v1/preguntas
   * Lista las preguntas activas del banco.
   */
  async listar(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lista = await servicio.listarActivas();
      res.status(200).json({ data: lista.map(aRespuestaPublica) });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/preguntas/:id
   * Obtiene una pregunta por su identificador.
   */
  async obtener(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pregunta = await servicio.obtenerPorId(req.params.id);
      res.status(200).json({ data: aRespuestaPublica(pregunta) });
    } catch (error) {
      next(error);
    }
  },
});

export const preguntaControlador = crearPreguntaControlador();
