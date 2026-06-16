'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '../../../../compartido/ui/atoms/Badge';
import { Boton } from '../../../../compartido/ui/atoms/Boton';
import { Campo } from '../../../../compartido/ui/atoms/Campo';
import { Modal } from '../../../../compartido/ui/atoms/Modal';
import { Select } from '../../../../compartido/ui/atoms/Select';
import { SkeletonFilas } from '../../../../compartido/ui/atoms/Skeleton';
import { cerrarSesion, obtenerToken } from '../../aplicacion/sesion';
import { useUsuarioActual } from '../../aplicacion/usuario-actual';
import type { Rol } from '../../dominio/rol';
import { ETIQUETA_ROL } from '../../dominio/rol';
import type { Paginacion, Usuario } from '../../dominio/usuario';
import { ErrorApi } from '../../infraestructura/api/http';
import {
  actualizarUsuario,
  cambiarEstado,
  cambiarRol,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
} from '../../infraestructura/api/usuarios-api';

// ─── Tipos de modal ───────────────────────────────────────────────────────────

type ModalActivo =
  | null
  | { tipo: 'crear' }
  | { tipo: 'editar'; usuario: Usuario }
  | { tipo: 'rol'; usuario: Usuario }
  | { tipo: 'eliminar'; usuario: Usuario };

// ─── Constantes ───────────────────────────────────────────────────────────────

const LIMITE_POR_PAGINA = 10;
const ROLES: Rol[] = ['administrador', 'coordinador', 'profesor', 'estudiante'];

type EstadoCarga = 'cargando' | 'listo' | 'error';

// ─── Helpers de UI ───────────────────────────────────────────────────────────

