import { Router } from 'express';
import { UsuarioController } from '../controladores/usuario.controller';

const router = Router();

// GET /usuarios/:id/rol
router.get('/:id/rol', UsuarioController.obtenerRol);

// PATCH /usuarios/:id/rol
router.patch('/:id/rol', UsuarioController.cambiarRol);

export default router;
