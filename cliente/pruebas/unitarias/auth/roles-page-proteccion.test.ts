
import * as fs from 'node:fs';
import * as path from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('Protección de la página de roles', () => {
  it('debería proteger la página /roles con ProtegerRuta', () => {
    const pagePath = path.join(__dirname, '../../../src/app/roles/page.tsx');
    const contenido = fs.readFileSync(pagePath, 'utf8');

    expect(contenido).toContain('ProtegerRuta');
    expect(contenido).toContain('permisoRequerido="gestionar_roles"');
    expect(contenido).toContain('ROLES.ADMINISTRADOR');
  });
});