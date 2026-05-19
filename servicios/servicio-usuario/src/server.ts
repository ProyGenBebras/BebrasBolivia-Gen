import app from './app';

const PORT = Number(process.env.PORT ?? 4102);

app.listen(PORT);
