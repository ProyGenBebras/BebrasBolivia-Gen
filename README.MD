# BebrasBolivia-Gen

Monorepo para la plataforma colaborativa BebrasBolivia.

Arquitectura actual:
- Frontend: Next.js (`cliente`)
- Backend: microservicios Node.js/Express (`servicios`)
- Testing: Jest
- Calidad: ESLint + Prettier + Husky

## Estructura actual

```text
BebrasBolivia-Gen/
|-- cliente/                           # Frontend Next.js
|   |-- src/
|   |   |-- app/
|   |   |-- modulos/
|   |   |   `-- user/
|   |   `-- compartido/
|   `-- pruebas/
|       |-- unitarias/
|       |-- integracion/
|       `-- extremo-a-extremo/
|-- servicios/                         # Backend microservicios
|   |-- servicio-autenticacion/
|   |   |-- src/
|   |   |   |-- config/
|   |   |   |-- controladores/
|   |   |   |-- dtos/
|   |   |   |-- middlewares/
|   |   |   |-- modelos/
|   |   |   |-- repositorios/
|   |   |   |-- rutas/
|   |   |   `-- servicios/
|   |   `-- pruebas/
|   |       |-- unitarias/
|   |       `-- integracion/
|   `-- servicio-usuario/
|       |-- src/
|       |   |-- config/
|       |   |-- controladores/
|       |   |-- dtos/
|       |   |-- middlewares/
|       |   |-- modelos/
|       |   |-- repositorios/
|       |   |-- rutas/
|       |   `-- servicios/
|       `-- pruebas/
|           |-- unitarias/
|           `-- integracion/
|-- .github/workflows/ci.yml          # CI (lint, test, build)
|-- .husky/                           # Git hooks
|-- docker-compose.yml
|-- package.json                      # Scripts raiz + workspaces
`-- README.MD
```

## Workspaces

El monorepo usa npm workspaces en la raiz:
- `servicios`
- `cliente`

## Requisitos

- Node.js 22.22.2
- npm >= 9
- Git
- Docker (opcional, para BD/compose)

## Instalacion

Desde la raiz:

```bash
npm ci
npm run install:all
```

## Desarrollo local

### Levantar todo desde raiz

```bash
npm run dev
```

Esto ejecuta:
- `servicios`: `servicio-autenticacion`, `servicio-usuario` en paralelo
- `cliente`: Next.js

### Levantar solo backend microservicios

```bash
npm run dev --workspace=servicios
```

### Levantar solo frontend

```bash
npm run dev --workspace=cliente
```

## Puertos por defecto

Microservicios:
- servicio-autenticacion: `4101`
- servicio-usuario: `4102`

Frontend:
- cliente (Next.js): `3000` (por defecto)

## Scripts principales

Desde la raiz:

```bash
npm run dev
npm run build
npm test
npm run lint
npm run format
npm run format && npm run lint && npm test
```

Scripts utiles por workspace:

```bash
npm run dev --workspace=servicios
npm run build --workspace=servicios
npm run test --workspace=servicios

npm run dev --workspace=cliente
npm run build --workspace=cliente
npm run test --workspace=cliente
```

## Scripts por microservicio

Ejemplos:

```bash
npm --prefix servicios/servicio-autenticacion run dev
npm --prefix servicios/servicio-usuario run dev
npm --prefix servicios/servicio-autenticacion run test:unit
npm --prefix servicios/servicio-autenticacion run test:integration
```

## Docker Compose

Archivo: `docker-compose.yml`

Actualmente incluye:
- `postgres_db` (PostgreSQL)
- `auth-service` (build local)

Levantar compose:

```bash
docker compose up
```

## Calidad y validaciones

### Antes de commit

```bash
npm test
npm run build
```

### Hooks

- `pre-commit`: ejecuta `lint-staged`
- `pre-push`: ejecuta tests

## CI

Workflow: `.github/workflows/ci.yml`

En push a `feat/*`, `develop` y `main`, y en PR hacia `main` o `develop`, ejecuta:
1. Instalacion limpia
2. Format check
3. Lint
4. Type-check (cliente)
5. Tests
6. Build

## Estrategia de ramas

- `develop`: rama de integracion. Aqui se suben y validan cambios del equipo.
- `main`: rama principal estable. Solo recibe cambios ya validados desde `develop`.

Flujo recomendado:
1. Crear rama `feat/*` desde `develop`.
2. Abrir PR de `feat/*` hacia `develop`.
3. Cuando `develop` este estable, abrir PR de `develop` hacia `main`.

Checks obligatorios:
- El workflow ya ejecuta checks para PR a `develop` y `main`.

## Troubleshooting rapido

### La extension Jest en VS Code no detecta comando

Si ves "multiple candidates found", es porque es monorepo con varios paquetes.

Solucion rapida:
- Usar Quick Fix: "Jest: Setup monorepo"

### El frontend no conecta a servicios

Verifica en `cliente/.env`:
- `NEXT_PUBLIC_AUTH_SERVICE_URL`
- `NEXT_PUBLIC_USER_SERVICE_URL`
- `NEXT_PUBLIC_TEAM_SERVICE_URL`

Y confirma que los microservicios estan levantados.

## Convencion de trabajo para equipos

- Cada equipo trabaja por modulo/servicio en su rama.
- Evitar cambios innecesarios en archivos raiz compartidos.
- Correr `npm test` y `npm run build` antes de abrir PR.
- Mantener dominio/aplicacion desacoplados de infraestructura en cada servicio.
