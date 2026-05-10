import { z } from 'zod';

export const ROLES_USUARIO = ['administrador', 'coordinador', 'profesor', 'estudiante'] as const;

export const CrearUsuarioSchema = z.object({
  correo: z
    .email({ error: 'El correo no tiene un formato válido' })
    .max(255, 'El correo no puede superar 255 caracteres')
    .toLowerCase()
    .trim(),
  contrasena: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede superar 255 caracteres'),
  nombres: z
    .string({ error: 'Los nombres son obligatorios' })
    .trim()
    .min(1, 'Los nombres no pueden estar vacíos')
    .max(100, 'Los nombres no pueden superar 100 caracteres'),
  apellidos: z
    .string({ error: 'Los apellidos son obligatorios' })
    .trim()
    .min(1, 'Los apellidos no pueden estar vacíos')
    .max(100, 'Los apellidos no pueden superar 100 caracteres'),
  rol: z.enum(ROLES_USUARIO, {
    error: `El rol debe ser uno de: ${ROLES_USUARIO.join(', ')}`,
  }),
  telefono: z
    .string()
    .trim()
    .max(20, 'El teléfono no puede superar 20 caracteres')
    .optional()
    .transform((valor) => (valor === '' ? undefined : valor)),
  nombreUsuario: z
    .string()
    .trim()
    .max(100, 'El nombre de usuario no puede superar 100 caracteres')
    .optional()
    .transform((valor) => (valor === '' ? undefined : valor)),
});

export type CrearUsuarioDto = z.infer<typeof CrearUsuarioSchema>;
