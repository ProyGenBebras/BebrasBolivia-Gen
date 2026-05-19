import type { usuarios } from '@prisma/client';

import type { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import {
  crearUsuarioRepositorio,
  usuarioRepositorio as repositorioPorDefecto,
} from '../repositorios/usuario-repositorio';
import { ErrorNegocio } from '../utilidades/errores';

type UsuarioRepositorio = ReturnType<typeof crearUsuarioRepositorio>;

/**
 * Puerto de hasheo de contrasenas.
 *
 * PENDIENTE (Angel - Tarea 4 "Encriptar contrasena"): reemplazar el
 * hasheador por defecto por una implementacion real (bcrypt o equivalente,
 * segun RNF-01) una vez que el equipo apruebe agregar la dependencia.
 * No cambiar esta interfaz: el servicio ya esta desacoplado de la libreria.
 */
export interface HasheadorContrasena {
  hashear(contrasenaPlana: string): Promise<string>;
}

/**
 * Stub temporal. NO es seguro para produccion: no hashea realmente.
 * Existe solo para que el flujo compile y se pueda probar la capa de
 * servicio mientras Angel integra el hasheo real. Lanza en runtime si se
 * usa sin reemplazar, para evitar guardar contrasenas en texto plano.
 */
const hasheadorPendiente: HasheadorContrasena = {
  hashear(): Promise<string> {
    return Promise.reject(
      new ErrorNegocio('Hasheo de contrasena no implementado (pendiente Tarea 4 - Angel)', 501),
    );
  },
};

interface DependenciasUsuarioServicio {
  repositorio?: UsuarioRepositorio;
  hasheador?: HasheadorContrasena;
}

interface UsuarioServicio {
  crear(dto: CrearUsuarioDto): Promise<usuarios>;
}

export const crearUsuarioServicio = (
  dependencias: DependenciasUsuarioServicio = {},
): UsuarioServicio => {
  const repositorio = dependencias.repositorio ?? repositorioPorDefecto;
  const hasheador = dependencias.hasheador ?? hasheadorPendiente;

  return {
    /**
     * Crea un usuario nuevo a partir de los datos validados del formulario.
     * Aplica la regla de negocio de correo unico antes de persistir.
     */
    async crear(dto: CrearUsuarioDto): Promise<usuarios> {
      const correoRegistrado = await repositorio.buscarPorCorreo(dto.correo);
      if (correoRegistrado !== null) {
        throw new ErrorNegocio('El correo ya esta registrado', 409);
      }

      const contrasenaHash = await hasheador.hashear(dto.contrasena);

      return repositorio.crear({
        correo: dto.correo,
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        contrasena_hash: contrasenaHash,
        rol: dto.rol,
        nombre_usuario: dto.nombreUsuario ?? null,
        telefono: dto.telefono ?? null,
      });
    },
  };
};

export const usuarioServicio = crearUsuarioServicio();
