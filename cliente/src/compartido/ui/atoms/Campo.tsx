import type { InputHTMLAttributes } from 'react';

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta: string;
  requerido?: boolean;
  error?: string;
}

export function Campo({
  etiqueta,
  requerido = false,
  error,
  className = '',
  ...props
}: CampoProps): React.JSX.Element {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-tinta-700">
      <span>
        {etiqueta}
        {requerido && <span className="text-red-500"> *</span>}
      </span>
      <input
        className={`rounded-lg border px-3 py-2 text-tinta-900 transition focus:outline-none focus:ring-2 ${
          error ? 'border-red-300 focus:ring-red-300' : 'border-tinta-300 focus:ring-tinta-400'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
