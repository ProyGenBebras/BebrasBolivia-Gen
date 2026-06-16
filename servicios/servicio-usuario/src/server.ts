/**
 * Punto de entrada del servicio: arranca el servidor HTTP.
 * Toda la configuración de la app vive en app.ts.
 */

import app from './app';

const PORT = process.env.USER_SERVICE_PORT || 4102;

app.listen(PORT, () => {
  console.warn(`Servidor de usuarios corriendo en el puerto ${PORT}`);
});
