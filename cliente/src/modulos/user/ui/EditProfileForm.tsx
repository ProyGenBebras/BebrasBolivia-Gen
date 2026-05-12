'use client';

import { useState, type FormEvent } from 'react';

import type { EditarPerfilPayload, DatosPerfilUsuario } from '../dominio/usuario';
import { editarPerfilApi } from '../infraestructura/usuario-api';

type EstadoEnvio = 'inicial' | 'enviando' | 'exito' | 'error';

interface ErroresFormulario {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
}

interface EditProfileFormProps {
  datosIniciales?: DatosPerfilUsuario;
  usuarioId: string;
  onExito?: (datos: DatosPerfilUsuario) => void;
  onCancelar?: () => void;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^\d{7,15}$/;

export function EditProfileForm({
  datosIniciales,
  usuarioId,
  onExito,
  onCancelar,
}: EditProfileFormProps): JSX.Element {
  const [nombres, setNombres] = useState(datosIniciales?.nombres ?? '');
  const [apellidos, setApellidos] = useState(datosIniciales?.apellidos ?? '');
  const [correo, setCorreo] = useState(datosIniciales?.correo ?? '');
  const [telefono, setTelefono] = useState(datosIniciales?.telefono ?? '');

  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [estado, setEstado] = useState<EstadoEnvio>('inicial');
  const [mensaje, setMensaje] = useState('');

  function validar(): ErroresFormulario {
    const nuevosErrores: ErroresFormulario = {};

    if (!nombres.trim()) {
      nuevosErrores.nombres = 'El nombre es obligatorio';
    } else if (nombres.trim().length < 2) {
      nuevosErrores.nombres = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    } else if (apellidos.trim().length < 2) {
      nuevosErrores.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }

    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio';
    } else if (!REGEX_EMAIL.test(correo.trim())) {
      nuevosErrores.correo = 'El correo no tiene un formato válido';
    }

    if (!telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!REGEX_TELEFONO.test(telefono.trim())) {
      nuevosErrores.telefono = 'Ingrese un teléfono válido (7-15 dígitos)';
    }

    return nuevosErrores;
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    const erroresValidacion = validar();
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    const payload: EditarPerfilPayload = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    };

    setEstado('enviando');
    setMensaje('');
    try {
      const respuesta = await editarPerfilApi(usuarioId, payload);
      setEstado('exito');
      setMensaje('Perfil actualizado correctamente');
      if (onExito) {
        onExito(respuesta.usuario);
      }
    } catch (error) {
      setEstado('error');
      setMensaje(error instanceof Error ? error.message : 'Error desconocido');
    }
  }

  return (
    <form
      onSubmit={(evento) => {
        void manejarEnvio(evento);
      }}
      noValidate
      style={estilos.form}
    >
      <h2>Editar perfil</h2>

      <Campo
        label="Nombres *"
        id="edit-profile-nombres"
        value={nombres}
        onChange={setNombres}
        error={errores.nombres}
      />
      <Campo
        label="Apellidos *"
        id="edit-profile-apellidos"
        value={apellidos}
        onChange={setApellidos}
        error={errores.apellidos}
      />
      <Campo
        label="Correo electrónico *"
        id="edit-profile-correo"
        type="email"
        value={correo}
        onChange={setCorreo}
        error={errores.correo}
      />
      <Campo
        label="Teléfono *"
        id="edit-profile-telefono"
        type="tel"
        value={telefono}
        onChange={setTelefono}
        error={errores.telefono}
      />

      <div style={estilos.botonesContenedor}>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            disabled={estado === 'enviando'}
            style={estilos.botonCancelar}
          >
            Cancelar
          </button>
        )}
        <button type="submit" disabled={estado === 'enviando'} style={estilos.boton}>
          {estado === 'enviando' ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>

      {estado === 'exito' && <p style={estilos.exito}>{mensaje}</p>}
      {estado === 'error' && <p style={estilos.error}>{mensaje}</p>}
    </form>
  );
}

interface PropsCampo {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (valor: string) => void;
  error?: string;
}

function Campo({ label, id, type = 'text', value, onChange, error }: PropsCampo): JSX.Element {
  return (
    <label htmlFor={id} style={estilos.label}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={estilos.input}
        aria-invalid={Boolean(error)}
      />
      {error && <span style={estilos.error}>{error}</span>}
    </label>
  );
}

const estilos = {
  form: {
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontFamily: 'system-ui, sans-serif',
  },
  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    fontSize: '14px',
    color: '#333',
    gap: '4px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  botonesContenedor: {
    display: 'flex',
    justifyContent: 'flex-end' as const,
    gap: '8px',
    marginTop: '8px',
  },
  boton: {
    padding: '10px 16px',
    background: '#185ABD',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  botonCancelar: {
    padding: '10px 16px',
    background: '#e5e7eb',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    color: '#922B21',
    fontSize: '12px',
  },
  exito: {
    color: '#226600',
    fontSize: '14px',
  },
};
