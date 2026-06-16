# ===========================================================
# Backend - servicio-usuario (Express + Prisma + TypeScript)
# Se compila a JS con tsup (dist/) y se ejecuta con node puro (sin tsx en runtime).
# Imagen única: el mismo contenedor migra/siembra al arrancar y luego sirve.
# ===========================================================
# Imagen base fijada por digest del INDICE multi-arch (resuelve amd64 en dev y arm64 en el server ARM)
FROM node:22-alpine@sha256:9385cd9f3001dfc3431e8ead12c43e9e1f87cc1b9b5c6cfd0f73865d405b27c4 AS base
# openssl es requerido por los motores de Prisma en Alpine
RUN apk add --no-cache openssl
WORKDIR /app

# --- Build: instala TODO, compila a dist/, poda dev-deps y genera el cliente Prisma ---
# Orden clave: build (necesita tsup) -> prune (quita tsx/tsup/jest, conserva prisma) ->
# generate AL FINAL (así .prisma no lo elimina el prune). Resultado: un node_modules
# de producción con el cliente ya generado y sin herramientas de desarrollo.
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsup.config.ts ./
COPY prisma ./prisma
COPY src ./src
RUN npm run build \
  && npm prune --omit=dev \
  && npx prisma generate --schema prisma/schema.prisma

# --- Imagen final de ejecución (slim, usuario no-root) ---
FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --chown=node:node package.json ./
USER node
EXPOSE 4102
# 1) Crea el esquema "bebras" (requerido por multiSchema)  2) Migra  3) Siembra (idempotente)  4) Sirve
CMD ["sh", "-c", "echo 'CREATE SCHEMA IF NOT EXISTS \"bebras\";' | npx prisma db execute --schema prisma/schema.prisma --stdin && npx prisma migrate deploy --schema prisma/schema.prisma && node dist/seed.js && node dist/server.js"]
