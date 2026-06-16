'use client';

import { useEffect, useState } from 'react';

import { Badge } from '../../../../compartido/ui/atoms/Badge';
import { SkeletonFilas } from '../../../../compartido/ui/atoms/Skeleton';
import { type Rol, DESCRIPCION_ROL, ETIQUETA_ROL } from '../../dominio/rol';
import { obtenerRoles } from '../../infraestructura/api/roles-api';

type Estado = 'cargando' | 'listo' | 'error';

export default function RolesPage(): React.JSX.Element {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [estado, setEstado] = useState<Estado>('cargando');
  const [mensajeError, setMensajeError] = useState<string>('');

  useEffect(() => {
    obtenerRoles()
      .then((data) => {
        setRoles(data);
        setEstado('listo');
      })
      .catch((error: unknown) => {
        setMensajeError(error instanceof Error ? error.message : 'Error desconocido');
        setEstado('error');
      });
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-tinta-900">Roles</h1>
      <p className="mb-6 text-sm text-tinta-500">
        Roles disponibles en la plataforma (desde el backend).
      </p>

      {estado === 'cargando' && <SkeletonFilas filas={4} />}

      {estado === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          No se pudieron cargar los roles: {mensajeError}
        </div>
      )}

      {estado === 'listo' && (
        <ul className="flex flex-col gap-3">
          {roles.map((rol) => (
            <li
              key={rol}
              className="flex items-center justify-between rounded-2xl border border-tinta-200 bg-white p-4 shadow-suave"
            >
              <div>
                <p className="font-semibold text-tinta-900">{ETIQUETA_ROL[rol]}</p>
                <p className="text-sm text-tinta-500">{DESCRIPCION_ROL[rol]}</p>
              </div>
              <Badge texto={ETIQUETA_ROL[rol]} variante={rol} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
