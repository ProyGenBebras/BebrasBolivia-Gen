import type { Metadata } from 'next';

import { GestionUsuarios } from '../../modulos/user/ui/pages/GestionUsuarios';

export const metadata: Metadata = {
  title: 'Gestión de Usuarios | BebrasBolivia',
  description: 'Activa o desactiva el acceso de usuarios a la plataforma',
};

export default function UsuariosPage(): JSX.Element {
  return <GestionUsuarios />;
}
