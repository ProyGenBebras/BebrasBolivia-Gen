import type { Metadata } from 'next';

import { GestionRoles } from '../../modulos/user/ui/pages/GestionRoles';

export const metadata: Metadata = {
  title: 'Gestión de Roles | BebrasBolivia',
  description: 'Administra los roles y permisos de los usuarios del sistema',
};

export default function RolesPage(): JSX.Element {
  return <GestionRoles />;
}
