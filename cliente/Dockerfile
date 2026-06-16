# ===========================================================
# Frontend - cliente (Next.js + Tailwind)
# ===========================================================
# Imagen base fijada por digest del INDICE multi-arch (resuelve amd64 en dev y arm64 en el server ARM)
FROM node:22-alpine@sha256:9385cd9f3001dfc3431e8ead12c43e9e1f87cc1b9b5c6cfd0f73865d405b27c4 AS base
WORKDIR /app

# --- Dependencias (instalación reproducible con lockfile) ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build de Next.js ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Las variables NEXT_PUBLIC_* se incrustan en build-time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# --- Imagen final (Next.js standalone: servidor mínimo y autocontenido) ---
FROM base AS runtime
ENV NODE_ENV=production
# Next standalone debe escuchar en todas las interfaces para ser accesible desde fuera del contenedor
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# El servidor standalone trae su propio node_modules mínimo; .next/static y public van aparte
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
