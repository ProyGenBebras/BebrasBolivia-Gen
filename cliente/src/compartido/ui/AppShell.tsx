'use client';

import { LayoutDashboard, LogOut, Menu, ShieldCheck, Upload, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { cerrarSesion } from '../../modulos/user/aplicacion/sesion';
import { useUsuarioActual } from '../../modulos/user/aplicacion/usuario-actual';
import { ETIQUETA_ROL } from '../../modulos/user/dominio/rol';

import { Badge } from './atoms/Badge';

interface ItemNav {
  href: string;
  label: string;
  icono: LucideIcon;
  soloAdmin?: boolean;
}

const ITEMS: ItemNav[] = [
  { href: '/', label: 'Dashboard', icono: LayoutDashboard },
  { href: '/usuarios', label: 'Usuarios', icono: Users },
  { href: '/roles', label: 'Roles', icono: ShieldCheck },
  { href: '/usuarios/carga-masiva', label: 'Carga masiva', icono: Upload, soloAdmin: true },
];

function MarcaBebras({ compacta = false }: { compacta?: boolean }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex items-center justify-center rounded-xl bg-tinta-900 font-bold text-white ${
          compacta ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'
        }`}
      >
        B
      </span>
      {!compacta ? (
        <span className="leading-tight">
          <span className="block text-sm font-bold text-tinta-900">BebrasBolivia</span>
          <span className="block text-[11px] text-tinta-400">Panel de gestión</span>
        </span>
      ) : (
        <span className="text-sm font-bold text-tinta-900">BebrasBolivia</span>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { usuario, cargando } = useUsuarioActual();
  const esAdmin = usuario?.rol === 'administrador';
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const items = ITEMS.filter((item) => !item.soloAdmin || esAdmin);

  const salir = (): void => {
    cerrarSesion();
    router.push('/login');
  };

  const contenidoSidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <MarcaBebras />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const activo = pathname === item.href;
          const Icono = item.icono;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDrawerAbierto(false)}
              aria-current={activo ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                activo
                  ? 'bg-tinta-900 text-white'
                  : 'text-tinta-600 hover:bg-tinta-100 hover:text-tinta-900'
              }`}
            >
              <Icono className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-tinta-200 p-3">
        {cargando ? (
          <div className="px-2 py-1.5 text-xs text-tinta-400">Cargando…</div>
        ) : usuario ? (
          <div className="space-y-2">
            <div className="px-2">
              <p className="truncate text-sm font-semibold text-tinta-900">
                {usuario.nombres} {usuario.apellidos}
              </p>
              <div className="mt-1">
                <Badge texto={ETIQUETA_ROL[usuario.rol]} variante={usuario.rol} />
              </div>
            </div>
            <button
              type="button"
              onClick={salir}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-tinta-600 transition hover:bg-tinta-100 hover:text-tinta-900"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Cerrar sesión
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-tinta-50">
      {/* Sidebar fijo (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-tinta-200 bg-white lg:block">
        {contenidoSidebar}
      </aside>

      {/* Drawer (móvil) */}
      {drawerAbierto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setDrawerAbierto(false)}
            className="absolute inset-0 h-full w-full bg-tinta-900/50"
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            {contenidoSidebar}
          </aside>
        </div>
      )}

      {/* Barra superior (móvil) */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-tinta-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerAbierto(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-1.5 text-tinta-600 transition hover:bg-tinta-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <MarcaBebras compacta />
      </header>

      {/* Contenido */}
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
