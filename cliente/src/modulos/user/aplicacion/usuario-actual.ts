'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Usuario } from '../dominio/usuario';
import { obtenerActual } from '../infraestructura/api/auth-api';

import { cerrarSesion, obtenerToken } from './sesion';

export interface EstadoSesion {
  usuario: Usuario | null;
  cargando: boolean;
  recargar: () => void;
}

export function useUsuarioActual(): EstadoSesion {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback((): void => {
    const token = obtenerToken();
    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    obtenerActual(token)
      .then((u) => {
        setUsuario(u);
      })
      .catch(() => {
        cerrarSesion();
        setUsuario(null);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { usuario, cargando, recargar: cargar };
}
