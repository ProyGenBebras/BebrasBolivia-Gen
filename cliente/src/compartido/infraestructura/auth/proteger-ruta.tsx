'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import type { Permiso } from './permisos';
import type { RolUsuario } from './roles';
import { tienePermiso } from './validar-permiso';

type Propiedades = {
  rolUsuario?: RolUsuario | null;
  permisoRequerido: Permiso;
  children: React.ReactNode;
};

export function ProtegerRuta({
  rolUsuario,
  permisoRequerido,
  children,
}: Propiedades): React.ReactElement | null {
  const router = useRouter();

  const usuarioNoAutenticado = !rolUsuario;
  const usuarioSinPermiso =
    rolUsuario !== null &&
    rolUsuario !== undefined &&
    !tienePermiso(rolUsuario, permisoRequerido);

  useEffect(() => {
    if (usuarioNoAutenticado) {
      router.push('/acceso-denegado?motivo=no-autenticado');
      return;
    }

    if (usuarioSinPermiso) {
      router.push('/acceso-denegado?motivo=sin-permiso');
    }
  }, [usuarioNoAutenticado, usuarioSinPermiso, router]);

  if (usuarioNoAutenticado || usuarioSinPermiso) {
    return null;
  }

  return <>{children}</>;
}
