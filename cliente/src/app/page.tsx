import { AppShell } from '../compartido/ui/AppShell';
import { RutaProtegida } from '../compartido/ui/RutaProtegida';
import DashboardPage from '../modulos/user/ui/pages/DashboardPage';

export default function Page(): React.JSX.Element {
  return (
    <RutaProtegida>
      <AppShell>
        <DashboardPage />
      </AppShell>
    </RutaProtegida>
  );
}
