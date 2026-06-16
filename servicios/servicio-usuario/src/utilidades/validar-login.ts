import type { LoginDto } from '../dtos/login.dto';

import { ErrorNegocio } from './errores';

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarLogin(cuerpo: unknown): LoginDto {
  if (typeof cuerpo !== 'object' || cuerpo === null) {
    throw new ErrorNegocio('El cuerpo de la peticion es invalido');
  }

  const datos = cuerpo as Record<string, unknown>;

  if (typeof datos.correo !== 'string' || datos.correo.trim() === '') {
    throw new ErrorNegocio('El correo es obligatorio');
  }
  const correo = datos.correo.trim().toLowerCase();
  if (!PATRON_CORREO.test(correo)) {
    throw new ErrorNegocio('El correo no tiene un formato valido');
  }

  if (typeof datos.contrasena !== 'string' || datos.contrasena === '') {
    throw new ErrorNegocio('La contrasena es obligatoria');
  }

  return { correo, contrasena: datos.contrasena };
}
