import { ErrorNegocio, RolServicio } from '../../../src/servicios/rol.servicio';
import { RolRepositorio } from '../../../src/repositorios/rol.repositorio';
import { PrismaClient } from '@prisma/client';

// Simulamos la clase RolRepositorio para no tocar la BD real
jest.mock('../../../src/repositorios/rol.repositorio');

describe('RolServicio (Pruebas Unitarias)', () => {
    let rolServicio: RolServicio;
    let rolRepositorioMock: jest.Mocked<RolRepositorio>;

    beforeEach(() => {
        jest.clearAllMocks();

        const prismaFake = {} as PrismaClient;
        rolRepositorioMock = new RolRepositorio(prismaFake) as jest.Mocked<RolRepositorio>;
        rolServicio = new RolServicio(rolRepositorioMock);
    });

    describe('obtenerPorId', () => {
        it('debería retornar un rol si el ID existe', async () => {
            const rolSimulado = {
                id: 1,
                nombre: 'adm',
                descripcion: 'Admin',
                estaActivo: true,
                creadoEn: new Date(),
                actualizadoEn: new Date(),
                _count: { usuarios: 0 }
            };
            rolRepositorioMock.obtenerPorId.mockResolvedValue(rolSimulado);

            const resultado = await rolServicio.obtenerPorId(1);

            expect(resultado).toEqual(rolSimulado);
            expect(rolRepositorioMock.obtenerPorId).toHaveBeenCalledWith(1);
        });

        it('debería lanzar ErrorNegocio (404) si el rol no existe', async () => {
            rolRepositorioMock.obtenerPorId.mockResolvedValue(null);

            await expect(rolServicio.obtenerPorId(999)).rejects.toThrow(ErrorNegocio);
        });
    });

    describe('crear', () => {
        const nuevoRolDto = { nombre: 'nuevo_rol', descripcion: 'Test' };

        it('debería crear y retornar el rol si el nombre no existe', async () => {
            rolRepositorioMock.obtenerPorNombre.mockResolvedValue(null);

            const rolCreado = { id: 2, ...nuevoRolDto, estaActivo: true, creadoEn: new Date(), actualizadoEn: new Date() };
            rolRepositorioMock.crear.mockResolvedValue(rolCreado);

            const resultado = await rolServicio.crear(nuevoRolDto);

            expect(resultado).toEqual(rolCreado);
            expect(rolRepositorioMock.crear).toHaveBeenCalledWith(nuevoRolDto);
        });

        it('debería lanzar ErrorNegocio (409) si el nombre del rol ya está en uso', async () => {
            const rolExistente = { id: 1, nombre: 'nuevo_rol', descripcion: '', estaActivo: true, creadoEn: new Date(), actualizadoEn: new Date() };
            rolRepositorioMock.obtenerPorNombre.mockResolvedValue(rolExistente);

            await expect(rolServicio.crear(nuevoRolDto)).rejects.toThrow(ErrorNegocio);
            expect(rolRepositorioMock.crear).not.toHaveBeenCalled();
        });
    });

    describe('actualizar', () => {
        it('debería actualizar y retornar el rol si existe', async () => {
            const rolExistente = { id: 1, nombre: 'adm', descripcion: 'Admin', estaActivo: true, creadoEn: new Date(), actualizadoEn: new Date(), _count: { usuarios: 0 } };
            rolRepositorioMock.obtenerPorId.mockResolvedValue(rolExistente);

            const rolActualizado = { ...rolExistente, descripcion: 'Admin modificado' };
            rolRepositorioMock.actualizar.mockResolvedValue(rolActualizado);

            const resultado = await rolServicio.actualizar(1, { descripcion: 'Admin modificado' });

            expect(resultado).toEqual(rolActualizado);
            expect(rolRepositorioMock.actualizar).toHaveBeenCalledWith(1, { descripcion: 'Admin modificado' });
        });

        it('debería lanzar ErrorNegocio (404) si se intenta actualizar un rol inexistente', async () => {
            rolRepositorioMock.obtenerPorId.mockResolvedValue(null);
            await expect(rolServicio.actualizar(999, { descripcion: 'test' })).rejects.toThrow(ErrorNegocio);
        });
    });

    describe('asignarRol', () => {
        it('debería llamar a asignarAUsuario en el repositorio', async () => {
            const datos = { usuarioId: 1, rolId: 2 };
            rolRepositorioMock.obtenerPorId.mockResolvedValue({ id: 2, nombre: 'rol', descripcion: '', estaActivo: true, creadoEn: new Date(), actualizadoEn: new Date(), _count: { usuarios: 0 } });
            rolRepositorioMock.asignarAUsuario.mockResolvedValue(undefined);

            await rolServicio.asignarRol(datos);

            expect(rolRepositorioMock.asignarAUsuario).toHaveBeenCalledWith(datos);
        });
    });

    describe('obtenerUsuariosDeRol', () => {
        it('debería retornar la lista de usuarios para un rol dado', async () => {
            rolRepositorioMock.obtenerPorId.mockResolvedValue({ id: 2, nombre: 'rol', descripcion: '', estaActivo: true, creadoEn: new Date(), actualizadoEn: new Date(), _count: { usuarios: 0 } });
            const usuariosSimulados = [
                { id: 1, nombre: 'Juan', apellidos: 'Perez', email: 'juan@test.com', estaActivo: true, creadoEn: new Date() }
            ];
            rolRepositorioMock.obtenerUsuariosPorRol.mockResolvedValue(usuariosSimulados);

            const resultado = await rolServicio.obtenerUsuariosDeRol(2);

            expect(resultado).toEqual(usuariosSimulados);
            expect(rolRepositorioMock.obtenerUsuariosPorRol).toHaveBeenCalledWith(2);
        });
    });
});