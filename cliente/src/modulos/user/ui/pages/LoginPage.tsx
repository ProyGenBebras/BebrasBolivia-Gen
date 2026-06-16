'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Boton } from '../../../../compartido/ui/atoms/Boton';
import { Campo } from '../../../../compartido/ui/atoms/Campo';
import { iniciarSesion } from '../../aplicacion/sesion';
import { login } from '../../infraestructura/api/auth-api';
import { ErrorApi } from '../../infraestructura/api/http';

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = (evento: React.FormEvent): void => {
    evento.preventDefault();
    setError('');
    setCargando(true);

    login(correo.trim().toLowerCase(), contrasena)
      .then(({ token }) => {
        iniciarSesion(token);
        router.push('/');
      })
      .catch((err: unknown) => {
        if (err instanceof ErrorApi) {
          if (err.status === 423) {
            setError(err.message);
          } else {
            setError('Correo o contraseña incorrectos');
          }
        } else {
          setError('Error de conexión. Inténtalo de nuevo.');
        }
      })
      .finally(() => setCargando(false));
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-tinta-50 p-8">
      <div className="w-full max-w-md rounded-2xl border border-tinta-200 bg-white p-8 shadow-suave">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tinta-900 text-base font-bold text-white">
            B
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-tinta-900">BebrasBolivia</h1>
            <p className="text-sm text-tinta-500">Inicia sesión para continuar</p>
          </div>
        </div>

        <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
          <Campo
            etiqueta="Correo electrónico"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            autoComplete="email"
            placeholder="correo@ejemplo.bo"
          />

          <Campo
            etiqueta="Contraseña"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Boton type="submit" disabled={cargando} className="w-full py-3">
            {cargando ? 'Entrando…' : 'Iniciar sesión'}
          </Boton>
        </form>
      </div>
    </main>
  );
}
