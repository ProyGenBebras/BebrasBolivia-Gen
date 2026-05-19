'use client';

import { useState, useEffect, useCallback } from 'react';

import { rolApi } from '../../infraestructura/api/rol.api';

import { ROLES_USUARIO, Usuario, RolUsuario } from '@/modulos/Usuarios/dominio/usuario';

export function GestionRoles(): JSX.Element {
  const [rolFiltro, setRolFiltro] = useState<RolUsuario>('estudiante');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  const cargarUsuarios = useCallback(async (): Promise<void> => {
    setCargando(true);
    setError(null);
    try {
      const data = await rolApi.obtenerUsuariosPorRol(rolFiltro);
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuarios');
    } finally {
      setCargando(false);
    }
  }, [rolFiltro]);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  const manejarCambioRol = async (usuarioId: string, nuevoRol: RolUsuario): Promise<void> => {
    setActualizandoId(usuarioId);
    try {
      await rolApi.asignarRol(usuarioId, nuevoRol);
      // Lo quitamos de la tabla actual porque ya no pertenece a este rol
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioId));
      // Podrías usar una tostada (toast) aquí, pero un alert sirve para probar
      alert('¡Rol actualizado con éxito!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cambiar el rol');
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Roles</h1>
          <p className="text-sm text-slate-500">
            Administra los permisos de los usuarios en la plataforma Bebras Bolivia.
          </p>
        </header>

        {/* Filtro superior */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-sm font-medium text-slate-700">Viendo actualmente a los:</label>
          <select
            value={rolFiltro}
            onChange={(e) => setRolFiltro(e.target.value as RolUsuario)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          >
            {ROLES_USUARIO.map((rol) => (
              <option key={rol.valor} value={rol.valor}>
                {rol.etiqueta}s
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de Usuarios */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {cargando ? (
            <div className="p-8 text-center text-sm text-slate-500 animate-pulse">
              Cargando usuarios...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500">{error}</div>
          ) : usuarios.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No hay usuarios con este rol actualmente.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-900">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre completo</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                  <th className="px-4 py-3 font-medium w-48">Cambiar a rol...</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {usuario.nombres} {usuario.apellidos}
                    </td>
                    <td className="px-4 py-3">{usuario.correo}</td>
                    <td className="px-4 py-3">
                      <select
                        value={usuario.rol}
                        disabled={actualizandoId === usuario.id}
                        onChange={(e) =>
                          void manejarCambioRol(usuario.id, e.target.value as RolUsuario)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:opacity-50 cursor-pointer"
                      >
                        {ROLES_USUARIO.map((rol) => (
                          <option key={rol.valor} value={rol.valor}>
                            {rol.etiqueta}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
