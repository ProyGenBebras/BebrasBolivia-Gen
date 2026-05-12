export type RolUsuario = 'administrador' | 'coordinador' | 'profesor' | 'estudiante';

export interface Usuario {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: RolUsuario;
  activo: boolean;
  verificado: boolean;
  telefono?: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}
