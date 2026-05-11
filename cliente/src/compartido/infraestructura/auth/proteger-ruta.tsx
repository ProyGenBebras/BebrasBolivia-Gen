'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Permiso } from './permisos';
import { RolUsuario } from './roles';
import { tienePermiso } from './validar-permiso';

type Propiedades = {
  rolUsuario?: RolUsuario;
  permisoRequerido: Permiso;
  children: React.ReactNode;
};

export function ProtegerRuta({ rolUsuario, permisoRequerido, children }: Propiedades) {
  const router = useRouter();

  useEffect(() => {
    if (!rolUsuario) {
      router.push('/login');
      return;
    }

    if (!tienePermiso(rolUsuario, permisoRequerido)) {
      router.push('/acceso-denegado');
    }
  }, [rolUsuario, permisoRequerido, router]);

  if (!rolUsuario) return null;

  if (!tienePermiso(rolUsuario, permisoRequerido)) return null;

  return <>{children}</>;
}
