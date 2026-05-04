import app from './app';

const PORT = Number(process.env.PORT ?? 4101);

app.listen(PORT, () => {
  console.warn(`servicio-autenticacion escuchando en el puerto ${PORT}`);
});
