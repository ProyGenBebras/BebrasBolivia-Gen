'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Usuario } from '../../dominio/usuario';
import { usuarioApi } from '../../infraestructura/api/usuario.api';

export function GestionUsuarios(): JSX.Element {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [cambiando, setCambiando] = useState<number | null>(null);

  const cargarUsuarios = useCallback((): void => {
    setCargando(true);
    setErrorGlobal(null);
    try {
      // TODO: agregar usuarioApi.listar() cuando el backend lo implemente
      setUsuarios([]);
    } catch {
      setErrorGlobal('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  const toggleEstado = async (id: number, activoActual: boolean): Promise<void> => {
    setCambiando(id);
    try {
      const actualizado = await usuarioApi.cambiarEstado(id, { activo: !activoActual });
      setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
    } catch {
      setErrorGlobal('No se pudo cambiar el estado del usuario.');
    } finally {
      setCambiando(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-slate-500">
            Activa o desactiva el acceso de usuarios a la plataforma
          </p>
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

        {cargando ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : usuarios.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm font-medium text-slate-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Nombre</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Estado</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-600">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {usuario.nombre} {usuario.apellidos}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{usuario.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          usuario.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => void toggleEstado(usuario.id, usuario.activo)}
                        disabled={cambiando === usuario.id}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                          usuario.activo
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {cambiando === usuario.id
                          ? 'Guardando...'
                          : usuario.activo
                            ? 'Desactivar'
                            : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
