import { crearPreguntaServicio } from '../../src/servicios/pregunta-servicio';
import { ErrorNegocio } from '../../src/utilidades/errores';

const preguntaEjemplo = {
  id: 'preg-1',
  titulo: 'Pregunta de prueba',
  contenido: 'Contenido',
  categoria_id: null,
  dificultad: 'facil',
  puntaje: 1,
  explicacion: null,
  esta_activo: true,
  creado_por: null,
  creado_en: new Date(),
  actualizado_en: new Date(),
} as never;

describe('PreguntaServicio', () => {
  it('listarActivas delega en el repositorio', async () => {
    const repositorio = {
      buscarPorId: jest.fn(),
      listarActivas: jest.fn().mockResolvedValue([preguntaEjemplo]),
    } as never;
    const servicio = crearPreguntaServicio({ repositorio });

    await expect(servicio.listarActivas()).resolves.toEqual([preguntaEjemplo]);
  });

  it('obtenerPorId devuelve la pregunta cuando existe', async () => {
    const repositorio = {
      buscarPorId: jest.fn().mockResolvedValue(preguntaEjemplo),
      listarActivas: jest.fn(),
    } as never;
    const servicio = crearPreguntaServicio({ repositorio });

    await expect(servicio.obtenerPorId('preg-1')).resolves.toEqual(preguntaEjemplo);
  });

  it('obtenerPorId lanza ErrorNegocio 404 cuando no existe', async () => {
    const repositorio = {
      buscarPorId: jest.fn().mockResolvedValue(null),
      listarActivas: jest.fn(),
    } as never;
    const servicio = crearPreguntaServicio({ repositorio });

    await expect(servicio.obtenerPorId('inexistente')).rejects.toBeInstanceOf(ErrorNegocio);
    await expect(servicio.obtenerPorId('inexistente')).rejects.toMatchObject({ codigo: 404 });
  });
});
