import { Router } from 'express';
import { CargaMasivaControlador } from '../controladores/carga-masiva.controlador.js';
import { CargaMasivaServicio } from '../servicios/carga-masiva.servicio.js';
import type { UsuarioCargaMasivaRepositorio, ParseadorArchivo } from '../servicios/carga-masiva.servicio.js';

const configurarRutasCargaMasiva = (
  usuarioRepositorio: UsuarioCargaMasivaRepositorio,
  parseadorArchivo: ParseadorArchivo,
): Router => {
  const router = Router();
  const servicio = new CargaMasivaServicio(usuarioRepositorio, parseadorArchivo);
  const controlador = new CargaMasivaControlador(servicio);

  router.post('/', (req, res) => controlador.cargarUsuarios(req, res));

  return router;
};

export default configurarRutasCargaMasiva;