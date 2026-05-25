import cors from 'cors';
import express from 'express';
import { manejadorErrorHttp } from './compartido/infraestructura/http/manejador-error-http';
import rutasRol from './rutas/rol-rutas';
import rutasUsuario from './rutas/usuario-rutas';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/v1/roles', rutasRol);
app.use('/api/v1/usuarios', rutasUsuario);

app.use(manejadorErrorHttp);

const PORT = process.env.USER_SERVICE_PORT || 4102;
app.listen(PORT, () => {
  console.warn("Servidor de usuarios corriendo en el puerto");
});
