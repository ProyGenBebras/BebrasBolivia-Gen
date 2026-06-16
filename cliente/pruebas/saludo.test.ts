import { SALUDO_HOLA_MUNDO } from '@/lib/saludo';

describe('Saludo de demostración CI/CD', () => {
  it('debería ser exactamente "Hola Mundo"', () => {
    expect(SALUDO_HOLA_MUNDO).toBe('Hola Mundo');
  });
});
