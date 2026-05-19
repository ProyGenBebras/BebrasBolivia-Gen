import { describe, expect, it } from '@jest/globals';

import { tienePermiso } from '@/compartido/infraestructura/auth/validar-permiso';
import { ROLES } from '@/compartido/infraestructura/auth/roles';

describe('Validar acceso en frontend', () => {
  it('debería permitir al administrador gestionar roles', () => {
    const resultado = tienePermiso(ROLES.ADMINISTRADOR, 'gestionar_roles');

    expect(resultado).toBe(true);
  });

  it('debería impedir que el estudiante gestione roles', () => {
    const resultado = tienePermiso(ROLES.ESTUDIANTE, 'gestionar_roles');

    expect(resultado).toBe(false);
  });

  it('debería permitir al estudiante iniciar examen', () => {
    const resultado = tienePermiso(ROLES.ESTUDIANTE, 'iniciar_examen');

    expect(resultado).toBe(true);
  });

  it('debería permitir al coordinador ver resultados de su institución', () => {
    const resultado = tienePermiso(ROLES.COORDINADOR, 'ver_resultados_institucion');

    expect(resultado).toBe(true);
  });

  it('debería impedir que el profesor gestione instituciones', () => {
    const resultado = tienePermiso(ROLES.PROFESOR, 'gestionar_instituciones');

    expect(resultado).toBe(false);
  });
});