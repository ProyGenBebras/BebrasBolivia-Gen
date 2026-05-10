import { CrearUsuarioSchema } from '../../src/dtos/crear-usuario.dto';

describe('CrearUsuarioSchema (validación)', () => {
  const datosValidos = {
    correo: 'admin@bebras.bo',
    contrasena: 'contrasenaSegura1',
    nombres: 'Ana',
    apellidos: 'Pérez',
    rol: 'administrador',
  };

  it('debería aceptar un cuerpo válido y normalizar el correo a minúsculas', () => {
    const resultado = CrearUsuarioSchema.parse({ ...datosValidos, correo: 'ADMIN@Bebras.BO' });
    expect(resultado.correo).toBe('admin@bebras.bo');
  });

  it('debería rechazar correos inválidos', () => {
    const resultado = CrearUsuarioSchema.safeParse({ ...datosValidos, correo: 'no-es-email' });
    expect(resultado.success).toBe(false);
  });

  it('debería rechazar contraseñas con menos de 8 caracteres', () => {
    const resultado = CrearUsuarioSchema.safeParse({ ...datosValidos, contrasena: '1234567' });
    expect(resultado.success).toBe(false);
  });

  it('debería rechazar roles que no estén en el ENUM permitido', () => {
    const resultado = CrearUsuarioSchema.safeParse({ ...datosValidos, rol: 'superadmin' });
    expect(resultado.success).toBe(false);
  });

  it('debería rechazar nombres vacíos', () => {
    const resultado = CrearUsuarioSchema.safeParse({ ...datosValidos, nombres: '' });
    expect(resultado.success).toBe(false);
  });

  it('debería permitir teléfono y nombreUsuario opcionales', () => {
    const resultado = CrearUsuarioSchema.parse({
      ...datosValidos,
      telefono: '70000000',
      nombreUsuario: 'admin01',
    });
    expect(resultado.telefono).toBe('70000000');
    expect(resultado.nombreUsuario).toBe('admin01');
  });

  it('debería convertir cadenas vacías opcionales en undefined', () => {
    const resultado = CrearUsuarioSchema.parse({
      ...datosValidos,
      telefono: '',
      nombreUsuario: '',
    });
    expect(resultado.telefono).toBeUndefined();
    expect(resultado.nombreUsuario).toBeUndefined();
  });
});
