import { Router } from 'express';
import { UsuarioControlador } from '../controladores/usuario.controlador';
import { UsuarioServicio } from '../servicios/usuario.servicio';
import { UsuarioRepositorioMock } from '../repositorios/usuario.repositorio.mock';

const router = Router();

// Inyección de dependencias manual
const usuarioRepositorio = new UsuarioRepositorioMock();
const usuarioServicio = new UsuarioServicio(usuarioRepositorio);
const usuarioControlador = new UsuarioControlador(usuarioServicio);

router.get('/', (req, res) => usuarioControlador.listar(req, res));

export default router;
