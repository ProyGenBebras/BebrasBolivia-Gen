import { defineConfig } from 'tsup';

/**
 * Bundle del backend para producción.
 * - Dos entradas: el servidor HTTP y el seed (ambos los ejecuta el CMD del contenedor al arrancar).
 * - Resuelve los imports relativos sin extensión (lo que antes obligaba a usar tsx).
 * - Las dependencias de node_modules (Prisma, bcrypt nativo, express, ...) quedan externas;
 *   se instalan en la imagen con `npm ci --omit=dev`, no se empaquetan.
 */
export default defineConfig({
  entry: { server: 'src/server.ts', seed: 'prisma/seed.ts' },
  outDir: 'dist',
  format: ['esm'],
  target: 'node22',
  platform: 'node',
  splitting: false,
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
});
