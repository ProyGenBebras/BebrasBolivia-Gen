import Link from 'next/link';

export default function PaginaInicio(): JSX.Element {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Bebras Bolivia</h1>
      <p>Plataforma de gestión del concurso.</p>
      <ul>
        <li>
          <Link href="/admin/usuarios/crear">Crear usuario (admin) — REQ-04</Link>
        </li>
      </ul>
    </main>
  );
}
