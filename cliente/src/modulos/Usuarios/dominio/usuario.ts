// Roles validos del sistema. Coinciden con el enum rol_usuario del esquema
// Prisma del backend (no inventar otros: la BD solo acepta estos cuatro).
export type RolUsuario = 'administrador' | 'coordinador' | 'profesor' | 'estudiante';

export const ROLES_USUARIO: ReadonlyArray<{ valor: RolUsuario; etiqueta: string }> = [
  { valor: 'administrador', etiqueta: 'Administrador' },
  { valor: 'coordinador', etiqueta: 'Coordinador' },
  { valor: 'profesor', etiqueta: 'Profesor' },
  { valor: 'estudiante', etiqueta: 'Estudiante' },
];

// Datos que el administrador completa en el formulario de registro manual.
export interface CrearUsuarioPayload {
  correo: string;
  nombres: string;
  apellidos: string;
  contrasena: string;
  rol: RolUsuario;
  nombreUsuario?: string;
  telefono?: string;
}

// Usuario tal como lo devuelve el backend (sin contrasena_hash, por seguridad).
export interface Usuario {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: RolUsuario;
  nombreUsuario: string | null;
  telefono: string | null;
  estaActivo: boolean;
  estaVerificado: boolean;
  creadoEn: string;
}
