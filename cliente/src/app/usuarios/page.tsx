import { AppShell } from '../../compartido/ui/AppShell';
import { RutaProtegida } from '../../compartido/ui/RutaProtegida';
import UsuariosPage from '../../modulos/user/ui/pages/UsuariosPage';

export default function Page(): React.JSX.Element {
  return (
    <RutaProtegida>
      <AppShell>
        <UsuariosPage />
      </AppShell>
    </RutaProtegida>
  );
}
