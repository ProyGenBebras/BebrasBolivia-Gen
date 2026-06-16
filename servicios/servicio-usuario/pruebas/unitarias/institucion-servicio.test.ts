import { crearInstitucionServicio } from '../../src/servicios/institucion-servicio';
import { ErrorNegocio } from '../../src/utilidades/errores';

const institucionEjemplo = {
  id: 'inst-1',
  nombre: 'Colegio Bebras',
  codigo: 'BEB-001',
  esta_activo: true,
  creado_en: new Date(),
  actualizado_en: new Date(),
} as never;

describe('InstitucionServicio', () => {
  it('obtenerPorId devuelve la institución cuando existe', async () => {
    const repositorio = {
      buscarPorId: jest.fn().mockResolvedValue(institucionEjemplo),
      buscarPorCodigo: jest.fn(),
    } as never;
    const servicio = crearInstitucionServicio({ repositorio });

    await expect(servicio.obtenerPorId('inst-1')).resolves.toEqual(institucionEjemplo);
  });

  it('obtenerPorId lanza ErrorNegocio 404 cuando no existe', async () => {
    const repositorio = {
      buscarPorId: jest.fn().mockResolvedValue(null),
      buscarPorCodigo: jest.fn(),
    } as never;
    const servicio = crearInstitucionServicio({ repositorio });

    await expect(servicio.obtenerPorId('inexistente')).rejects.toBeInstanceOf(ErrorNegocio);
    await expect(servicio.obtenerPorId('inexistente')).rejects.toMatchObject({ codigo: 404 });
  });
});