function ErrorFormulario({ mensaje }: { mensaje: string }): React.JSX.Element | null {
  if (!mensaje) return null;
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {mensaje}
    </p>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function UsuariosPage(): React.JSX.Element {
  const router = useRouter();
  const { usuario: usuarioActual } = useUsuarioActual();
  const esAdmin = usuarioActual?.rol === 'administrador';

  // ── Estado de lista ───────────────────────────────────────────────────────
  const [estado, setEstado] = useState<EstadoCarga>('cargando');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [paginacion, setPaginacion] = useState<Paginacion | null>(null);
  const [pagina, setPagina] = useState(1);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // ── Filtros ───────────────────────────────────────────────────────────────
  const [filtroRol, setFiltroRol] = useState<Rol | ''>('');
  const [filtroEstado, setFiltroEstado] = useState<'' | 'true' | 'false'>('');

  // ── Estado de operaciones ─────────────────────────────────────────────────
  const [modal, setModal] = useState<ModalActivo>(null);
  const [operando, setOperando] = useState(false);
  const [errorOp, setErrorOp] = useState('');
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  // ── Estado de formularios ─────────────────────────────────────────────────
  const formCrearInicial = {
    correo: '',
    nombres: '',
    apellidos: '',
    contrasena: '',
    rol: 'estudiante' as Rol,
    telefono: '',
  };
  const [formCrear, setFormCrear] = useState(formCrearInicial);
  const [formEditar, setFormEditar] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
  });
  const [rolNuevo, setRolNuevo] = useState<Rol>('estudiante');

  // ── Helpers ───────────────────────────────────────────────────────────────
  const mostrarExito = (msg: string): void => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(''), 3500);
  };

  const cerrarModal = (): void => {
    setModal(null);
    setErrorOp('');
  };

  // ── Auth helpers ──────────────────────────────────────────────────────────
  const manejarErrorAuth = useCallback(
    (err: unknown): boolean => {
      if (err instanceof ErrorApi && err.status === 401) {
        cerrarSesion();
        router.push('/login');
        return true;
      }
      return false;
    },
    [router],
  );

  // ── Carga de datos ────────────────────────────────────────────────────────
  const cargar = useCallback(
    (p: number): void => {
      const token = obtenerToken();
      if (!token) {
        cerrarSesion();
        router.push('/login');
        return;
      }
      setEstado('cargando');
      listarUsuarios({
        page: p,
        limit: LIMITE_POR_PAGINA,
        token,
        rol: filtroRol || undefined,
        estaActivo: filtroEstado === '' ? undefined : filtroEstado === 'true',
      })
        .then((res) => {
          setUsuarios(res.data);
          setPaginacion(res.paginacion);
          setEstado('listo');
        })
        .catch((err: unknown) => {
          if (manejarErrorAuth(err)) return;
          setMensajeError(err instanceof Error ? err.message : 'Error desconocido');
          setEstado('error');
        });
    },
    [filtroRol, filtroEstado, router, manejarErrorAuth],
  );

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPagina(1);
  }, [filtroRol, filtroEstado]);

  useEffect(() => {
    cargar(pagina);
  }, [cargar, pagina]);

  // ── Acciones inline (sin modal) ───────────────────────────────────────────
  const manejarToggleEstado = (u: Usuario): void => {
    const token = obtenerToken();
    if (!token || procesandoId) return;
    setProcesandoId(u.id);
    cambiarEstado(u.id, !u.estaActivo, token)
      .then(() => {
        mostrarExito(`Usuario ${!u.estaActivo ? 'activado' : 'desactivado'} correctamente`);
        cargar(pagina);
      })
      .catch((err: unknown) => {
        if (manejarErrorAuth(err)) return;
        if (err instanceof ErrorApi) setMensajeError(err.message);
      })
      .finally(() => setProcesandoId(null));
  };

  // ── Abrir modales ─────────────────────────────────────────────────────────
  const abrirCrear = (): void => {
    setFormCrear(formCrearInicial);
    setModal({ tipo: 'crear' });
    setErrorOp('');
  };

  const abrirEditar = (u: Usuario): void => {
    setFormEditar({
      nombres: u.nombres,
      apellidos: u.apellidos,
      correo: u.correo,
      telefono: u.telefono ?? '',
    });
    setModal({ tipo: 'editar', usuario: u });
    setErrorOp('');
  };

  const abrirRol = (u: Usuario): void => {
    setRolNuevo(u.rol);
    setModal({ tipo: 'rol', usuario: u });
    setErrorOp('');
  };

  const abrirEliminar = (u: Usuario): void => {
    setModal({ tipo: 'eliminar', usuario: u });
    setErrorOp('');
  };

  // ── Handlers de submit ────────────────────────────────────────────────────
  const ejecutarCrear = (): void => {
    const token = obtenerToken();
    if (!token) return;
    if (!formCrear.correo || !formCrear.nombres || !formCrear.apellidos || !formCrear.contrasena) {
      setErrorOp('Completa todos los campos obligatorios');
      return;
    }
    setOperando(true);
    setErrorOp('');
    crearUsuario(
      {
        correo: formCrear.correo.trim().toLowerCase(),
        nombres: formCrear.nombres.trim(),
        apellidos: formCrear.apellidos.trim(),
        contrasena: formCrear.contrasena,
        rol: formCrear.rol,
        telefono: formCrear.telefono.trim() || undefined,
      },
      token,
    )
      .then(() => {
        cerrarModal();
        mostrarExito('Usuario creado correctamente');
        cargar(1);
        setPagina(1);
      })
      .catch((err: unknown) => {
        if (manejarErrorAuth(err)) return;
        setErrorOp(err instanceof ErrorApi ? err.message : 'Error al crear el usuario');
      })
      .finally(() => setOperando(false));
  };

  const ejecutarEditar = (): void => {
    if (modal?.tipo !== 'editar') return;
    const token = obtenerToken();
    if (!token) return;
    if (!formEditar.nombres || !formEditar.apellidos || !formEditar.correo) {
      setErrorOp('Nombres, apellidos y correo son obligatorios');
      return;
    }
    setOperando(true);
    setErrorOp('');
    actualizarUsuario(
      modal.usuario.id,
      {
        nombres: formEditar.nombres.trim(),
        apellidos: formEditar.apellidos.trim(),
        correo: formEditar.correo.trim().toLowerCase(),
        telefono: formEditar.telefono.trim() || undefined,
      },
      token,
    )
      .then(() => {
        cerrarModal();
        mostrarExito('Usuario actualizado correctamente');
        cargar(pagina);
      })
      .catch((err: unknown) => {
        if (manejarErrorAuth(err)) return;
        setErrorOp(err instanceof ErrorApi ? err.message : 'Error al actualizar el usuario');
      })
      .finally(() => setOperando(false));
  };

  const ejecutarCambiarRol = (): void => {
    if (modal?.tipo !== 'rol') return;
    const token = obtenerToken();
    if (!token) return;
    if (rolNuevo === modal.usuario.rol) {
      cerrarModal();
      return;
    }
    setOperando(true);
    setErrorOp('');
    cambiarRol(modal.usuario.id, rolNuevo, token)
      .then(() => {
        cerrarModal();
        mostrarExito('Rol actualizado correctamente');
        cargar(pagina);
      })
      .catch((err: unknown) => {
        if (manejarErrorAuth(err)) return;
        setErrorOp(err instanceof ErrorApi ? err.message : 'Error al cambiar el rol');
      })
      .finally(() => setOperando(false));
  };

  const ejecutarEliminar = (): void => {
    if (modal?.tipo !== 'eliminar') return;
    const token = obtenerToken();
    if (!token) return;
    setOperando(true);
    setErrorOp('');
    eliminarUsuario(modal.usuario.id, token)
      .then(() => {
        cerrarModal();
        mostrarExito('Usuario eliminado correctamente');
        cargar(pagina);
      })
      .catch((err: unknown) => {
        if (manejarErrorAuth(err)) return;
        setErrorOp(err instanceof ErrorApi ? err.message : 'Error al eliminar el usuario');
      })
      .finally(() => setOperando(false));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-tinta-900">Usuarios</h1>
          <p className="mt-1 text-sm text-tinta-500">Gestión de usuarios de la plataforma.</p>
        </div>
        {esAdmin && (
          <div className="flex gap-2">
            <Link
              href="/usuarios/carga-masiva"
              className="rounded-xl border border-tinta-300 px-4 py-2 text-sm font-semibold text-tinta-600 transition hover:bg-tinta-100"
            >
              Carga masiva
            </Link>
            <Boton onClick={abrirCrear}>+ Crear usuario</Boton>
          </div>
        )}
      </div>

      {/* Alerta de éxito */}
      {mensajeExito && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {mensajeExito}
        </div>
      )}

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Select
          aria-label="Filtrar por rol"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value as Rol | '')}
        >
          <option value="">Todos los roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ETIQUETA_ROL[r]}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar por estado"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as '' | 'true' | 'false')}
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </Select>

        {(filtroRol || filtroEstado) && (
          <Boton
            variante="secundario"
            onClick={() => {
              setFiltroRol('');
              setFiltroEstado('');
            }}
          >
            Limpiar filtros
          </Boton>
        )}
      </div>

      {/* Estados de carga */}
      {estado === 'cargando' && (
        <div className="mt-6">
          <SkeletonFilas filas={LIMITE_POR_PAGINA} />
        </div>
      )}

      {estado === 'error' && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          No se pudieron cargar los usuarios: {mensajeError}
        </div>
      )}

      {/* Tabla de usuarios */}
      {estado === 'listo' && (
        <>
          <div className="mt-6 overflow-hidden rounded-xl border border-tinta-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-tinta-100 text-xs uppercase text-tinta-500">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Estado</th>
                  {esAdmin && <th className="px-4 py-3">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={esAdmin ? 5 : 4} className="px-4 py-8 text-center text-tinta-400">
                      No hay usuarios con los filtros actuales.
                    </td>
                  </tr>
                )}
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-t border-tinta-100">
                    <td className="px-4 py-3 font-medium text-tinta-900">
                      {u.nombres} {u.apellidos}
                    </td>
                    <td className="px-4 py-3 text-tinta-600">{u.correo}</td>
                    <td className="px-4 py-3">
                      <Badge texto={ETIQUETA_ROL[u.rol]} variante={u.rol} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        texto={u.estaActivo ? 'Activo' : 'Inactivo'}
                        variante={u.estaActivo ? 'activo' : 'inactivo'}
                      />
                    </td>
                    {esAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => abrirEditar(u)}
                            disabled={procesandoId === u.id}
                            className="rounded-md border border-tinta-200 px-2 py-1 text-xs text-tinta-600 transition hover:bg-tinta-50 disabled:opacity-40"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => manejarToggleEstado(u)}
                            disabled={procesandoId === u.id}
                            className="rounded-md border border-tinta-200 px-2 py-1 text-xs text-tinta-600 transition hover:bg-tinta-50 disabled:opacity-40"
                          >
                            {procesandoId === u.id ? '…' : u.estaActivo ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => abrirRol(u)}
                            disabled={procesandoId === u.id}
                            className="rounded-md border border-tinta-200 px-2 py-1 text-xs text-tinta-600 transition hover:bg-tinta-50 disabled:opacity-40"
                          >
                            Rol
                          </button>
                          {u.estaActivo && (
                            <button
                              type="button"
                              onClick={() => abrirEliminar(u)}
                              disabled={procesandoId === u.id}
                              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {paginacion && (
            <div className="mt-4 flex items-center justify-between text-sm text-tinta-600">
              <span>
                Página {paginacion.page} de {Math.max(paginacion.totalPages, 1)} ·{' '}
                {paginacion.total} usuario(s)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.max(p - 1, 1))}
                  disabled={paginacion.page <= 1}
                  className="rounded-lg border border-tinta-300 px-3 py-1.5 transition enabled:hover:bg-tinta-100 disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={paginacion.page >= paginacion.totalPages}
                  className="rounded-lg border border-tinta-300 px-3 py-1.5 transition enabled:hover:bg-tinta-100 disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Modal: Crear usuario ──────────────────────────────────────────── */}
      {modal?.tipo === 'crear' && (
        <Modal titulo="Crear usuario" onCerrar={cerrarModal}>
          <div className="flex flex-col gap-4">
            <Campo
              etiqueta="Correo"
              requerido
              type="email"
              value={formCrear.correo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormCrear((f) => ({ ...f, correo: e.target.value }))
              }
              placeholder="correo@ejemplo.bo"
            />
            <div className="grid grid-cols-2 gap-3">
              <Campo
                etiqueta="Nombres"
                requerido
                type="text"
                value={formCrear.nombres}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormCrear((f) => ({ ...f, nombres: e.target.value }))
                }
              />
              <Campo
                etiqueta="Apellidos"
                requerido
                type="text"
                value={formCrear.apellidos}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormCrear((f) => ({ ...f, apellidos: e.target.value }))
                }
              />
            </div>
            <Campo
              etiqueta="Contraseña"
              requerido
              type="password"
              value={formCrear.contrasena}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormCrear((f) => ({ ...f, contrasena: e.target.value }))
              }
              placeholder="Mínimo 8 caracteres"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                etiqueta="Rol *"
                value={formCrear.rol}
                onChange={(e) => setFormCrear((f) => ({ ...f, rol: e.target.value as Rol }))}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ETIQUETA_ROL[r]}
                  </option>
                ))}
              </Select>
              <Campo
                etiqueta="Teléfono"
                type="tel"
                value={formCrear.telefono}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormCrear((f) => ({ ...f, telefono: e.target.value }))
                }
                placeholder="Opcional"
              />
            </div>
            <ErrorFormulario mensaje={errorOp} />
            <div className="flex justify-end gap-3 pt-2">
              <Boton variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Boton>
              <Boton onClick={ejecutarCrear} disabled={operando}>
                {operando ? 'Creando…' : 'Crear usuario'}
              </Boton>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: Editar usuario ─────────────────────────────────────────── */}
      {modal?.tipo === 'editar' && (
        <Modal
          titulo={`Editar: ${modal.usuario.nombres} ${modal.usuario.apellidos}`}
          onCerrar={cerrarModal}
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Campo
                etiqueta="Nombres"
                requerido
                type="text"
                value={formEditar.nombres}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEditar((f) => ({ ...f, nombres: e.target.value }))
                }
              />
              <Campo
                etiqueta="Apellidos"
                requerido
                type="text"
                value={formEditar.apellidos}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEditar((f) => ({ ...f, apellidos: e.target.value }))
                }
              />
            </div>
            <Campo
              etiqueta="Correo"
              requerido
              type="email"
              value={formEditar.correo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEditar((f) => ({ ...f, correo: e.target.value }))
              }
            />
            <Campo
              etiqueta="Teléfono"
              type="tel"
              value={formEditar.telefono}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormEditar((f) => ({ ...f, telefono: e.target.value }))
              }
              placeholder="Opcional"
            />
            <ErrorFormulario mensaje={errorOp} />
            <div className="flex justify-end gap-3 pt-2">
              <Boton variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Boton>
              <Boton onClick={ejecutarEditar} disabled={operando}>
                {operando ? 'Guardando…' : 'Guardar cambios'}
              </Boton>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: Cambiar rol ────────────────────────────────────────────── */}
      {modal?.tipo === 'rol' && (
        <Modal titulo={`Rol de ${modal.usuario.nombres}`} onCerrar={cerrarModal} ancho="sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-tinta-500">
              Rol actual:{' '}
              <Badge texto={ETIQUETA_ROL[modal.usuario.rol]} variante={modal.usuario.rol} />
            </p>
            <Select
              etiqueta="Nuevo rol"
              value={rolNuevo}
              onChange={(e) => setRolNuevo(e.target.value as Rol)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ETIQUETA_ROL[r]}
                </option>
              ))}
            </Select>
            <ErrorFormulario mensaje={errorOp} />
            <div className="flex justify-end gap-3 pt-2">
              <Boton variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Boton>
              <Boton onClick={ejecutarCambiarRol} disabled={operando}>
                {operando ? 'Guardando…' : 'Cambiar rol'}
              </Boton>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: Confirmar eliminación ──────────────────────────────────── */}
      {modal?.tipo === 'eliminar' && (
        <Modal titulo="Confirmar eliminación" onCerrar={cerrarModal} ancho="sm">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-tinta-700">
              ¿Eliminar a{' '}
              <span className="font-semibold">
                {modal.usuario.nombres} {modal.usuario.apellidos}
              </span>
              ? Esta acción desactiva la cuenta permanentemente.
            </p>
            <ErrorFormulario mensaje={errorOp} />
            <div className="flex justify-end gap-3 pt-2">
              <Boton variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Boton>
              <Boton variante="peligro" onClick={ejecutarEliminar} disabled={operando}>
                {operando ? 'Eliminando…' : 'Sí, eliminar'}
              </Boton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
