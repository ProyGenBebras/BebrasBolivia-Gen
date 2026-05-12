import { CargaMasivaServicio } from '../../src/servicios/carga-masiva.servicio.js';
import type { UsuarioCargaMasivaRepositorio, ParseadorArchivo } from '../../src/servicios/carga-masiva.servicio.js';

const crearRepositorioMock = (): jest.Mocked<UsuarioCargaMasivaRepositorio> => ({
  buscarPorEmail: jest.fn().mockResolvedValue(false),
  crearMasivo: jest.fn().mockResolvedValue(undefined),
});

const crearParseadorMock = (filas: unknown[]): ParseadorArchivo => ({
  parsear: jest.fn().mockReturnValue(filas),
});

describe('CargaMasivaServicio', () => {
  let repositorioMock: jest.Mocked<UsuarioCargaMasivaRepositorio>;

  beforeEach(() => {
    repositorioMock = crearRepositorioMock();
  });

  describe('procesarArchivo', () => {
    it('debe retornar exitosos cuando los datos son validos', async () => {
      // Arrange
      const parseadorMock = crearParseadorMock([
        { nombre: 'Ana', apellidos: 'Lopez', email: 'ana@test.com', rolId: 1 },
      ]);
      const servicio = new CargaMasivaServicio(repositorioMock, parseadorMock);

      // Act
      const resultado = await servicio.procesarArchivo(Buffer.from(''));

      // Assert
      expect(resultado.exitosos).toBe(1);
      expect(resultado.errores).toHaveLength(0);
      expect(repositorioMock.crearMasivo).toHaveBeenCalledTimes(1);
    });

    it('debe registrar error de fila cuando los datos son invalidos', async () => {
      // Arrange
      const parseadorMock = crearParseadorMock([
        { nombre: '', apellidos: '', email: 'no-es-email', rolId: 1 },
      ]);
      const servicio = new CargaMasivaServicio(repositorioMock, parseadorMock);

      // Act
      const resultado = await servicio.procesarArchivo(Buffer.from(''));

      // Assert
      expect(resultado.exitosos).toBe(0);
      expect(resultado.errores[0].fila).toBe(2);
      expect(repositorioMock.crearMasivo).not.toHaveBeenCalled();
    });

    it('debe registrar error de fila cuando el email ya esta registrado', async () => {
      // Arrange
      repositorioMock.buscarPorEmail.mockResolvedValue(true);
      const parseadorMock = crearParseadorMock([
        { nombre: 'Ana', apellidos: 'Lopez', email: 'ana@test.com', rolId: 1 },
      ]);
      const servicio = new CargaMasivaServicio(repositorioMock, parseadorMock);

      // Act
      const resultado = await servicio.procesarArchivo(Buffer.from(''));

      // Assert
      expect(resultado.errores[0].motivo).toBe('El email ya esta registrado');
      expect(repositorioMock.crearMasivo).not.toHaveBeenCalled();
    });

    it('debe lanzar error cuando el archivo esta vacio', async () => {
      // Arrange
      const parseadorMock = crearParseadorMock([]);
      const servicio = new CargaMasivaServicio(repositorioMock, parseadorMock);

      // Act & Assert
      await expect(servicio.procesarArchivo(Buffer.from(''))).rejects.toThrow('El archivo no contiene datos');
    });

    it('debe procesar filas validas e invalidas en el mismo archivo', async () => {
      // Arrange
      const parseadorMock = crearParseadorMock([
        { nombre: 'Ana', apellidos: 'Lopez', email: 'ana@test.com', rolId: 1 },
        { nombre: '', apellidos: '', email: 'no-es-email', rolId: 1 },
      ]);
      const servicio = new CargaMasivaServicio(repositorioMock, parseadorMock);

      // Act
      const resultado = await servicio.procesarArchivo(Buffer.from(''));

      // Assert
      expect(resultado.exitosos).toBe(1);
      expect(resultado.errores).toHaveLength(1);
      expect(resultado.errores[0].fila).toBe(3);
    });
  });
});