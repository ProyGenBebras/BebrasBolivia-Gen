/*
import type { Metadata } from 'next';

import { ProtegerRuta } from '@/compartido/infraestructura/auth/proteger-ruta';
import { ROLES } from '@/compartido/infraestructura/auth/roles';
import { GestionRoles } from '@/modulos/Roles/ui/pages/GestionRoles';

export const metadata: Metadata = {
  title: 'Gestión de Roles | BebrasBolivia',
  description: 'Administra los roles y permisos de los usuarios del sistema',
};

export default function RolesPage(): JSX.Element {
  return (
    <ProtegerRuta rolUsuario={ROLES.ADMINISTRADOR} permisoRequerido="gestionar_roles">
      <GestionRoles />
    </ProtegerRuta>
  );
}
  */

import type { Metadata } from 'next';

import { ProtegerRuta } from '@/compartido/infraestructura/auth/proteger-ruta';
import { ROLES } from '@/compartido/infraestructura/auth/roles';
import { GestionRoles } from '@/modulos/Roles/ui/pages/GestionRoles';

export const metadata: Metadata = {
  title: 'Gestión de Roles | BebrasBolivia',
  description: 'Administra los roles y permisos de los usuarios del sistema',
};

export default function RolesPage(): JSX.Element {
  return (
    <ProtegerRuta rolUsuario={ROLES.ADMINISTRADOR} permisoRequerido="gestionar_roles">
      <GestionRoles />
    </ProtegerRuta>
  );
}