# Base de datos (Prisma + Neon)

## Objetivo
Estandarizar el manejo de base de datos del servicio de usuario con Prisma 6.18.0 sobre Neon (PostgreSQL 16), incluyendo:
- migraciones versionadas,
- seed,
- separación de entornos (`dev`, `test`, `prod`),
- verificación rápida con pruebas de conectividad.

## Estructura
- `prisma/schema.prisma`: datasource y configuración de Prisma.
- `prisma/migrations/20260507210000_init/migration.sql`: baseline inicial del esquema.
- `prisma/seed.ts`: seed mínimo para validar conectividad.
- `prisma.config.ts`: configuración central de Prisma (schema + seed).
- `pruebas/integracion/base-de-datos.test.ts`: prueba de conectividad a BD.

## Archivos de entorno
- `.env`: desarrollo.
- `.env.test`: pruebas/integración.
- `.env.production`: producción.
- `.env.example`, `.env.test.example`, `.env.production.example`: plantillas.

Variables esperadas:
- `DATABASE_URL`: conexión principal.
- `SHADOW_DATABASE_URL`: necesaria para operaciones de migración en `dev/test` (`migrate dev`, `migrate reset`).

Importante:
- `SHADOW_DATABASE_URL` no debe ser igual a `DATABASE_URL`.
- usar bases/branches separados para `dev`, `test` y `prod`.

## Scripts disponibles
- `npm run prisma:generate`: genera Prisma Client.
- `npm run db:migrate:dev`: crea/aplica migraciones en entorno local.
- `npm run db:migrate:deploy`: aplica migraciones en producción.
- `npm run db:seed`: ejecuta seed en `local`.
- `npm run db:seed:test`: ejecuta seed en `test`.
- `npm run db:reset:test`: resetea y reaplica migraciones en `test`.
- `npm run db:test`: ejecuta el test de conectividad BD.
- `npm run db:smoke:test`: flujo completo en `test`.

## Flujo de trabajo recomendado
1. Actualizar `schema.prisma` o SQL de migración.
2. Ejecutar `npm run db:migrate:dev`.
3. Ejecutar `npm run prisma:generate`.
4. Ejecutar `npm run db:seed`.
5. Validar con `npm run db:test`.

## Smoke test (todo en uno)
Comando:
`npm run db:smoke:test`

Incluye:
- generate,
- reset en test,
- seed en test,
- test de conectividad BD,
- tests de integración.

## Migración inicial
- Baseline: `prisma/migrations/20260507210000_init/migration.sql`.
- Se añadió creación de schema y extensión requeridos:
`CREATE SCHEMA IF NOT EXISTS "bebras";`
`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
