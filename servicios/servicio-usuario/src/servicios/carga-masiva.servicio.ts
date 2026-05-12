import type { CrearUsuarioMasivoDto, ErrorFila, ResultadoCargaMasiva } from '../dtos/crear-usuario-masivo.dto.js';

export interface ParseadorArchivo {
  parsear(buffer: Buffer): unknown[];
}

export interface UsuarioCargaMasivaRepositorio {
  buscarPorEmail(email: string): Promise<boolean>;
  crearMasivo(usuarios: CrearUsuarioMasivoDto[]): Promise<void>;
}

function esFilaValida(fila: unknown): fila is CrearUsuarioMasivoDto {
  if (typeof fila !== 'object' || fila === null) return false;
  const f = fila as Record<string, unknown>;
  return (
    typeof f['nombre'] === 'string' && f['nombre'].length > 0 &&
    typeof f['apellidos'] === 'string' && f['apellidos'].length > 0 &&
    typeof f['email'] === 'string' && f['email'].includes('@') &&
    typeof f['rolId'] === 'number'
  );
}

export class CargaMasivaServicio {
  constructor(
    private readonly usuarioRepositorio: UsuarioCargaMasivaRepositorio,
    private readonly parseadorArchivo: ParseadorArchivo,
  ) {}

  async procesarArchivo(buffer: Buffer): Promise<ResultadoCargaMasiva> {
    const filas = this.parseadorArchivo.parsear(buffer);

    if (filas.length === 0) {
      throw new Error('El archivo no contiene datos');
    }

    const usuariosValidos: CrearUsuarioMasivoDto[] = [];
    const errores: ErrorFila[] = [];

    for (let indice = 0; indice < filas.length; indice++) {
      const numeroFila = indice + 2;
      const fila = filas[indice];

      if (!esFilaValida(fila)) {
        errores.push({ fila: numeroFila, motivo: 'Datos incompletos o invalidos' });
        continue;
      }

      const estaRegistrado = await this.usuarioRepositorio.buscarPorEmail(fila.email);

      if (estaRegistrado) {
        errores.push({ fila: numeroFila, motivo: 'El email ya esta registrado' });
        continue;
      }

      usuariosValidos.push(fila);
    }

    if (usuariosValidos.length > 0) {
      await this.usuarioRepositorio.crearMasivo(usuariosValidos);
    }

    return { exitosos: usuariosValidos.length, errores };
  }
}