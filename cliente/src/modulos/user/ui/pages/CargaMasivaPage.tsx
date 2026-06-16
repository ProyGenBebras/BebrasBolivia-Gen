'use client';

import { ChevronLeft, FileSpreadsheet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import { Boton } from '../../../../compartido/ui/atoms/Boton';
import { cerrarSesion, obtenerToken } from '../../aplicacion/sesion';
import { useUsuarioActual } from '../../aplicacion/usuario-actual';
import { ErrorApi } from '../../infraestructura/api/http';
import type { ResultadoCargaMasiva } from '../../infraestructura/api/usuarios-api';
import { cargaMasiva } from '../../infraestructura/api/usuarios-api';

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Alerta({
  tipo,
  mensaje,
}: {
  tipo: 'exito' | 'error';
  mensaje: string;
}): React.JSX.Element {
  const base = 'rounded-lg border px-4 py-3 text-sm';
  const estilos =
    tipo === 'exito'
      ? `${base} border-green-200 bg-green-50 text-green-800`
      : `${base} border-red-200 bg-red-50 text-red-800`;
  return <div className={estilos}>{mensaje}</div>;
}

function EstadisticaCard({
  etiqueta,
  valor,
  color,
}: {
  etiqueta: string;
  valor: number;
  color: 'slate' | 'green' | 'red';
}): React.JSX.Element {
  const colores = {
    slate: 'bg-tinta-50 text-tinta-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className={`rounded-xl p-4 text-center ${colores[color]}`}>
      <p className="text-3xl font-bold">{valor}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide">{etiqueta}</p>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function CargaMasivaPage(): React.JSX.Element {
  const router = useRouter();
  const { usuario, cargando: cargandoSesion } = useUsuarioActual();

  const inputRef = useRef<HTMLInputElement>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCargaMasiva | null>(null);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  const esAdmin = usuario?.rol === 'administrador';

  const seleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const archivo = e.target.files?.[0] ?? null;
    setArchivoSeleccionado(archivo);
    setResultado(null);
    setErrorGlobal(null);
  };

  const limpiar = (): void => {
    setArchivoSeleccionado(null);
    setResultado(null);
    setErrorGlobal(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const enviar = useCallback(async (): Promise<void> => {
    if (!archivoSeleccionado) return;

    const token = obtenerToken();
    if (!token) {
      cerrarSesion();
      router.push('/login');
      return;
    }

    setProcesando(true);
    setErrorGlobal(null);
    setResultado(null);

    try {
      const res = await cargaMasiva(archivoSeleccionado, token);
      setResultado(res);
    } catch (err) {
      if (err instanceof ErrorApi) {
        if (err.status === 401) {
          cerrarSesion();
          router.push('/login');
          return;
        }
        setErrorGlobal(err.message);
      } else {
        setErrorGlobal('Error inesperado al procesar el archivo.');
      }
    } finally {
      setProcesando(false);
    }
  }, [archivoSeleccionado, router]);

  if (cargandoSesion) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-tinta-500">Cargando…</p>
      </div>
    );
  }

  if (!esAdmin) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="rounded-2xl border border-tinta-200 bg-white p-10 text-center shadow-suave">
          <p className="text-base font-semibold text-tinta-800">Acceso restringido</p>
          <p className="mt-1 text-sm text-tinta-500">
            Solo los administradores pueden usar esta función.
          </p>
          <Boton onClick={() => router.push('/usuarios')} className="mt-4">
            Volver a usuarios
          </Boton>
        </div>
      </div>
    );
  }

  const hayErrores = (resultado?.errores.length ?? 0) > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push('/usuarios')}
          className="rounded-lg p-2 text-tinta-400 transition hover:bg-white hover:text-tinta-700"
          aria-label="Volver a usuarios"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-tinta-900">Carga masiva de usuarios</h1>
          <p className="text-sm text-tinta-500">
            Sube un archivo .xlsx para importar múltiples usuarios.
          </p>
        </div>
      </div>

      {/* Panel de subida */}
      <div className="rounded-2xl border border-tinta-200 bg-white p-6 shadow-suave">
        <h2 className="mb-4 text-sm font-semibold text-tinta-700">Seleccionar archivo</h2>

        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-tinta-200 bg-tinta-50 py-10 transition hover:border-tinta-400 hover:bg-tinta-100"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
        >
          <FileSpreadsheet className="h-8 w-8 text-tinta-400" />
          <p className="mt-2 text-sm font-medium text-tinta-600">
            {archivoSeleccionado
              ? archivoSeleccionado.name
              : 'Haz clic para seleccionar un archivo .xlsx'}
          </p>
          {archivoSeleccionado && (
            <p className="mt-1 text-xs text-tinta-400">
              {(archivoSeleccionado.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={seleccionarArchivo}
        />

        <div className="mt-4 flex gap-3">
          <Boton
            disabled={!archivoSeleccionado || procesando}
            onClick={() => {
              void enviar();
            }}
            className="flex-1"
          >
            {procesando ? 'Procesando…' : 'Importar usuarios'}
          </Boton>
          {(archivoSeleccionado ?? resultado ?? errorGlobal) && (
            <Boton variante="secundario" onClick={limpiar}>
              Limpiar
            </Boton>
          )}
        </div>
      </div>

      {/* Error global */}
      {errorGlobal && <Alerta tipo="error" mensaje={errorGlobal} />}

      {/* Resultado */}
      {resultado && (
        <div className="space-y-4">
          {/* Resumen */}
          <div className="rounded-2xl border border-tinta-200 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-tinta-700">Resumen</p>
            <div className="grid grid-cols-3 gap-3">
              <EstadisticaCard
                etiqueta="Procesados"
                valor={resultado.totalProcesados ?? 0}
                color="slate"
              />
              <EstadisticaCard
                etiqueta="Insertados"
                valor={resultado.insertados ?? 0}
                color="green"
              />
              <EstadisticaCard
                etiqueta="Con errores"
                valor={resultado.errores.length}
                color={hayErrores ? 'red' : 'slate'}
              />
            </div>
            <p className="mt-4 text-sm text-tinta-600">{resultado.mensaje}</p>
          </div>

          {/* Usuarios insertados */}
          {(resultado.usuarios?.length ?? 0) > 0 && (
            <div className="rounded-2xl border border-tinta-200 bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-tinta-700">
                Usuarios creados ({resultado.usuarios!.length})
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-tinta-100 text-left text-xs font-semibold uppercase text-tinta-400">
                      <th className="pb-2 pr-4">ID</th>
                      <th className="pb-2">Correo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tinta-50">
                    {resultado.usuarios!.map((u) => (
                      <tr key={u.id} className="hover:bg-tinta-50">
                        <td className="py-2 pr-4 font-mono text-xs text-tinta-400">{u.id}</td>
                        <td className="py-2 text-tinta-700">{u.correo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Errores por fila */}
          {hayErrores && (
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-red-700">
                Filas con error ({resultado.errores.length})
              </p>
              <ul className="space-y-1">
                {resultado.errores.map((msg, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    <span className="mt-0.5 shrink-0 font-bold">✕</span>
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
