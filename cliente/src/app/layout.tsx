import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bebras Bolivia | Plataforma de Gestión',
  description: 'Sistema de administración y evaluación para la competencia Bebras',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
