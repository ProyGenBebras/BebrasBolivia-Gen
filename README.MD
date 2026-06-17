# BebrasBolivia-Gen

Monorepo: Frontend Next.js + Backend Express + Testing Jest

## Requisitos

- Node.js 22.22.2
- npm 10.9.7
- Git
- Docker Desktop
- nvm (para gestionar versiones de Node)

## Instalación

```bash
# 1. Activar versión de Node
nvm use

# 2. Instalar dependencias exactas de todos los workspaces
npm run install:all
```

## Modo A — Solo BD en Docker (recomendado si solo quieres que tu base de datos este en docker con la version correcta)

```bash
# 1. Levantar solo la base de datos
docker compose up -d postgres_db

# 2. Migrar la BD (primera vez o cuando haya migraciones nuevas)
npm --prefix servicios/servicio-usuario run db:migrate:dev

# 3. Sembrar datos iniciales (admin@bebras.bo / Admin1234)
npm --prefix servicios/servicio-usuario run db:seed

# 4. Backend — http://localhost:4102/health
npm --prefix servicios/servicio-usuario run dev

# 5. Frontend — http://localhost:3000 (en otra terminal)
npm run dev --workspace=cliente
```

> El seed es idempotente — puedes correrlo varias veces sin duplicar datos.

## Modo B — Todo en Docker (Recomendado si no quieres descargar versiones especificas en tu  ya que va estar la DB + backend + frontend)

```bash
npm run docker:build   # construye las imágenes
npm run docker:up      # levanta el stack completo
docker compose down    # apagar (agrega -v para borrar también la BD)
```

- El backend al arrancar ejecuta automáticamente: migrar → sembrar → servir.
- Admin sembrado por defecto (solo dev): `admin@bebras.bo` / `Admin1234`.
- Frontend: <http://localhost:3000> — Backend: <http://localhost:4102/health>

> `npm run docker:build` usa `BUILDX_NO_DEFAULT_ATTESTATIONS=1`. No uses `docker compose build` directamente.

## Comandos Principales

```bash
npm run validate                             # formato + lint + tests (ejecutar antes de push)
npm run build                                # build de todos los workspaces
npm run test --workspace=cliente             # tests del frontend
npm run test --workspace=servicios           # tests del backend
```

## Git Workflow

- `main`: rama estable
- `develop`: rama de integración
- Ramas: `feat/nombre-feature` o `fix/nombre-bug`
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Husky ejecuta lint/format en cada commit y tests en cada push

## Estructura

```
BebrasBolivia-Gen/
├── cliente/              # Frontend Next.js + React (puerto 3000)
├── servicios/
│   └── servicio-usuario/ # Backend Express + Prisma (puerto 4102)
├── .github/workflows/    # CI/CD (ci.yml + deploy.yml)
├── scripts/              # deploy.sh para el self-hosted runner
└── package.json          # Monorepo root
```
