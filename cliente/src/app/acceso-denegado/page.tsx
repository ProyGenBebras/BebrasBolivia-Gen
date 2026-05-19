import Link from 'next/link';

type AccesoDenegadoProps = {
  searchParams?: {
    motivo?: string;
  };
};

export default function PaginaAccesoDenegado({
  searchParams,
}: AccesoDenegadoProps): React.ReactElement {
  const motivo = searchParams?.motivo;

  const mensaje =
    motivo === 'no-autenticado'
      ? 'Debes iniciar sesión para acceder a esta sección del sistema.'
      : 'No tienes permisos suficientes para acceder a esta sección del sistema.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600">
          Acceso restringido
        </p>

        <h1 className="mb-4 text-3xl font-bold text-slate-900">Acceso denegado</h1>

        <p className="mb-6 text-slate-600">{mensaje}</p>

        <Link
          href="/"
          className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}