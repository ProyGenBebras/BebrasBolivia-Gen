'use client';

import { useState } from 'react';

import type { RolVista } from '../../../modulos/user/aplicacion/mappers/rol.mapper';
import type { UsuarioResumen } from '../../../modulos/user/dominio/rol';

import { Badge } from '../atoms/Badge';

interface TablaAsignacionProps {
    usuarios: UsuarioResumen[];
    roles: RolVista[];
    rolActualId: number;
    onAsignar: (usuarioId: number, rolId: number) => Promise<void>;
    estaCargando: boolean;
}

export function TablaAsignacion({
    usuarios,
    roles,
    rolActualId,
    onAsignar,
    estaCargando,
}: TablaAsignacionProps): JSX.Element {
    const [asignando, setAsignando] = useState<number | null>(null);
    const [busqueda, setBusqueda] = useState('');

    const usuariosFiltrados = usuarios.filter((u) => {
        const termino = busqueda.toLowerCase();
        return (
            u.nombre.toLowerCase().includes(termino) ||
            u.apellidos.toLowerCase().includes(termino) ||
            u.email.toLowerCase().includes(termino)
        );
    });

    const manejarAsignacion = async (usuarioId: number, rolId: number): Promise<void> => {
        setAsignando(usuarioId);
        try {
            await onAsignar(usuarioId, rolId);
        } finally {
            setAsignando(null);
        }
    };

    if (estaCargando) {
        return (
            <div className="flex h-48 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:bg-white"
                />
                <span className="absolute right-3 top-2.5 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
            </div>

            {usuariosFiltrados.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200">
                    <p className="text-sm font-medium text-slate-500">Sin usuarios en este rol</p>
                    <p className="text-xs text-slate-400">Asigna usuarios desde otra sección</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Usuario
                                </th>
                                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Reasignar
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id} className="transition-colors hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {usuario.nombre} {usuario.apellidos}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400 md:hidden">{usuario.email}</p>
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                                        {usuario.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            texto={usuario.activo ? 'Activo' : 'Inactivo'}
                                            variante={usuario.activo ? 'activo' : 'inactivo'}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <select
                                            defaultValue={rolActualId}
                                            disabled={asignando === usuario.id}
                                            onChange={(e) =>
                                                void manejarAsignacion(usuario.id, parseInt(e.target.value, 10))
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none transition focus:border-slate-400 disabled:opacity-50"
                                        >
                                            {roles.map((rol) => (
                                                <option key={rol.id} value={rol.id}>
                                                    {rol.etiqueta}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}