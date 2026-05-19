import type { Metadata } from 'next';

import { CrearUsuario } from '@/modulos/Usuarios/ui/pages/CrearUsuario';

export const metadata: Metadata = {
  title: 'Crear usuario | BebrasBolivia',
  description: 'Registro manual de usuarios por el administrador',
};

export default function CrearUsuarioPage(): JSX.Element {
  return <CrearUsuario />;
}
