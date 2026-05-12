import { describe, expect, it } from '@jest/globals';
import { validarPerfil } from '../../src/modulos/user/dominio/validar-perfil';

describe('validarPerfil', () => {
  const datosValidos = {
    nombres: 'Juan Pérez',
    apellidos: 'García López',
    correo: 'juan.perez@ejemplo.com',
    telefono: '12345678'
  };

  describe('Nombres', () => {
    it('debería retornar error si nombres está vacío', () => {
      const errores = validarPerfil({ ...datosValidos, nombres: '   ' });
      expect(errores.nombres).toBe('El nombre es obligatorio');
    });

    it('debería retornar error si nombres tiene menos de 2 caracteres', () => {
      const errores = validarPerfil({ ...datosValidos, nombres: 'A' });
      expect(errores.nombres).toBe('El nombre debe tener al menos 2 caracteres');
    });

    it('debería retornar error si nombres tiene más de 25 caracteres', () => {
      const nombresLargo = 'A'.repeat(26);
      const errores = validarPerfil({ ...datosValidos, nombres: nombresLargo });
      expect(errores.nombres).toBe('El nombre no debe exceder los 25 caracteres');
    });

    it('debería retornar error si nombres tiene caracteres no permitidos', () => {
      const errores = validarPerfil({ ...datosValidos, nombres: 'Juan123' });
      expect(errores.nombres).toBe('El nombre solo puede contener letras y espacios');
    });

    it('no debería retornar error para un nombre válido', () => {
      const errores = validarPerfil(datosValidos);
      expect(errores.nombres).toBeUndefined();
    });
  });

  describe('Apellidos', () => {
    it('debería retornar error si apellidos está vacío', () => {
      const errores = validarPerfil({ ...datosValidos, apellidos: '' });
      expect(errores.apellidos).toBe('Los apellidos son obligatorios');
    });

    it('debería retornar error si apellidos tiene menos de 2 caracteres', () => {
      const errores = validarPerfil({ ...datosValidos, apellidos: 'A' });
      expect(errores.apellidos).toBe('Los apellidos deben tener al menos 2 caracteres');
    });

    it('debería retornar error si apellidos tiene más de 25 caracteres', () => {
      const apellidosLargo = 'A'.repeat(26);
      const errores = validarPerfil({ ...datosValidos, apellidos: apellidosLargo });
      expect(errores.apellidos).toBe('Los apellidos no deben exceder los 25 caracteres');
    });

    it('debería retornar error si apellidos tiene caracteres no permitidos', () => {
      const errores = validarPerfil({ ...datosValidos, apellidos: 'García_López' });
      expect(errores.apellidos).toBe('Los apellidos solo pueden contener letras y espacios');
    });

    it('no debería retornar error para un apellido válido', () => {
      const errores = validarPerfil(datosValidos);
      expect(errores.apellidos).toBeUndefined();
    });
  });

  describe('Correo', () => {
    it('debería retornar error si correo está vacío', () => {
      const errores = validarPerfil({ ...datosValidos, correo: '' });
      expect(errores.correo).toBe('El correo es obligatorio');
    });

    it('debería retornar error si correo tiene un formato inválido', () => {
      const errores = validarPerfil({ ...datosValidos, correo: 'correo-invalido' });
      expect(errores.correo).toBe('El correo no tiene un formato válido');
    });

    it('debería retornar error si correo tiene más de 100 caracteres', () => {
      const correoLargo = 'a'.repeat(91) + '@ejemplo.com';
      const errores = validarPerfil({ ...datosValidos, correo: correoLargo });
      expect(errores.correo).toBe('El correo es demasiado largo');
    });

    it('no debería retornar error para un correo válido', () => {
      const errores = validarPerfil(datosValidos);
      expect(errores.correo).toBeUndefined();
    });
  });

  describe('Teléfono', () => {
    it('debería retornar error si teléfono está vacío', () => {
      const errores = validarPerfil({ ...datosValidos, telefono: '' });
      expect(errores.telefono).toBe('El teléfono es obligatorio');
    });

    it('debería retornar error si teléfono tiene un formato inválido', () => {
      const errores = validarPerfil({ ...datosValidos, telefono: 'telefono123' });
      expect(errores.telefono).toBe('Ingrese un teléfono válido (7-15 dígitos)');
    });

    it('debería retornar error si teléfono tiene menos de 7 dígitos', () => {
      const errores = validarPerfil({ ...datosValidos, telefono: '123456' });
      expect(errores.telefono).toBe('Ingrese un teléfono válido (7-15 dígitos)');
    });

    it('debería retornar error si teléfono tiene más de 15 dígitos', () => {
      const errores = validarPerfil({ ...datosValidos, telefono: '1234567890123456' });
      expect(errores.telefono).toBe('Ingrese un teléfono válido (7-15 dígitos)');
    });

    it('no debería retornar error para un teléfono válido', () => {
      const errores = validarPerfil(datosValidos);
      expect(errores.telefono).toBeUndefined();
    });
  });
});
