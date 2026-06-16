import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--fuente-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BebrasBolivia',
  description: 'Plataforma colaborativa BebrasBolivia',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
