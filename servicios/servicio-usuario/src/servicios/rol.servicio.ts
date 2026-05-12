import type { ActualizarRolDto, AsignarRolDto, CrearRolDto } from '../dtos/rol.dto.js';
import type { Rol, RolConUsuarios, UsuarioEnRol } from '../modelos/rol.modelo.js';
import type { RolRepositorio } from '../repositorios/rol.repositorio.js';
import { ErrorNegocio } from '../utilidades/errores.js';

export { ErrorNegocio };

export class RolServicio {
  constructor(private readonly rolRepositorio: RolRepositorio) {}

  async listar(): Promise<RolConUsuarios[]> {
    return this.rolRepositorio.obtenerTodos();
  }

  async obtenerPorId(id: number): Promise<RolConUsuarios> {
    const rol = await this.rolRepositorio.obtenerPorId(id);
    if (!rol) {
      throw new ErrorNegocio(`Rol con id ${id} no encontrado`, 404);
    }
    return rol;
  }

  async crear(datos: CrearRolDto): Promise<Rol> {
    const existente = await this.rolRepositorio.obtenerPorNombre(datos.nombre);
    if (existente) {
      throw new ErrorNegocio(`El rol '${datos.nombre}' ya existe`, 409);
    }
    return this.rolRepositorio.crear(datos);
  }

  async actualizar(id: number, datos: ActualizarRolDto): Promise<Rol> {
    await this.obtenerPorId(id);
    if (datos.nombre) {
      const existente = await this.rolRepositorio.obtenerPorNombre(datos.nombre);
      if (existente && existente.id !== id) {
        throw new ErrorNegocio(`El nombre de rol '${datos.nombre}' ya está en uso`, 409);
      }
    }
    return this.rolRepositorio.actualizar(id, datos);
  }

  async asignarRol(datos: AsignarRolDto): Promise<void> {
    await this.obtenerPorId(datos.rolId);
    await this.rolRepositorio.asignarAUsuario(datos);
  }

  async obtenerUsuariosDeRol(rolId: number): Promise<UsuarioEnRol[]> {
    await this.obtenerPorId(rolId);
    return this.rolRepositorio.obtenerUsuariosPorRol(rolId);
  }
}
