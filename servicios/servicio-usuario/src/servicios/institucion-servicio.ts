import type { instituciones } from '@prisma/client';

import {
  crearInstitucionRepositorio,
  institucionRepositorio,
} from '../repositorios/institucion-repositorio';
import { ErrorNegocio } from '../utilidades/errores';

type InstitucionRepositorio = ReturnType<typeof crearInstitucionRepositorio>;

interface InstitucionServicioDeps {
  repositorio?: InstitucionRepositorio;
}

export interface InstitucionServicio {
  obtenerPorId(id: string): Promise<instituciones>;
}

/**
 * Lógica de negocio del módulo de instituciones.
 * Flujo: Controlador -> Servicio -> Repositorio.
 */
export const crearInstitucionServicio = ({
  repositorio = institucionRepositorio,
}: InstitucionServicioDeps = {}): InstitucionServicio => ({
  async obtenerPorId(id: string): Promise<instituciones> {
    const institucion = await repositorio.buscarPorId(id);
    if (!institucion) {
      throw new ErrorNegocio('Institución no encontrada', 404);
    }
    return institucion;
  },
});

export const institucionServicio = crearInstitucionServicio();
