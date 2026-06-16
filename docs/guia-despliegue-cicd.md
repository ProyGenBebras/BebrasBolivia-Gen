# Guía de despliegue CI/CD (servidor Ubuntu + Self-Hosted Runner)

Implementa el pipeline pedido: **push a `main` → CI en GitHub (nube) → CD en tu
servidor Ubuntu** vía un Self-Hosted Runner que ejecuta `scripts/deploy.sh` con
`docker compose`.

## Cómo está armado (resumen)

| Pieza | Archivo | Rol |
|---|---|---|
| Pipeline | [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) | `fase-integracion-continua` (ubuntu-latest) + `fase-despliegue-continuo` (self-hosted) |
| CI de PRs/develop | [.github/workflows/ci.yml](../.github/workflows/ci.yml) | Valida PRs y `develop` (no `main`, para no duplicar) |
| Script de despliegue | [scripts/deploy.sh](../scripts/deploy.sh) | Escribe `.env` desde secretos + `docker compose down/build/up` |
| Orquestación | [docker-compose.yml](../docker-compose.yml) | Lee credenciales por variables (`${DB_USER}`, etc.) con defaults locales |
| Variables | [.env.example](../.env.example) | Referencia de las variables que sustituye el compose |

> **Diferencias intencionales con la guía genérica del curso**: usamos Node **22**
> (no 20), `npm run install:all` (monorepo), nuestros Dockerfiles multi-stage reales
> (con Prisma/migraciones/seed) en lugar del `index.js` de ejemplo, y `scripts/deploy.sh`
> **versionado en el repo** (en vez de `~/deploy.sh`) para que se actualice con cada
> despliegue. La fase CI también corre lint/format/build y tests de integración con
> Postgres real, no solo `npm test`.

---

## 1. Preparar el servidor Ubuntu (Docker)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Permitir a tu usuario (y al runner) usar Docker sin sudo
sudo usermod -aG docker $USER
```

**Cierra sesión y vuelve a entrar** (o reinicia) para que el grupo `docker` tome efecto.
Verifica: `docker run --rm hello-world`.

## 2. Instalar el Self-Hosted Runner como servicio

1. En GitHub: **Settings → Actions → Runners → New self-hosted runner → Linux**.
2. Ejecuta en el servidor los comandos de **Download** y luego **Configure**:
   ```bash
   ./config.sh --url https://github.com/TU_USUARIO/TU_REPO --token TU_TOKEN
   ```
   Acepta los valores por defecto con Enter (mantén la etiqueta `self-hosted`).
3. Instálalo como demonio de systemd (persiste tras reinicios):
   ```bash
   sudo ./svc.sh install
   sudo ./svc.sh start
   ```
4. En GitHub, el runner debe figurar **verde / Idle**.

## 3. Crear los GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret.** Crea:

| Secret | Obligatorio | Ejemplo / nota |
|---|---|---|
| `DB_USER` | ✅ | `usuario_admin` |
| `DB_PASSWORD` | ✅ | clave robusta |
| `DB_NAME` | ✅ | `produccion_db` |
| `SEED_ADMIN_CORREO` | ⭐ recomendado | correo del primer admin |
| `SEED_ADMIN_PASSWORD` | ⭐ recomendado | clave del primer admin |
| `API_URL_PUBLICA` | ⭐ recomendado | `http://IP-DEL-SERVIDOR:4102/api/v1` |
| `URL_CLIENTE` | ⭐ recomendado | `http://IP-DEL-SERVIDOR:3000` |

> Sin los `SEED_ADMIN_*`, el seed **omite** la creación del admin en producción
> (por diseño de seguridad) y no podrás autenticarte. Sin `API_URL_PUBLICA`/`URL_CLIENTE`,
> el frontend apuntaría a `localhost` y el navegador de los usuarios no alcanzaría la API.
> **No se commitean**: el runner los inyecta y `deploy.sh` los escribe en un `.env`
> con permisos `600` que está en `.gitignore`.

## 4. Disparar el pipeline

```bash
git push origin main
```

En **Actions** verás:
1. `fase-integracion-continua` (nube): install → format → lint → preparar BD →
   `npm test` → build. Si algo falla, **el despliegue no ocurre**.
2. `fase-despliegue-continuo` (tu servidor): checkout → `scripts/deploy.sh` →
   `docker system prune` → escribe `.env` → `docker compose down/build/up -d`.

## 5. Validar el despliegue

En el servidor:
```bash
docker compose ps                         # los 3 servicios Up (db healthy)
curl http://localhost:4102/health         # {"status":"ok",...}
```
Desde un navegador en la red: `http://IP-DEL-SERVIDOR:3000` (frontend) y la API en
`:4102/api/v1`.

## Probar `deploy.sh` localmente (sin GitHub)

```bash
# Simula el despliegue en este repo con credenciales de prueba
scripts/deploy.sh dev_user dev_password bebras_bolivia
```
(Usa los defaults para el resto; sobre-escribe `.env` y redepliega el stack.)

## Notas operativas

- `docker compose build --no-cache` (lo pide la guía) reconstruye desde cero en cada
  push: es lento (npm ci + prisma generate). Si quieres despliegues rápidos, quita
  `--no-cache` de `scripts/deploy.sh`.
- El volumen `postgres_data` **persiste** entre despliegues (`down` no lo borra): tus
  datos no se pierden en cada deploy. El seed es idempotente.
- El init script `scripts/db/01-crear-bd-test.sql` solo corre en un volumen nuevo.
