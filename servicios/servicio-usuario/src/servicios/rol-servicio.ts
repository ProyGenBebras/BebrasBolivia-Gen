import { ROLES_PERMITIDOS, type RolUsuario, type Usuario } from '../dominio/usuario';
import { UsuarioRepositorio } from '../repositorios/usuario-repositorio';

interface ErrorNegocio extends Error {
  status: number;
}

const crearErrorNegocio = (mensaje: string, status: number): ErrorNegocio => {
  const error = new Error(mensaje) as ErrorNegocio;
  error.status = status;
  return error;
};

export class RolServicio {
  public constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  public obtenerRolesDisponibles(): RolUsuario[] {
    return [...ROLES_PERMITIDOS];
  }

  public asignarRol(
    idUsuarioObjetivo: string,
    nuevoRol: string,
    usuarioSolicitante: Usuario | null,
  ): Usuario {
    if (usuarioSolicitante === null || usuarioSolicitante.rol !== 'admin') {
      throw crearErrorNegocio('Permisos insuficientes para asignar roles', 403);
    }

    if (!ROLES_PERMITIDOS.includes(nuevoRol as RolUsuario)) {
      throw crearErrorNegocio('Rol no valido', 400);
    }

    const usuarioObjetivo = this.usuarioRepositorio.obtenerPorId(idUsuarioObjetivo);
    if (usuarioObjetivo === null) {
      throw crearErrorNegocio('Usuario no encontrado', 404);
    }

    const usuarioActualizado: Usuario = {
      ...usuarioObjetivo,
      rol: nuevoRol as RolUsuario,
    };

    this.usuarioRepositorio.guardar(usuarioActualizado);
    return usuarioActualizado;
  }
}
