'use client';

import { useEffect } from 'react';

interface ModalProps {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
  ancho?: 'sm' | 'md' | 'lg';
}

const anchos = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export function Modal({ titulo, onCerrar, children, ancho = 'md' }: ModalProps): React.JSX.Element {
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', handler);
    return (): void => document.removeEventListener('keydown', handler);
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`w-full ${anchos[ancho]} rounded-2xl border border-tinta-200 bg-white shadow-lg`}
      >
        <div className="flex items-center justify-between border-b border-tinta-100 px-6 py-4">
          <h2 className="text-base font-semibold text-tinta-900">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-1 text-tinta-400 transition hover:bg-tinta-100 hover:text-tinta-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
