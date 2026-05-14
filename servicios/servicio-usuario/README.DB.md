# Base de Datos - Servicio Usuario (Prisma + Neon)

## Alcance
Este documento describe el flujo oficial de base de datos para `servicio-usuario`:
- Prisma `6.18.0`
- PostgreSQL en Neon
- Entornos separados: `dev`, `test`, `production`

## Componentes BD
- `prisma/schema.prisma`: definición actual introspectada desde BD.
- `prisma/migrations/`: historial versionado de cambios.
- `prisma/seed.ts`: seed de datos base.
- `prisma.config.ts`: configura la ruta del schema y el seed para que Prisma CLI los encuentre correctamente en cada entorno.
- `src/config/base-de-datos.ts`: instancia única de `PrismaClient`.
- `src/repositorios/`: acceso a datos por entidad.
- `pruebas/integracion/base-de-datos.test.ts`: conectividad DB.

## Repositorios base
Se proveen tres repositorios de ejemplo en `src/repositorios/`:
- `usuario-repositorio.ts`
- `institucion-repositorio.ts`
- `pregunta-repositorio.ts`

Patrón a seguir para nuevos repositorios:
- Usar `crearXxxRepositorio(conexionBD)` para permitir inyección de dependencias en tests.
- Importar tipos directamente desde `@prisma/client`.
- Nunca instanciar `PrismaClient` dentro del repositorio; usar `src/config/base-de-datos.ts`.

## Variables de entorno
Archivos:
- `.env` (dev)
- `.env.test` (test)
- `.env.production` (production)
- `.env*.example` (plantillas)

Variables requeridas:
- `DATABASE_URL`
- `SHADOW_DATABASE_URL` (obligatoria para `migrate dev` y `migrate reset`)
- `RUN_DB_INTEGRATION_TESTS` (`true` para ejecutar test de conectividad BD)

Reglas:
- `SHADOW_DATABASE_URL` debe ser diferente de `DATABASE_URL`.
- Usar bases separadas por entorno.

## Scripts disponibles
- `npm run prisma:generate`: genera Prisma Client.
- `npm run db:migrate:dev`: crea/aplica migraciones en `dev`.
- `npm run db:migrate:deploy`: aplica migraciones en `production`.
- `npm run db:seed`: ejecuta seed en `dev`.
- `npm run db:seed:test`: ejecuta seed en `test`.
- `npm run db:reset:test`: resetea y reaplica migraciones en `test`.
- `npm run db:test`: test de conectividad BD.
- `npm run db:smoke:test`: generate + reset + seed + test BD + integración.
- `npm test`: ejecuta `pretest` (`prisma:generate`) y luego Jest.

## Flujo recomendado por entorno
1. Dev
- `npm run db:migrate:dev`
- `npm run prisma:generate`
- `npm run db:seed`
- `npm test`

2. Test
- `npm run db:reset:test`
- `npm run db:seed:test`
- `npm run db:test`
- `npm run test:integration`

3. Production
- `npm run db:migrate:deploy`

## Flujo para cambios de esquema
1. Cambiar estructura de BD mediante migración versionada.
2. Aplicar en `dev` (`db:migrate:dev` o `migrate deploy` según el caso).
3. Sincronizar `schema.prisma`:
- `npx prisma db pull --schema prisma/schema.prisma`
4. Regenerar cliente:
- `npx prisma generate --schema prisma/schema.prisma`
5. Validar:
- `npm run lint && npm test`

## Migraciones actuales
1. `20260507210000_init`
- Baseline inicial.
- Crea schema `bebras` y extensión `pgcrypto`.

2. `20260511123000_estandares_63_campos_base`
- Cumplimiento estándar 6.3:
- `activo` -> `esta_activo`
- `creado_en`, `actualizado_en`, `esta_activo` donde faltaban.

3. `20260513090000_estandares_26_booleanos`
- Cumplimiento estándar 2.6 (prefijos booleanos):
- `verificado` -> `esta_verificado`
- `leida` -> `esta_leida`
- `marcada` -> `esta_marcada`
- `permite_reanudar` -> `puede_reanudar`

## Pruebas
- `pruebas/unitarias/`: tests unitarios de repositorios con mock de PrismaClient.
- `pruebas/integracion/base-de-datos.test.ts`: conectividad BD real.

## Notas operativas
- No modificar migraciones ya aplicadas.
- No ejecutar SQL manual en production fuera de migraciones.
- `migration_lock.toml` debe permanecer versionado.
- `db pull` regenera modelos desde la BD real; revisar diff antes de commitear.
- Todo repositorio nuevo debe incluir sus tests unitarios en `pruebas/unitarias/`.