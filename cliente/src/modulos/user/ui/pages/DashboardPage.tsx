'use client';

import { ArrowRight, ShieldCheck, UserCheck, Users, UserX, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '../../../../compartido/ui/atoms/Badge';
import { Skeleton } from '../../../../compartido/ui/atoms/Skeleton';
import { cerrarSesion, obtenerToken } from '../../aplicacion/sesion';
import { useUsuarioActual } from '../../aplicacion/usuario-actual';
import type { Rol } from '../../dominio/rol';
import { ETIQUETA_ROL } from '../../dominio/rol';
import { ErrorApi } from '../../infraestructura/api/http';
import { listarUsuarios } from '../../infraestructura/api/usuarios-api';

const ROLES: Rol[] = ['administrador', 'coordinador', 'profesor', 'estudiante'];

interface Metricas {
  total: number;
  activos: number;
  inactivos: number;
  porRol: Record<Rol, number>;
}

type Estado = 'cargando' | 'listo' | 'error';

// ─── Sub-componentes ────────────────────────────────────────────────────────

function TarjetaKpi({
  etiqueta,
  valor,
  icono: Icono,
  sub,
}: {
  etiqueta: string;
  valor: number;
  icono: LucideIcon;
  sub?: string;
}): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-tinta-200 bg-white p-5 shadow-suave">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-tinta-500">{etiqueta}</p>
        <Icono className="h-4 w-4 text-tinta-400" />
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-tinta-900">{valor}</p>
      {sub ? <p className="mt-1 text-xs text-tinta-400">{sub}</p> : null}
    </div>
  );
}

function AccesoRapido({
  href,
  titulo,
  descripcion,
  icono: Icono,
}: {
  href: string;
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-tinta-200 bg-white p-5 shadow-suave transition hover:border-tinta-300 hover:bg-tinta-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tinta-900 text-white">
        <Icono className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-tinta-900">{titulo}</span>
        <span className="block truncate text-xs text-tinta-500">{descripcion}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-tinta-400 transition group-hover:translate-x-0.5 group-hover:text-tinta-900" />
    </Link>
  );
}

// ─── Página ─────────────────────────────────────────────────────────────────

export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();
  const { usuario } = useUsuarioActual();
  const esAdmin = usuario?.rol === 'administrador';

  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [estado, setEstado] = useState<Estado>('cargando');

  const cargar = useCallback(async (): Promise<void> => {
    const token = obtenerToken();
    if (!token) {
      cerrarSesion();
      router.push('/login');
      return;
    }
    setEstado('cargando');
    try {
      const [total, activos, ...porRolArr] = await Promise.all([
        listarUsuarios({ limit: 1, token }).then((r) => r.paginacion.total),
        listarUsuarios({ limit: 1, estaActivo: true, token }).then((r) => r.paginacion.total),
        ...ROLES.map((rol) =>
          listarUsuarios({ limit: 1, rol, token }).then((r) => r.paginacion.total),
        ),
      ]);
      const porRol = ROLES.reduce<Record<Rol, number>>(
        (acc, rol, i) => {
          acc[rol] = porRolArr[i] ?? 0;
          return acc;
        },
        { administrador: 0, coordinador: 0, profesor: 0, estudiante: 0 },
      );
      setMetricas({ total, activos, inactivos: total - activos, porRol });
      setEstado('listo');
    } catch (err) {
      if (err instanceof ErrorApi && err.status === 401) {
        cerrarSesion();
        router.push('/login');
        return;
      }
      setEstado('error');
    }
  }, [router]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-tinta-900">
          Hola{usuario ? `, ${usuario.nombres}` : ''}
        </h1>
        <p className="mt-1 text-sm text-tinta-500">Resumen de la plataforma BebrasBolivia.</p>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {estado === 'cargando' &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}

        {estado === 'error' && (
          <div className="sm:col-span-3 rounded-2xl border border-tinta-200 bg-white p-5 text-sm text-tinta-500">
            No se pudieron cargar las métricas.{' '}
            <button
              type="button"
              onClick={() => void cargar()}
              className="font-semibold text-tinta-900 underline underline-offset-2"
            >
              Reintentar
            </button>
          </div>
        )}

        {estado === 'listo' && metricas && (
          <>
            <TarjetaKpi etiqueta="Total usuarios" valor={metricas.total} icono={Users} />
            <TarjetaKpi
              etiqueta="Activos"
              valor={metricas.activos}
              icono={UserCheck}
              sub={`${metricas.total > 0 ? Math.round((metricas.activos / metricas.total) * 100) : 0}% del total`}
            />
            <TarjetaKpi etiqueta="Inactivos" valor={metricas.inactivos} icono={UserX} />
          </>
        )}
      </section>

      {/* Usuarios por rol */}
      {estado === 'listo' && metricas && (
        <section className="rounded-2xl border border-tinta-200 bg-white p-5 shadow-suave">
          <h2 className="mb-4 text-sm font-semibold text-tinta-700">Usuarios por rol</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ROLES.map((rol) => (
              <li key={rol} className="rounded-xl bg-tinta-50 p-4">
                <p className="text-2xl font-bold tabular-nums text-tinta-900">
                  {metricas.porRol[rol]}
                </p>
                <div className="mt-1">
                  <Badge texto={ETIQUETA_ROL[rol]} variante={rol} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Accesos rápidos */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-tinta-700">Accesos rápidos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AccesoRapido
            href="/usuarios"
            titulo="Usuarios"
            descripcion="Gestiona cuentas, roles y estado"
            icono={Users}
          />
          <AccesoRapido
            href="/roles"
            titulo="Roles"
            descripcion="Consulta los roles del sistema"
            icono={ShieldCheck}
          />
          {esAdmin && (
            <AccesoRapido
              href="/usuarios/carga-masiva"
              titulo="Carga masiva"
              descripcion="Importa usuarios desde .xlsx"
              icono={Upload}
            />
          )}
        </div>
      </section>
    </div>
  );
}
