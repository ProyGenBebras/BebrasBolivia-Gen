import { ErrorNegocio, RolServicio } from '../../../src/servicios/rol.servicio';
import { RolRepositorio } from '../../../src/repositorios/rol.repositorio';
import { PrismaClient } from '@prisma/client';

// Simulamos la clase RolRepositorio para no tocar la BD real
jest.mock('../../../src/repositorios/rol.repositorio');

describe('RolServicio (Pruebas Unitarias)', () => {
    let rolServicio: RolServicio;
    let rolRepositorioMock: jest.Mocked<RolRepositorio>;

    beforeEach(() => {
        // Limpiamos los mocks antes de cada prueba
        jest.clearAllMocks();
        
        // Inicializamos el Repositorio falso (mock) y el Servicio real
        const prismaFake = {} as PrismaClient;
        rolRepositorioMock = new RolRepositorio(prismaFake) as jest.Mocked<RolRepositorio>;
        rolServicio = new RolServicio(rolRepositorioMock);
    });

    describe('obtenerPorId', () => {
        it('debería retornar un rol si el ID existe', async () => {
            // Definimos qué devolverá el mock
            const rolSimulado = { 
                id: 1, 
                nombre: 'adm', 
                descripcion: 'Admin', 
                activo: true, 
                createdAt: new Date(), 
                updatedAt: new Date(),
                _count: { usuarios: 0 }
            };
            rolRepositorioMock.obtenerPorId.mockResolvedValue(rolSimulado);

            // Ejecutamos el método
            const resultado = await rolServicio.obtenerPorId(1);

            // Verificamos el resultado
            expect(resultado).toEqual(rolSimulado);
            expect(rolRepositorioMock.obtenerPorId).toHaveBeenCalledWith(1);
            expect(rolRepositorioMock.obtenerPorId).toHaveBeenCalledTimes(1);
        });

        it('debería lanzar un ErrorNegocio (404) si el rol no existe', async () => {
            // El mock devuelve null (no encontrado)
            rolRepositorioMock.obtenerPorId.mockResolvedValue(null);

            //Verificamos que lance la excepción esperada
            await expect(rolServicio.obtenerPorId(999)).rejects.toThrow(ErrorNegocio);
            await expect(rolServicio.obtenerPorId(999)).rejects.toMatchObject({
                status: 404,
                message: 'Rol con id 999 no encontrado'
            });
        });
    });

    describe('crear', () => {
        const nuevoRolDto = { nombre: 'nuevo_rol', descripcion: 'Test' };

        it('debería crear y retornar el rol si el nombre no existe', async () => {
            // Simulamos que NO existe en la BD, y luego simulamos la creación
            rolRepositorioMock.obtenerPorNombre.mockResolvedValue(null);
            
            const rolCreado = { id: 2, ...nuevoRolDto, activo: true, createdAt: new Date(), updatedAt: new Date() };
            rolRepositorioMock.crear.mockResolvedValue(rolCreado);

            // Actuar
            const resultado = await rolServicio.crear(nuevoRolDto);

            // Afirmar
            expect(resultado).toEqual(rolCreado);
            expect(rolRepositorioMock.obtenerPorNombre).toHaveBeenCalledWith('nuevo_rol');
            expect(rolRepositorioMock.crear).toHaveBeenCalledWith(nuevoRolDto);
        });

        it('debería lanzar un ErrorNegocio (409) si el nombre del rol ya está en uso', async () => {
            // Simulamos que YA existe un rol con ese nombre en la BD
            const rolExistente = { id: 1, nombre: 'nuevo_rol', descripcion: '', activo: true, createdAt: new Date(), updatedAt: new Date() };
            rolRepositorioMock.obtenerPorNombre.mockResolvedValue(rolExistente);

            // Actuar & Afirmar
            await expect(rolServicio.crear(nuevoRolDto)).rejects.toThrow(ErrorNegocio);
            await expect(rolServicio.crear(nuevoRolDto)).rejects.toMatchObject({
                status: 409,
                message: "El rol 'nuevo_rol' ya existe"
            });
            // Verificamos que el repositorio nunca intentó crear el registro
            expect(rolRepositorioMock.crear).not.toHaveBeenCalled();
        });
    });
});