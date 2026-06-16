'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { obtenerToken } from '../../modulos/user/aplicacion/sesion';

export function RutaProtegida({ children }: { children: React.ReactNode }): React.JSX.Element {
  const router = useRouter();
  const [listo, setListo] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    if (obtenerToken()) {
      setAutenticado(true);
    } else {
      void router.replace('/login');
    }
    setListo(true);
  }, [router]);

  if (!listo || !autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-tinta-500">Cargando…</p>
      </div>
    );
  }

  return <>{children}</>;
}
