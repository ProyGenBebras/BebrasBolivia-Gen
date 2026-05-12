import { Router } from 'express';

import { UsuarioControlador } from '../controladores/usuario.controlador.js';
import { UsuarioRepositorio } from '../repositorios/usuario.repositorio.js';
import { UsuarioServicio } from '../servicios/usuario.servicio.js';

const enrutador = Router();

const repositorio = new UsuarioRepositorio();
const servicio = new UsuarioServicio(repositorio);
const controlador = new UsuarioControlador(servicio);

enrutador.delete('/:id', (req, res) => void controlador.eliminarUsuario(req, res));

export default enrutador;
