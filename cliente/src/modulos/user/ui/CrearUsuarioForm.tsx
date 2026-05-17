'use client';

import { useState, type FormEvent } from 'react';

import { ROLES_USUARIO, type CrearUsuarioPayload, type RolUsuario } from '../dominio/usuario';
import { crearUsuarioApi } from '../infraestructura/usuario-api';

type EstadoEnvio = 'inicial' | 'enviando' | 'exito' | 'error';

interface ErroresFormulario {
  correo?: string;
  contrasena?: string;
  nombres?: string;
  apellidos?: string;
  rol?: string;
  telefono?: string;
  nombreUsuario?: string;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CrearUsuarioForm(): JSX.Element {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [rol, setRol] = useState<RolUsuario>('estudiante');
  const [telefono, setTelefono] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');

  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [estado, setEstado] = useState<EstadoEnvio>('inicial');
  const [mensaje, setMensaje] = useState('');

  function validar(): ErroresFormulario {
    const nuevosErrores: ErroresFormulario = {};
    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio';
    } else if (!REGEX_EMAIL.test(correo.trim())) {
      nuevosErrores.correo = 'El correo no tiene un formato válido';
    }
    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria';
    } else if (contrasena.length < 8) {
      nuevosErrores.contrasena = 'Debe tener al menos 8 caracteres';
    }
    if (!nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios';
    }
    if (!apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    }
    if (!ROLES_USUARIO.includes(rol)) {
      nuevosErrores.rol = 'Rol inválido';
    }
    return nuevosErrores;
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    const erroresValidacion = validar();
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    const payload: CrearUsuarioPayload = {
      correo: correo.trim(),
      contrasena,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      rol,
      telefono: telefono.trim() || undefined,
      nombreUsuario: nombreUsuario.trim() || undefined,
    };

    setEstado('enviando');
    setMensaje('');
    try {
      const respuesta = await crearUsuarioApi(payload);
      setEstado('exito');
      setMensaje(`Usuario creado: ${respuesta.usuario.correo} (id: ${respuesta.usuario.id})`);
      setCorreo('');
      setContrasena('');
      setNombres('');
      setApellidos('');
      setTelefono('');
      setNombreUsuario('');
      setRol('estudiante');
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
      <h2>Crear usuario manualmente</h2>

      <Campo
        label="Correo *"
        id="correo"
        type="email"
        value={correo}
        onChange={setCorreo}
        error={errores.correo}
      />
      <Campo
        label="Contraseña *"
        id="contrasena"
        type="password"
        value={contrasena}
        onChange={setContrasena}
        error={errores.contrasena}
      />
      <Campo
        label="Nombres *"
        id="nombres"
        value={nombres}
        onChange={setNombres}
        error={errores.nombres}
      />
      <Campo
        label="Apellidos *"
        id="apellidos"
        value={apellidos}
        onChange={setApellidos}
        error={errores.apellidos}
      />

      <label htmlFor="rol" style={estilos.label}>
        Rol * <select
          id="rol"
          value={rol}
          onChange={(e) => setRol(e.target.value as RolUsuario)}
          style={estilos.input}
        >
          {ROLES_USUARIO.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errores.rol && <span style={estilos.error}>{errores.rol}</span>}
      </label>

      <Campo
        label="Teléfono (opcional)"
        id="telefono"
        value={telefono}
        onChange={setTelefono}
        error={errores.telefono}
      />
      <Campo
        label="Nombre de usuario (opcional)"
        id="nombreUsuario"
        value={nombreUsuario}
        onChange={setNombreUsuario}
        error={errores.nombreUsuario}
      />

      <button type="submit" disabled={estado === 'enviando'} style={estilos.boton}>
        {estado === 'enviando' ? 'Creando…' : 'Crear usuario'}
      </button>

      {estado === 'exito' && <p style={estilos.exito}>{mensaje}</p>}
      {estado === 'error' && <p style={estilos.error}>{mensaje}</p>}
    </form>
  );
}

type PropsCampo = Readonly<{
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (valor: string) => void;
  error?: string;
}>;

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
  boton: {
    padding: '10px 16px',
    background: '#185ABD',
    color: 'white',
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
