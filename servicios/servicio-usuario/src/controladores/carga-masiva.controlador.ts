import type { Request, Response } from 'express';

import type { CargaMasivaServicio } from '../servicios/carga-masiva.servicio.js';

interface RequestConArchivo extends Request {
  file?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}

export class CargaMasivaControlador {
  constructor(private readonly cargaMasivaServicio: CargaMasivaServicio) {}

  async cargarUsuarios(req: RequestConArchivo, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ error: 'No se recibio ningun archivo' });
      return;
    }
    const resultado = await this.cargaMasivaServicio.procesarArchivo(req.file.buffer);
    res.status(200).json(resultado);
  }
}