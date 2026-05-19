'use client';

import { useRef, useState } from 'react';

import type { ErrorFila, ResultadoCargaMasiva } from '../../dominio/usuario';
import { usuarioApi } from '../../infraestructura/api/usuario.api';

export function CargaMasiva(): JSX.Element {
  const referenciaArchivo = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCargaMasiva | null>(null);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<string | null>(null);

  const manejarCarga = async (evento: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    setArchivoSeleccionado(archivo.name);
    setEnviando(true);
    setResultado(null);
    setErrorGlobal(null);

    try {
      const datos = await usuarioApi.cargarMasivo(archivo);
      setResultado(datos);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar el archivo';
      setErrorGlobal(mensaje);
    } finally {
      setEnviando(false);
      if (referenciaArchivo.current) referenciaArchivo.current.value = '';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f7f4',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e5e0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 600,
                color: '#1a1a1a',
                letterSpacing: '-0.3px',
              }}
            >
              Carga masiva de usuarios
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#888', paddingLeft: 48 }}>
            Importa múltiples usuarios desde un archivo Excel
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Zona de carga */}
        <div
          style={{
            background: '#fff',
            border: '1.5px dashed #d4d0c8',
            borderRadius: 16,
            padding: '2.5rem 2rem',
            textAlign: 'center',
            marginBottom: 20,
            transition: 'border-color 0.2s',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => referenciaArchivo.current?.click()}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a1a1a')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d4d0c8')}
        >
          <input
            ref={referenciaArchivo}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => void manejarCarga(e)}
            style={{ display: 'none' }}
            id="input-archivo"
          />

          {enviando ? (
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '3px solid #e8e5e0',
                  borderTopColor: '#1a1a1a',
                  margin: '0 auto 1rem',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: '#1a1a1a' }}>
                Procesando archivo…
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#aaa' }}>
                {archivoSeleccionado}
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: '#f3f2ef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#555"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                Haz clic para seleccionar tu archivo
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#aaa' }}>
                Acepta .xlsx y .xls · Tamaño máximo recomendado 5 MB
              </p>
            </div>
          )}
        </div>

        {/* Formato requerido */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e8e5e0',
            marginBottom: 20,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #f0ede8',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#888',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Formato requerido
            </span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {[
              { columna: 'nombre', descripcion: 'Nombre del usuario', icono: '👤' },
              { columna: 'apellidos', descripcion: 'Apellidos del usuario', icono: '👤' },
              { columna: 'email', descripcion: 'Correo electrónico único', icono: '✉️' },
              { columna: 'rolId', descripcion: 'ID numérico del rol', icono: '🔑' },
            ].map((fila, i) => (
              <div
                key={fila.columna}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  borderBottom: i < 3 ? '1px solid #f5f3ef' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1a1a1a',
                    background: '#f3f2ef',
                    padding: '3px 8px',
                    borderRadius: 6,
                    minWidth: 90,
                    display: 'inline-block',
                  }}
                >
                  {fila.columna}
                </span>
                <span style={{ marginLeft: 16, fontSize: 14, color: '#666' }}>
                  {fila.descripcion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Error global */}
        {errorGlobal && (
          <div
            style={{
              background: '#fff8f8',
              border: '1px solid #fcd0d0',
              borderRadius: 12,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e24b4a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginTop: 1, flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: 14, color: '#c0392b' }}>{errorGlobal}</span>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Stats */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}
            >
              <div
                style={{
                  background: '#f0faf4',
                  border: '1px solid #c3e6d0',
                  borderRadius: 14,
                  padding: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#1e7e45',
                    lineHeight: 1,
                  }}
                >
                  {resultado.exitosos}
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#2d9e57', fontWeight: 500 }}>
                  usuarios registrados
                </p>
              </div>
              <div
                style={{
                  background: resultado.errores.length > 0 ? '#fff8f8' : '#f8f8f8',
                  border: `1px solid ${resultado.errores.length > 0 ? '#fcd0d0' : '#e8e5e0'}`,
                  borderRadius: 14,
                  padding: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px',
                    fontSize: 36,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: resultado.errores.length > 0 ? '#c0392b' : '#999',
                  }}
                >
                  {resultado.errores.length}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 500,
                    color: resultado.errores.length > 0 ? '#e24b4a' : '#bbb',
                  }}
                >
                  filas con error
                </p>
              </div>
            </div>

            {/* Tabla de errores */}
            {resultado.errores.length > 0 && (
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e8e5e0',
                  borderRadius: 14,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #f0ede8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e24b4a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#888',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Reporte de errores
                  </span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#fafaf8' }}>
                      <th
                        style={{
                          padding: '10px 20px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#666',
                          fontSize: 12,
                          width: 80,
                        }}
                      >
                        Fila
                      </th>
                      <th
                        style={{
                          padding: '10px 20px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#666',
                          fontSize: 12,
                        }}
                      >
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.errores.map((error: ErrorFila) => (
                      <tr key={error.fila} style={{ borderTop: '1px solid #f5f3ef' }}>
                        <td
                          style={{
                            padding: '11px 20px',
                            color: '#999',
                            fontFamily: 'monospace',
                            fontSize: 13,
                          }}
                        >
                          #{error.fila}
                        </td>
                        <td style={{ padding: '11px 20px', color: '#c0392b' }}>{error.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
