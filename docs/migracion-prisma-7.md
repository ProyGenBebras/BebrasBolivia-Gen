# Plan de migración a Prisma 7 (servicio-usuario)

> Estado actual: `prisma@6.19.3` + `@prisma/client@6.19.3` (alineados).
> El CLI ya muestra el aviso `Update available 6.x -> 7.x`.
> Decisión vigente: **permanecer en 6.19.3** hasta ejecutar este plan como tarea propia.

## Por qué no migramos todavía

- Prisma 7 exige declarar `output` en el generator y cambia la forma de importar el
  cliente: **26 archivos** del servicio importan `@prisma/client` hoy (22 en `src/`,
  1 seed, 3 tests). Es un cambio mecánico pero transversal.
- El stack actual funciona y está cubierto por tests (130 unitarios + 31 de
  integración) — no hay beneficio funcional inmediato que justifique el riesgo.

## Estado de los prerequisitos (ya cumplidos)

| Prerequisito Prisma 7 | Estado |
|---|---|
| `prisma.config.ts` en lugar de config en package.json | ✅ ya existe |
| Versiones CLI/cliente alineadas | ✅ 6.19.3 |
| Suite de tests para validar la migración | ✅ unitarios + integración con BD real |
| Réplica local del CI (`docker-compose.ci.yml`) | ✅ |

## Pasos de la migración (cuando se decida ejecutarla)

1. **Leer la guía oficial**: https://pris.ly/d/major-version-upgrade
2. **Rama dedicada**: `chore/prisma-7`.
3. **Actualizar dependencias** en `servicios/servicio-usuario`:
   ```bash
   npm i --save prisma@latest @prisma/client@latest
   ```
   (ambas están en `dependencies` porque la imagen Docker las usa en runtime).
4. **Actualizar el generator** en `prisma/schema.prisma` según la guía
   (nuevo provider `prisma-client` + `output` explícito, p. ej. `../src/generado/prisma`).
5. **Actualizar imports** en los 26 archivos: `from '@prisma/client'` → ruta del
   cliente generado. Tipos como `usuarios`, `rol_usuario`, `instituciones`,
   `preguntas`, `PrismaClient` vienen del mismo módulo generado.
6. **Revisar los puntos de runtime**:
   - `src/config/base-de-datos.ts` (instancia PrismaClient)
   - `prisma/seed.ts`
   - `Dockerfile` (CMD usa `prisma db execute`, `migrate deploy` y el seed; verificar
     flags/binarios del CLI 7 y si `npx prisma generate` cambia de artefactos)
   - El gotcha multiSchema (`?schema=bebras` en `DATABASE_URL`) — verificar si Prisma 7
     cambia el manejo de `_prisma_migrations` con multiSchema.
7. **Validar**:
   ```bash
   docker compose -f docker-compose.ci.yml run --rm --build ci-sim   # format+lint+test+build
   docker compose build user-service && docker compose up -d         # arranque real
   curl localhost:4102/health && curl -H "x-usuario-id: 00000000-0000-0000-0000-000000000001" localhost:4102/api/v1/usuarios
   ```
8. **Plan B**: si algo falla, `git checkout` de la rama y permanecer en 6.19.3
   (no hay cambios de esquema de BD involucrados; la migración es solo de tooling).

## Archivos afectados (inventario al 2026-06-03)

22 en `src/` (dtos, repositorios, servicios, controladores, middlewares, compartido,
config, rutas), `prisma/seed.ts` y 3 archivos de pruebas. Regenerar el inventario con:

```bash
grep -rln "@prisma/client" servicios/servicio-usuario/{src,prisma,pruebas}
```
