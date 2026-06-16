import { AppShell } from '../../../compartido/ui/AppShell';
import { RutaProtegida } from '../../../compartido/ui/RutaProtegida';
import CargaMasivaPage from '../../../modulos/user/ui/pages/CargaMasivaPage';

export default function Page(): React.JSX.Element {
  return (
    <RutaProtegida>
      <AppShell>
        <CargaMasivaPage />
      </AppShell>
    </RutaProtegida>
  );
}
