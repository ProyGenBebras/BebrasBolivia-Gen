import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  etiqueta?: string;
  children: React.ReactNode;
}

export function Select({
  etiqueta,
  className = '',
  children,
  ...props
}: SelectProps): React.JSX.Element {
  const control = (
    <select
      className={`rounded-lg border border-tinta-300 bg-white px-3 py-2 text-sm text-tinta-700 transition focus:outline-none focus:ring-2 focus:ring-tinta-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  );

  if (!etiqueta) return control;

  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-tinta-700">
      {etiqueta}
      {control}
    </label>
  );
}
