import type {
    ActualizarRolPayload,
    AsignarRolPayload,
    CrearRolPayload,
    Rol,
    UsuarioResumen,
} from '../../dominio/rol';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4102/api/v1';

async function peticion<T>(ruta: string, opciones?: RequestInit): Promise<T> {
    const respuesta = await fetch(`${BASE_URL}${ruta}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opciones,
    });

    if (!respuesta.ok) {
        const cuerpo = (await respuesta.json()) as { error?: string };
        throw new Error(cuerpo.error ?? `Error ${respuesta.status}`);
    }

    const json = (await respuesta.json()) as { data: T };
    return json.data;
}

export const rolApi = {
    listar: (): Promise<Rol[]> => peticion<Rol[]>('/roles'),

    obtenerPorId: (id: number): Promise<Rol> => peticion<Rol>(`/roles/${id}`),

    obtenerUsuarios: (rolId: number): Promise<UsuarioResumen[]> =>
        peticion<UsuarioResumen[]>(`/roles/${rolId}/usuarios`),

    crear: (datos: CrearRolPayload): Promise<Rol> =>
        peticion<Rol>('/roles', { method: 'POST', body: JSON.stringify(datos) }),

    actualizar: (id: number, datos: ActualizarRolPayload): Promise<Rol> =>
        peticion<Rol>(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),

    asignar: (datos: AsignarRolPayload): Promise<void> =>
        peticion<void>('/roles/asignar', { method: 'POST', body: JSON.stringify(datos) }),
};