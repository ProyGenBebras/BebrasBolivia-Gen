export type RolUsuario = 'administrador' | 'coordinador' | 'profesor' | 'estudiante';

export interface Usuario {
  id: string;
  correo: string;
  nombreUsuario: string | null;
  contrasenaHash: string;
  rol: RolUsuario;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  activo: boolean;
  verificado: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

export type UsuarioPublico = Omit<Usuario, 'contrasenaHash'>;

export function aUsuarioPublico(usuario: Usuario): UsuarioPublico {
  const {
    id,
    correo,
    nombreUsuario,
    rol,
    nombres,
    apellidos,
    telefono,
    activo,
    verificado,
    creadoEn,
    actualizadoEn,
  } = usuario;
  return {
    id,
    correo,
    nombreUsuario,
    rol,
    nombres,
    apellidos,
    telefono,
    activo,
    verificado,
    creadoEn,
    actualizadoEn,
  };
}
