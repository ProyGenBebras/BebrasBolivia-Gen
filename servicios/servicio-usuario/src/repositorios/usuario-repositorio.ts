import type { Prisma, PrismaClient, usuarios, rol_usuario } from '@prisma/client';

import baseDeDatos from '../config/base-de-datos';
import type { ConsultaUsuariosQuery } from '../dtos/consulta-usuarios.dto';

type ConexionBD = Pick<PrismaClient, 'usuarios'>;

// Datos para persistir un usuario nuevo. La contrasena debe llegar ya hasheada
// desde la capa de servicios; el repositorio solo persiste, no transforma datos.
export type DatosCrearUsuario = Prisma.usuariosCreateInput;
export type DatosActualizarUsuario=
  Pick<Partial<Prisma.usuariosUpdateInput>, 'nombres' | 'apellidos' | 'correo' | 'telefono'>;

// Ejemplo base: agregar nuevos metodos segun necesidades de cada modulo.
const MAX_INTENTOS_FALLIDOS = 5;
const MINUTOS_BLOQUEO = 15;

type UsuarioRepositorio = {
  buscarPorId(id: string): Promise<usuarios | null>;
  buscarPorCorreo(correo: string): Promise<usuarios | null>;
  crear(datos: DatosCrearUsuario): Promise<usuarios>;
  buscarPorCorreoExcluyendo(correo: string, idExcluir: string): Promise<usuarios | null>;
  actualizarPerfil(id: string, datos: DatosActualizarUsuario): Promise<usuarios>;
  listar(params: ConsultaUsuariosQuery): Promise<{ usuarios: usuarios[]; total: number }>;
  eliminar(id: string): Promise<usuarios>;
  actualizarEstadoActivo(id: string, estaActivo: boolean): Promise<usuarios>;
  registrarIntentoFallido(id: string): Promise<usuarios>;
  registrarLoginExitoso(id: string, ip?: string): Promise<usuarios>;
};

export const crearUsuarioRepositorio = (conexionBD: ConexionBD): UsuarioRepositorio => ({
  async buscarPorId(id: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findUnique({ where: { id } });
  },

  async buscarPorCorreo(correo: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({ where: { correo } });
  },

  async crear(datos: DatosCrearUsuario): Promise<usuarios> {
    return conexionBD.usuarios.create({ data: datos });
  },

  async buscarPorCorreoExcluyendo(correo: string, idExcluir: string): Promise<usuarios | null> {
    return conexionBD.usuarios.findFirst({
      where: {
        correo,
        id: { not: idExcluir },
      },
    });
  },

  async actualizarPerfil(id: string, datos: DatosActualizarUsuario): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: {
        ...datos,
        actualizado_en: new Date(),
      },
    });
  },

  async listar(params: ConsultaUsuariosQuery): Promise<{
    usuarios: usuarios[];
    total: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      rol, 
      estaActivo, 
      search, 
      orderBy = 'creado_en', 
      orderDir = 'desc' 
    } = params;
    
    const where: Prisma.usuariosWhereInput = {};
    
    if (rol) {
      where.rol = rol as rol_usuario;
    }
    
    if (estaActivo !== undefined) {
      where.esta_activo = estaActivo;
    }
    
    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { apellidos: { contains: search, mode: 'insensitive' } },
        { correo: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [usuarios, total] = await Promise.all([
      conexionBD.usuarios.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: orderDir },
      }),
      conexionBD.usuarios.count({ where }),
    ]);
    
    return { usuarios, total };
  },

  async eliminar(id: string): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: { esta_activo: false },
    });
  },

  async actualizarEstadoActivo(id: string, estaActivo: boolean): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: { esta_activo: estaActivo, actualizado_en: new Date() },
    });
  },

  async registrarIntentoFallido(id: string): Promise<usuarios> {
    const usuario = await conexionBD.usuarios.findUnique({
      where: { id },
      select: { intentos_fallidos: true },
    });
    const intentos = (usuario?.intentos_fallidos ?? 0) + 1;
    const bloqueadoHasta =
      intentos >= MAX_INTENTOS_FALLIDOS
        ? new Date(Date.now() + MINUTOS_BLOQUEO * 60 * 1000)
        : null;
    return conexionBD.usuarios.update({
      where: { id },
      data: { intentos_fallidos: intentos, bloqueado_hasta: bloqueadoHasta },
    });
  },

  async registrarLoginExitoso(id: string, ip?: string): Promise<usuarios> {
    return conexionBD.usuarios.update({
      where: { id },
      data: {
        intentos_fallidos: 0,
        bloqueado_hasta: null,
        ultimo_acceso_en: new Date(),
        ultimo_acceso_ip: ip ?? null,
        actualizado_en: new Date(),
      },
    });
  },
});

export const usuarioRepositorio = crearUsuarioRepositorio(baseDeDatos);