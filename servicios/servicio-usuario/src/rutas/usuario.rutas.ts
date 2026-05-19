import { Router } from 'express';

import { UsuarioControlador } from '../controladores/usuario.controlador';
import { UsuarioRepositorioMock } from '../repositorios/usuario.repositorio.mock';
import { UsuarioServicio } from '../servicios/usuario.servicio';

const router = Router();

// Inyección de dependencias manual
const usuarioRepositorio = new UsuarioRepositorioMock();
const usuarioServicio = new UsuarioServicio(usuarioRepositorio);
const usuarioControlador = new UsuarioControlador(usuarioServicio);

router.get('/', (req, res) => {
  void usuarioControlador.listar(req, res);
});

export default router;
