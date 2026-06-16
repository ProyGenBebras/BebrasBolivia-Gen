interface BadgeProps {
  texto: string;
  variante?:
    | 'activo'
    | 'inactivo'
    | 'administrador'
    | 'coordinador'
    | 'profesor'
    | 'estudiante'
    | 'neutro';
}

const estilosPorVariante: Record<NonNullable<BadgeProps['variante']>, string> = {
  activo: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  inactivo: 'bg-red-100 text-red-700 ring-1 ring-red-200',
  administrador: 'bg-violet-100 text-violet-800 ring-1 ring-violet-200',
  coordinador: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200',
  profesor: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  estudiante: 'bg-teal-100 text-teal-800 ring-1 ring-teal-200',
  neutro: 'bg-tinta-100 text-tinta-700 ring-1 ring-tinta-200',
};

export function Badge({ texto, variante = 'neutro' }: BadgeProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${estilosPorVariante[variante]}`}
    >
      {texto}
    </span>
  );
}
