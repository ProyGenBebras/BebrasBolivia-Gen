import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma';
type Tamano = 'sm' | 'md';

interface BotonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variante?: Variante;
  tamano?: Tamano;
  type?: 'button' | 'submit' | 'reset';
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50';

const variantes: Record<Variante, string> = {
  primario: 'bg-tinta-900 text-white hover:bg-tinta-700',
  secundario: 'border border-tinta-300 text-tinta-700 hover:bg-tinta-100',
  peligro: 'bg-red-600 text-white hover:bg-red-700',
  fantasma: 'text-tinta-600 hover:bg-tinta-100',
};

const tamanos: Record<Tamano, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Boton({
  variante = 'primario',
  tamano = 'md',
  type = 'button',
  className = '',
  ...props
}: BotonProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={`${base} ${variantes[variante]} ${tamanos[tamano]} ${className}`}
      {...props}
    />
  );
}
