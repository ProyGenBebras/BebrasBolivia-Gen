import type { preguntas } from '@prisma/client';

import {
  crearPreguntaRepositorio,
  preguntaRepositorio,
} from '../repositorios/pregunta-repositorio';
import { ErrorNegocio } from '../utilidades/errores';

type PreguntaRepositorio = ReturnType<typeof crearPreguntaRepositorio>;

interface PreguntaServicioDeps {
  repositorio?: PreguntaRepositorio;
}

export interface PreguntaServicio {
  listarActivas(): Promise<preguntas[]>;
  obtenerPorId(id: string): Promise<preguntas>;
}

/**
 * Lógica de negocio del módulo de preguntas (banco de preguntas).
 * Flujo: Controlador -> Servicio -> Repositorio.
 */
export const crearPreguntaServicio = ({
  repositorio = preguntaRepositorio,
}: PreguntaServicioDeps = {}): PreguntaServicio => ({
  async listarActivas(): Promise<preguntas[]> {
    return repositorio.listarActivas();
  },

  async obtenerPorId(id: string): Promise<preguntas> {
    const pregunta = await repositorio.buscarPorId(id);
    if (!pregunta) {
      throw new ErrorNegocio('Pregunta no encontrada', 404);
    }
    return pregunta;
  },
});

export const preguntaServicio = crearPreguntaServicio();
