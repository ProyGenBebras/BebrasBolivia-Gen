import { CrearUsuarioForm } from '@/modulos/user/ui/CrearUsuarioForm';

export default function PaginaCrearUsuario(): JSX.Element {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>REQ-04 — Crear usuario manual</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Formulario disponible solo para administradores. La verificación real del rol queda a cargo
        del middleware de REQ-09 (Restricción por rol).
      </p>
      <CrearUsuarioForm />
    </main>
  );
}
