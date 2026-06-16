import { AppShell } from '../../compartido/ui/AppShell';
import { RutaProtegida } from '../../compartido/ui/RutaProtegida';
import RolesPage from '../../modulos/user/ui/pages/RolesPage';

export default function Page(): React.JSX.Element {
  return (
    <RutaProtegida>
      <AppShell>
        <RolesPage />
      </AppShell>
    </RutaProtegida>
  );
}
