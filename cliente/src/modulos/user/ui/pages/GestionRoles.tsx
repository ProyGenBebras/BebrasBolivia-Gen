'use client';

import { useCallback, useEffect, useState } from 'react';

import { Badge } from '../../../../compartido/ui/atoms/Badge';
import { RolCard } from '../../../../compartido/ui/molecules/RolCard';
import { TablaAsignacion } from '../../../../compartido/ui/organisms/TablaAsignacion';
import { mapearRolesAVista, type RolVista } from '../../aplicacion/mappers/rol.mapper';
import type { CrearRolPayload, UsuarioResumen } from '../../dominio/rol';
import { rolApi } from '../../infraestructura/api/rol.api';

interface EstadoFormulario {
  abierto: boolean;
  nombre: string;
  descripcion: string;
  enviando: boolean;
  error: string | null;
}

export function GestionRoles(): JSX.Element {
  const [roles, setRoles] = useState<RolVista[]>([]);
  const [rolSeleccionadoId, setRolSeleccionadoId] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioResumen[]>([]);
  const [cargandoRoles, setCargandoRoles] = useState(true);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<EstadoFormulario>({
    abierto: false,
    nombre: '',
    descripcion: '',
    enviando: false,
    error: null,
  });

  const cargarRoles = useCallback(async (): Promise<void> => {
    setCargandoRoles(true);
    setErrorGlobal(null);
    try {
      const data = await rolApi.listar();
      setRoles(mapearRolesAVista(data));
    } catch {
      setErrorGlobal('No se pudieron cargar los roles. Verifica la conexión con el servidor.');
    } finally {
      setCargandoRoles(false);
    }
  }, []);

  const cargarUsuariosDeRol = useCallback(async (rolId: number): Promise<void> => {
    setCargandoUsuarios(true);
    try {
      const data = await rolApi.obtenerUsuarios(rolId);
      setUsuarios(data);
    } catch {
      setUsuarios([]);
    } finally {
      setCargandoUsuarios(false);
    }
  }, []);

  useEffect(() => {
    void cargarRoles();
  }, [cargarRoles]);

  const seleccionarRol = (id: number): void => {
    setRolSeleccionadoId(id);
    void cargarUsuariosDeRol(id);
  };

  const toggleActivo = async (id: number, activo: boolean): Promise<void> => {
    try {
      await rolApi.actualizar(id, { activo });
      await cargarRoles();
    } catch {
      setErrorGlobal('No se pudo actualizar el estado del rol.');
    }
  };

  const asignarRol = async (usuarioId: number, rolId: number): Promise<void> => {
    await rolApi.asignar({ usuarioId, rolId });
    if (rolSeleccionadoId !== null) {
      await cargarUsuariosDeRol(rolSeleccionadoId);
    }
    await cargarRoles();
  };

  const crearRol = async (): Promise<void> => {
    if (!formulario.nombre.trim()) {
      setFormulario((prev) => ({ ...prev, error: 'El nombre del rol es obligatorio' }));
      return;
    }
    setFormulario((prev) => ({ ...prev, enviando: true, error: null }));
    try {
      const payload: CrearRolPayload = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim() || undefined,
      };
      await rolApi.crear(payload);
      await cargarRoles();
      setFormulario({ abierto: false, nombre: '', descripcion: '', enviando: false, error: null });
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al crear el rol';
      setFormulario((prev) => ({ ...prev, enviando: false, error: mensaje }));
    }
  };

  const rolSeleccionado = roles.find((r) => r.id === rolSeleccionadoId) ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Roles</h1>
              <p className="mt-1 text-sm text-slate-500">
                Define los roles del sistema y asigna permisos a los usuarios
              </p>
            </div>
            <button
              onClick={() => setFormulario((prev) => ({ ...prev, abierto: true }))}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo rol
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {errorGlobal && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            {errorGlobal}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Roles del sistema
              </h2>
              <Badge texto={`${roles.length} total`} variante="neutro" />
            </div>

            {cargandoRoles ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {roles.map((rol) => (
                  <RolCard
                    key={rol.id}
                    rol={rol}
                    seleccionado={rolSeleccionadoId === rol.id}
                    onSeleccionar={seleccionarRol}
                    onToggleActivo={(id: number, activo: boolean): void => {
                      void toggleActivo(id, activo);
                    }}
                  />
                ))}
                {roles.length === 0 && (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-sm font-medium text-slate-500">No hay roles creados</p>
                    <p className="text-xs text-slate-400">Crea el primer rol del sistema</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {rolSeleccionado ? (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Usuarios con rol
                  </h2>
                  <Badge
                    texto={rolSeleccionado.etiqueta}
                    variante={rolSeleccionado.nombre as 'adm' | 'examinador' | 'participante'}
                  />
                  <Badge texto={`${rolSeleccionado.totalUsuarios} usuarios`} variante="neutro" />
                </div>
                <TablaAsignacion
                  usuarios={usuarios}
                  roles={roles}
                  rolActualId={rolSeleccionado.id}
                  onAsignar={asignarRol}
                  cargando={cargandoUsuarios}
                />
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                  ◉
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">Selecciona un rol</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Haz clic en un rol para ver y gestionar sus usuarios
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {formulario.abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Crear nuevo rol</h3>
              <button
                onClick={() =>
                  setFormulario({
                    abierto: false,
                    nombre: '',
                    descripcion: '',
                    enviando: false,
                    error: null,
                  })
                }
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nombre del rol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ej. moderador"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  placeholder="Describe las responsabilidades de este rol..."
                  value={formulario.descripcion}
                  onChange={(e) =>
                    setFormulario((prev) => ({ ...prev, descripcion: e.target.value }))
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {formulario.error && (
                <p className="text-xs font-medium text-red-600">{formulario.error}</p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setFormulario({
                    abierto: false,
                    nombre: '',
                    descripcion: '',
                    enviando: false,
                    error: null,
                  })
                }
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => void crearRol()}
                disabled={formulario.enviando}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {formulario.enviando ? 'Creando...' : 'Crear rol'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
