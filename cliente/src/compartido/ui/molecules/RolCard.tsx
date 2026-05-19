/*
import { Badge } from '../atoms/Badge';

import type { RolVista } from '@/modulos/Roles/aplicacion/mappers/rol.mapper';

interface RolCardProps {
  rol: RolVista;
  seleccionado: boolean;
  onSeleccionar: (id: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
}

const iconoPorNombre: Record<string, string> = {
  adm: '⬡',
  examinador: '◈',
  participante: '◉',
};

export function RolCard({
  rol,
  seleccionado,
  onSeleccionar,
  onToggleActivo,
}: RolCardProps): JSX.Element {
  const icono = iconoPorNombre[rol.nombre] ?? '◆';
  const variante = rol.nombre as 'adm' | 'examinador' | 'participante';

  return (
    <div
      onClick={() => onSeleccionar(rol.id)}
      className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
        seleccionado
          ? 'border-slate-400 bg-slate-900 shadow-lg shadow-slate-900/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${
              seleccionado ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {icono}
          </span>
          <div>
            <p
              className={`text-sm font-semibold ${seleccionado ? 'text-white' : 'text-slate-900'}`}
            >
              {rol.etiqueta}
            </p>
            <p
              className={`mt-0.5 font-mono text-xs ${seleccionado ? 'text-slate-300' : 'text-slate-400'}`}
            >
              {rol.nombre}
            </p>
          </div>
        </div>
        <Badge
          texto={rol.activo ? 'Activo' : 'Inactivo'}
          variante={rol.activo ? 'activo' : 'inactivo'}
        />
      </div>

      <p
        className={`mt-3 text-xs leading-relaxed ${seleccionado ? 'text-slate-300' : 'text-slate-500'}`}
      >
        {rol.descripcion}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge texto={`${rol.totalUsuarios} usuarios`} variante={variante} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActivo(rol.id, !rol.activo);
          }}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            seleccionado
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {rol.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
}
*/

import { Badge } from '../atoms/Badge';

import type { RolVista } from '@/modulos/Roles/aplicacion/mappers/rol.mapper';

interface RolCardProps {
  rol: RolVista;
  seleccionado: boolean;
  onSeleccionar: (id: number) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
}

const iconoPorNombre: Record<string, string> = {
  administrador: '🛡️',
  coordinador: '🏫',
  profesor: '👨‍🏫',
  estudiante: '🎓',
  adm: '🛡️',
  examinador: '🏫',
  participante: '🎓',
};

function obtenerVarianteRol(
  nombre: string,
): 'administrador' | 'coordinador' | 'profesor' | 'estudiante' | 'neutro' {
  if (nombre === 'administrador' || nombre === 'adm') return 'administrador';
  if (nombre === 'coordinador' || nombre === 'examinador') return 'coordinador';
  if (nombre === 'profesor') return 'profesor';
  if (nombre === 'estudiante' || nombre === 'participante') return 'estudiante';
  return 'neutro';
}

export function RolCard({
  rol,
  seleccionado,
  onSeleccionar,
  onToggleActivo,
}: RolCardProps): JSX.Element {
  const icono = iconoPorNombre[rol.nombre] ?? '👤';
  const variante = obtenerVarianteRol(rol.nombre);

  return (
    <article
      onClick={() => onSeleccionar(rol.id)}
      className={`group cursor-pointer rounded-2xl border p-5 transition ${
        seleccionado
          ? 'border-slate-900 bg-slate-900 shadow-lg'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
              seleccionado ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {icono}
          </span>

          <div>
            <h3 className={`text-sm font-bold ${seleccionado ? 'text-white' : 'text-slate-900'}`}>
              {rol.etiqueta}
            </h3>
            <p className={`mt-1 text-xs ${seleccionado ? 'text-slate-300' : 'text-slate-500'}`}>
              Código: {rol.nombre}
            </p>
          </div>
        </div>

        <Badge
          texto={rol.activo ? 'Activo' : 'Inactivo'}
          variante={rol.activo ? 'activo' : 'inactivo'}
        />
      </div>

      <p
        className={`mt-4 min-h-10 text-sm leading-relaxed ${
          seleccionado ? 'text-slate-200' : 'text-slate-600'
        }`}
      >
        {rol.descripcion}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200/20 pt-4">
        <Badge texto={`${rol.totalUsuarios} usuarios`} variante={variante} />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleActivo(rol.id, !rol.activo);
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            seleccionado
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {rol.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </article>
  );
}