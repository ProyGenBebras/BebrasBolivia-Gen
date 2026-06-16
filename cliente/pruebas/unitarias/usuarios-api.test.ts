import { describe, expect, it, jest, afterEach } from '@jest/globals';

import { ErrorApi } from '../../src/modulos/user/infraestructura/api/http';
import {
  actualizarUsuario,
  cambiarEstado,
  cambiarRol,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
} from '../../src/modulos/user/infraestructura/api/usuarios-api';

const usuarioEjemplo = {
  id: '00000000-0000-0000-0000-000000000001',
  correo: 'admin@bebras.bo',
  nombres: 'Administrador',
  apellidos: 'General',
  rol: 'administrador',
  nombreUsuario: 'admin',
  telefono: null,
  estaActivo: true,
  estaVerificado: true,
  creadoEn: '2026-06-03T00:00:00.000Z',
  actualizadoEn: '2026-06-03T00:00:00.000Z',
};

const paginacionEjemplo = { page: 1, limit: 10, total: 1, totalPages: 1 };
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.test.token';
const ID = '00000000-0000-0000-0000-000000000001';

const mockOk = (body: unknown) =>
  jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  });

const mockError = (status: number, errorMsg: string) =>
  jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: errorMsg, status }),
  });

afterEach(() => {
  jest.restoreAllMocks();
});

// ─── listarUsuarios ───────────────────────────────────────────────────────────

describe('listarUsuarios', () => {
  it('devuelve usuarios y paginación cuando la respuesta es correcta', async () => {
    global.fetch = mockOk({ data: [usuarioEjemplo], paginacion: paginacionEjemplo });

    const resultado = await listarUsuarios({ token: TOKEN });

    expect(resultado.data).toHaveLength(1);
    expect(resultado.paginacion).toEqual(paginacionEjemplo);
  });

  it('envía token y parámetros de paginación', async () => {
    const fetchMock = mockOk({ data: [], paginacion: paginacionEjemplo });
    global.fetch = fetchMock as unknown as typeof fetch;

    await listarUsuarios({ page: 2, limit: 5, token: TOKEN });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/usuarios?page=2&limit=5');
    expect(init.headers).toMatchObject({ Authorization: `Bearer ${TOKEN}` });
  });

  it('incluye filtros de rol y estado en la URL cuando se proporcionan', async () => {
    const fetchMock = mockOk({ data: [], paginacion: paginacionEjemplo });
    global.fetch = fetchMock as unknown as typeof fetch;

    await listarUsuarios({ rol: 'estudiante', estaActivo: true, token: TOKEN });

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('rol=estudiante');
    expect(url).toContain('estaActivo=true');
  });

  it('lanza ErrorApi con status 401 cuando no hay token', async () => {
    global.fetch = mockError(401, 'No autenticado') as unknown as typeof fetch;

    await expect(listarUsuarios({ token: null })).rejects.toBeInstanceOf(ErrorApi);
    await expect(listarUsuarios({ token: null })).rejects.toMatchObject({ status: 401 });
  });
});

// ─── crearUsuario ─────────────────────────────────────────────────────────────

describe('crearUsuario', () => {
  const payload = {
    correo: 'nuevo@bebras.bo',
    nombres: 'Nuevo',
    apellidos: 'Usuario',
    contrasena: 'Segura123',
    rol: 'estudiante' as const,
  };

  it('devuelve el usuario creado en respuesta 201', async () => {
    global.fetch = mockOk({ data: { ...usuarioEjemplo, correo: payload.correo } });

    const resultado = await crearUsuario(payload, TOKEN);

    expect(resultado.correo).toBe(payload.correo);
  });

  it('envía POST con el body correcto', async () => {
    const fetchMock = mockOk({ data: usuarioEjemplo });
    global.fetch = fetchMock as unknown as typeof fetch;

    await crearUsuario(payload, TOKEN);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/usuarios');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(payload));
  });

  it('lanza ErrorApi 409 cuando el correo ya existe', async () => {
    global.fetch = mockError(409, 'El correo ya esta registrado') as unknown as typeof fetch;

    await expect(crearUsuario(payload, TOKEN)).rejects.toMatchObject({
      status: 409,
      message: 'El correo ya esta registrado',
    });
  });
});

// ─── actualizarUsuario ────────────────────────────────────────────────────────

describe('actualizarUsuario', () => {
  const payload = { nombres: 'Juan', apellidos: 'Perez', correo: 'juan@bebras.bo' };

  it('devuelve el usuario actualizado', async () => {
    global.fetch = mockOk({ data: { ...usuarioEjemplo, nombres: 'Juan' } });

    const resultado = await actualizarUsuario(ID, payload, TOKEN);

    expect(resultado.nombres).toBe('Juan');
  });

  it('envía PATCH a la URL correcta', async () => {
    const fetchMock = mockOk({ data: usuarioEjemplo });
    global.fetch = fetchMock as unknown as typeof fetch;

    await actualizarUsuario(ID, payload, TOKEN);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(`/usuarios/${ID}`);
    expect(init.method).toBe('PATCH');
  });
});

// ─── eliminarUsuario ──────────────────────────────────────────────────────────

describe('eliminarUsuario', () => {
  it('resuelve sin valor cuando la eliminación es exitosa', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;

    await expect(eliminarUsuario(ID, TOKEN)).resolves.toBeUndefined();
  });

  it('lanza ErrorApi 403 cuando el solicitante no es admin', async () => {
    global.fetch = mockError(403, 'No tiene permisos') as unknown as typeof fetch;

    await expect(eliminarUsuario(ID, TOKEN)).rejects.toMatchObject({ status: 403 });
  });
});

// ─── cambiarEstado ────────────────────────────────────────────────────────────

describe('cambiarEstado', () => {
  it('envía PATCH a /estado con el booleano correcto', async () => {
    const fetchMock = mockOk({ data: { ...usuarioEjemplo, estaActivo: false } });
    global.fetch = fetchMock as unknown as typeof fetch;

    const resultado = await cambiarEstado(ID, false, TOKEN);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(`/usuarios/${ID}/estado`);
    expect(init.body).toBe(JSON.stringify({ estaActivo: false }));
    expect(resultado.estaActivo).toBe(false);
  });
});

// ─── cambiarRol ───────────────────────────────────────────────────────────────

describe('cambiarRol', () => {
  it('devuelve el usuario con el nuevo rol', async () => {
    global.fetch = mockOk({
      data: { id: ID, correo: 'admin@bebras.bo', rol: 'coordinador' },
    });

    const resultado = await cambiarRol(ID, 'coordinador', TOKEN);

    expect(resultado.rol).toBe('coordinador');
  });

  it('lanza ErrorApi 400 al intentar dejar el sistema sin admins', async () => {
    global.fetch = mockError(
      400,
      'No se puede quitar el rol al último administrador del sistema',
    ) as unknown as typeof fetch;

    await expect(cambiarRol(ID, 'estudiante', TOKEN)).rejects.toMatchObject({
      status: 400,
      message: 'No se puede quitar el rol al último administrador del sistema',
    });
  });
});
