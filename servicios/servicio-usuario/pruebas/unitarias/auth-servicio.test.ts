import type { usuarios } from '@prisma/client';

import { crearAuthServicio } from '../../src/servicios/auth-servicio';

// JWT_SECRET requerido por jwt.ts
process.env.JWT_SECRET = 'test-secret-para-pruebas-unitarias';
process.env.JWT_EXPIRACION = '15m';

const usuarioBase: usuarios = {
  id: '00000000-0000-0000-0000-000000000001',
  correo: 'admin@bebras.bo',
  nombre_usuario: 'admin',
  contrasena_hash: '$2b$10$hash_simulado',
  rol: 'administrador',
  nombres: 'Administrador',
  apellidos: 'General',
  esta_activo: true,
  esta_verificado: true,
  intentos_fallidos: 0,
  bloqueado_hasta: null,
  ultimo_acceso_en: null,
  ultimo_acceso_ip: null,
  telefono: null,
  creado_en: new Date('2024-01-01'),
  actualizado_en: new Date('2024-01-01'),
};

const repositorioDoble = {
  buscarPorCorreo: jest.fn(),
  buscarPorId: jest.fn(),
  registrarIntentoFallido: jest.fn().mockResolvedValue(usuarioBase),
  registrarLoginExitoso: jest.fn().mockResolvedValue(usuarioBase),
  crear: jest.fn(),
  buscarPorCorreoExcluyendo: jest.fn(),
  actualizarPerfil: jest.fn(),
  listar: jest.fn(),
  eliminar: jest.fn(),
  actualizarEstadoActivo: jest.fn(),
};

const hasheadorDoble = {
  hashear: jest.fn(),
  comparar: jest.fn(),
};

const servicio = crearAuthServicio({
  repositorio: repositorioDoble,
  hasheador: hasheadorDoble,
});

beforeEach(() => jest.clearAllMocks());

describe('auth-servicio — login', () => {
  it('debería devolver token y usuario cuando las credenciales son correctas', async () => {
    repositorioDoble.buscarPorCorreo.mockResolvedValue(usuarioBase);
    hasheadorDoble.comparar.mockResolvedValue(true);

    const resultado = await servicio.login({ correo: 'admin@bebras.bo', contrasena: 'Hol@12345' });

    expect(resultado.token).toBeDefined();
    expect(resultado.usuario.correo).toBe('admin@bebras.bo');
    expect(resultado.usuario).not.toHaveProperty('contrasena_hash');
    expect(repositorioDoble.registrarLoginExitoso).toHaveBeenCalledWith(usuarioBase.id, undefined);
  });

  it('debería lanzar 401 cuando el correo no existe', async () => {
    repositorioDoble.buscarPorCorreo.mockResolvedValue(null);

    await expect(
      servicio.login({ correo: 'noexiste@bebras.bo', contrasena: 'cualquier' }),
    ).rejects.toMatchObject({ codigo: 401 });
  });

  it('debería lanzar 401 cuando la contraseña es incorrecta y registrar intento fallido', async () => {
    repositorioDoble.buscarPorCorreo.mockResolvedValue(usuarioBase);
    hasheadorDoble.comparar.mockResolvedValue(false);

    await expect(
      servicio.login({ correo: 'admin@bebras.bo', contrasena: 'mala' }),
    ).rejects.toMatchObject({ codigo: 401 });

    expect(repositorioDoble.registrarIntentoFallido).toHaveBeenCalledWith(usuarioBase.id);
  });

  it('debería lanzar 401 cuando el usuario está inactivo', async () => {
    repositorioDoble.buscarPorCorreo.mockResolvedValue({ ...usuarioBase, esta_activo: false });

    await expect(
      servicio.login({ correo: 'admin@bebras.bo', contrasena: 'Hol@12345' }),
    ).rejects.toMatchObject({ codigo: 401 });
  });

  it('debería lanzar 423 cuando la cuenta está bloqueada', async () => {
    const bloqueadoHasta = new Date(Date.now() + 10 * 60 * 1000);
    repositorioDoble.buscarPorCorreo.mockResolvedValue({
      ...usuarioBase,
      bloqueado_hasta: bloqueadoHasta,
    });

    await expect(
      servicio.login({ correo: 'admin@bebras.bo', contrasena: 'Hol@12345' }),
    ).rejects.toMatchObject({ codigo: 423 });

    expect(hasheadorDoble.comparar).not.toHaveBeenCalled();
  });
});

describe('auth-servicio — obtenerActual', () => {
  it('debería devolver el usuario sin datos sensibles', async () => {
    repositorioDoble.buscarPorId.mockResolvedValue(usuarioBase);

    const resultado = await servicio.obtenerActual(usuarioBase.id);

    expect(resultado.id).toBe(usuarioBase.id);
    expect(resultado).not.toHaveProperty('contrasena_hash');
  });

  it('debería lanzar 401 cuando el usuario no existe', async () => {
    repositorioDoble.buscarPorId.mockResolvedValue(null);

    await expect(servicio.obtenerActual('id-inexistente')).rejects.toMatchObject({ codigo: 401 });
  });
});
