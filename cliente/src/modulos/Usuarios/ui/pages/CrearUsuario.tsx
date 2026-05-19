'use client';

import { useState } from 'react';

import {
  construirPayload,
  validarFormularioUsuario,
  type ErroresFormulario,
  type EstadoFormularioUsuario,
} from '../../aplicacion/validar-formulario-usuario';
import { ROLES_USUARIO } from '../../dominio/usuario';
import { usuarioApi } from '../../infraestructura/api/usuario.api';

const ESTADO_INICIAL: EstadoFormularioUsuario = {
  correo: '',
  nombres: '',
  apellidos: '',
  contrasena: '',
  rol: 'estudiante',
  nombreUsuario: '',
  telefono: '',
};

const claseInput =
  'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400';

export function CrearUsuario(): JSX.Element {
  const [estado, setEstado] = useState<EstadoFormularioUsuario>(ESTADO_INICIAL);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const actualizarCampo = (campo: keyof EstadoFormularioUsuario, valor: string): void => {
    setEstado((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
    setExito(null);
  };

  const enviar = async (): Promise<void> => {
    setErrorGlobal(null);
    setExito(null);

    const erroresValidacion = validarFormularioUsuario(estado);
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setEstaEnviando(true);
    try {
      const usuarioCreado = await usuarioApi.crear(construirPayload(estado));
      // La confirmacion definitiva (Tarea 6) la afina Angel; aqui se muestra
      // un mensaje basico de exito para cerrar el flujo del formulario.
      setExito(`Usuario ${usuarioCreado.correo} creado correctamente`);
      setEstado(ESTADO_INICIAL);
    } catch (err) {
      setErrorGlobal(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear usuario</h1>
          <p className="mt-1 text-sm text-slate-500">
            Registro manual de usuarios por el administrador
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {errorGlobal && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorGlobal}
          </div>
        )}
        {exito && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {exito}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Correo <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={estado.correo}
                onChange={(e) => actualizarCampo('correo', e.target.value)}
                className={claseInput}
                placeholder="usuario@bebras.com"
              />
              {errores.correo && (
                <p className="mt-1 text-xs font-medium text-red-600">{errores.correo}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nombres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={estado.nombres}
                onChange={(e) => actualizarCampo('nombres', e.target.value)}
                className={claseInput}
              />
              {errores.nombres && (
                <p className="mt-1 text-xs font-medium text-red-600">{errores.nombres}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={estado.apellidos}
                onChange={(e) => actualizarCampo('apellidos', e.target.value)}
                className={claseInput}
              />
              {errores.apellidos && (
                <p className="mt-1 text-xs font-medium text-red-600">{errores.apellidos}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Contrasena <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={estado.contrasena}
                onChange={(e) => actualizarCampo('contrasena', e.target.value)}
                className={claseInput}
                placeholder="Minimo 8 caracteres"
              />
              {errores.contrasena && (
                <p className="mt-1 text-xs font-medium text-red-600">{errores.contrasena}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                value={estado.rol}
                onChange={(e) => actualizarCampo('rol', e.target.value)}
                className={claseInput}
              >
                {ROLES_USUARIO.map((opcion) => (
                  <option key={opcion.valor} value={opcion.valor}>
                    {opcion.etiqueta}
                  </option>
                ))}
              </select>
              {errores.rol && (
                <p className="mt-1 text-xs font-medium text-red-600">{errores.rol}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={estado.nombreUsuario}
                onChange={(e) => actualizarCampo('nombreUsuario', e.target.value)}
                className={claseInput}
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefono</label>
              <input
                type="tel"
                value={estado.telefono}
                onChange={(e) => actualizarCampo('telefono', e.target.value)}
                className={claseInput}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => void enviar()}
              disabled={estaEnviando}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {estaEnviando ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
