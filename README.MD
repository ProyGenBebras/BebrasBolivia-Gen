# BebrasBolivia-Gen

Monorepo: Frontend Next.js + Backend Express + Testing Jest

## Requisitos

- Node.js 22.22.2
- npm 10.9.7
- Git
- nvm (para gestionar versiones de Node)

## Inicio Rápido

```bash
# 1. Activar versión de Node
nvm use

# 2. Instalar dependencias exactas (IMPORTANTE: usa npm ci, NO npm install)
npm ci

# 3. Ejecutar frontend (Next.js) - http://localhost:3000
npm run dev --workspace=cliente

# 4. Ejecutar backend (Express) - http://localhost:4102/health
npm --prefix servicios/servicio-usuario run dev

# 5. Ejecutar tests
npm run validate
```

**¿Por qué `npm ci` y no `npm install`?**

- `npm ci` (Clean Install): Instala **versiones exactas** del `package-lock.json`. Garantiza que todos en el equipo tengan exactamente las mismas versiones. **ESTO ES LO QUE DEBES USAR.**
- `npm install`: Puede actualizar versiones según los rangos (`^`, `~`). Puede causar diferencias entre máquinas del equipo.

**Resumen**: Siempre usa `npm ci` en el setup inicial. Solo usa `npm install` si necesitas agregar una dependencia nueva.

## Comandos Principales

```bash
# Tests y validación completa (ejecutar antes de push)
npm run validate

# Tests por workspace
npm run test --workspace=cliente
npm run test --workspace=servicios

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## Docker

Dos formas de levantar el proyecto:

```bash
# A) Solo la base de datos en Docker (recomendado para desarrollar con hot-reload)
docker compose up -d postgres_db
# ...luego correr backend y frontend en local (ver Inicio Rápido)

# B) Todo el stack (DB + backend + frontend) en contenedores
npm run docker:build     # construye las imágenes (sin attestation manifests, ver abajo)
npm run docker:up        # = docker compose up -d
docker compose down      # apagar (agrega -v para borrar también la BD)
```

- **`npm run docker:build`** usa `BUILDX_NO_DEFAULT_ATTESTATIONS=1`: desactiva los
  *attestation manifests* que infla cada imagen sin beneficio en local. No uses
  `docker compose build` a secas (vuelve a agregarlos).
- El **backend** se compila a `dist/` con tsup (no usa `tsx` en runtime) y, al arrancar,
  crea el esquema, migra, siembra (idempotente) y sirve — todo en el `CMD` del Dockerfile.
- Ambas imágenes de producción corren como usuario **no-root** (`node`).
- El **frontend** queda en http://localhost:3000 y el **backend** en http://localhost:4102/health.
- Admin sembrado por defecto (solo dev): `admin@bebras.bo` / `Admin1234`.

> `Dockerfile.ci` + `docker-compose.ci.yml` construyen la imagen `bebras-ci-sim` (~2.37 GB),
> una réplica local del workflow de CI. Es **temporal**: constrúyela solo para simular CI
> (`docker compose -f docker-compose.ci.yml build`) y bórrala después (`docker image rm bebras-ci-sim`).

## Git Workflow

- `main`: rama estable
- `develop`: rama de integración
- Crear PR con formato: `feat/nombre-feature` o `fix/nombre-bug`
- Usar Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Todo commit ejecuta hooks automáticos (lint, format, tests)

## Estructura

```
BebrasBolivia-Gen/
├── cliente/              # Frontend Next.js + React
├── servicios/
│   └── servicio-usuario/ # Backend Express (puerto 4102)
├── .husky/               # Git hooks
├── .github/workflows/    # CI/CD
└── package.json          # Monorepo root
```
- Evitar cambios innecesarios en archivos raiz compartidos.
- Correr `npm test` y `npm run build` antes de abrir PR.
- Mantener dominio/aplicacion desacoplados de infraestructura en cada servicio.
