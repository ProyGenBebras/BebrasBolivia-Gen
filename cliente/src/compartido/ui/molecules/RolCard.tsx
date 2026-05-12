import type { RolVista } from '../../../modulos/user/aplicacion/mappers/rol.mapper';

import { Badge } from '../atoms/Badge';

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

export function RolCard({ rol, seleccionado, onSeleccionar, onToggleActivo }: RolCardProps): JSX.Element {
    const icono = iconoPorNombre[rol.nombre] ?? '◆';
    const variante = rol.nombre as 'adm' | 'examinador' | 'participante';

    return (
        <div
            onClick={() => onSeleccionar(rol.id)}
            className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${seleccionado
                    ? 'border-slate-400 bg-slate-900 shadow-lg shadow-slate-900/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${seleccionado ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
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
                <Badge texto={rol.activo ? 'Activo' : 'Inactivo'} variante={rol.activo ? 'activo' : 'inactivo'} />
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
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${seleccionado
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