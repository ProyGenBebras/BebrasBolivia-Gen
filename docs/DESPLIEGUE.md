# Checklist de Despliegue (CI/CD)

Pasos **manuales** para poner en marcha el pipeline. El código (workflows, `deploy.sh`,
Dockerfiles) ya está listo en el repo; lo que sigue es configuración de GitHub y del servidor.

Arquitectura del pipeline:

```
git push main
   └─► GitHub Actions
        ├─ fase-integracion-continua  (runner en la nube: ubuntu-latest)
        │     instala → format → lint → audit → migra BD efímera → npm test → build
        │     (si falla, NO se despliega)
        └─ fase-despliegue-continuo   (self-hosted runner en tu Ubuntu Server)
              checkout → scripts/deploy.sh → genera .env → docker compose build/up
```

Referencias: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml),
[scripts/deploy.sh](../scripts/deploy.sh).

---

## 1. Servidor Ubuntu — instalar Docker

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verificar: `docker --version` y `docker compose version`.

## 2. Servidor Ubuntu — Docker sin sudo

`scripts/deploy.sh` invoca `docker` directamente, así que el usuario del runner debe estar
en el grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

> **Crítico:** cierra sesión y vuelve a entrar (o reinicia el servicio del runner, paso 3)
> para que el cambio de grupo surta efecto. Comprueba con `docker ps` sin `sudo`.

## 3. Servidor Ubuntu — Self-Hosted Runner

GitHub → **Settings → Actions → Runners → New self-hosted runner → Linux**. Sigue los
comandos de *Download* y *Configure*:

```bash
./config.sh --url https://github.com/TU_USUARIO/BebrasBolivia-Gen --token TU_TOKEN
```

- Acepta los valores por defecto con Enter; **mantén la etiqueta `self-hosted`** (es la que
  exige `runs-on: self-hosted` en el workflow).
- Instálalo como servicio para que sobreviva a reinicios:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

Confirma en GitHub que el runner aparece **verde / Idle**.

## 4. GitHub — Secrets

GitHub → **Settings → Secrets and variables → Actions → New repository secret**.
`deploy.yml` consume **7 secretos** (la fase CD los pasa a `deploy.sh`):

| Secret | Obligatorio | Ejemplo / nota |
|---|---|---|
| `DB_USER` | ✅ | `usuario_admin` |
| `DB_PASSWORD` | ✅ | clave robusta |
| `DB_NAME` | ✅ | `produccion_db` |
| `SEED_ADMIN_CORREO` | recomendado | correo del primer admin |
| `SEED_ADMIN_PASSWORD` | recomendado | contraseña del primer admin |
| `API_URL_PUBLICA` | recomendado | `http://IP-DEL-SERVIDOR:4102/api/v1` (se incrusta en el build del frontend) |
| `URL_CLIENTE` | recomendado | `http://IP-DEL-SERVIDOR:3000` (origen permitido por CORS) |

> Si los 4 recomendados faltan, el `.env` queda sin ellos y el compose usa sus defaults de
> desarrollo — **no apto para producción** (admin sembrado conocido, URLs a localhost).
> `SEED_DATOS_DEMO=false` lo fuerza `deploy.sh`, no es un secret.

## 5. Validación

```bash
git commit -m "ci: probar pipeline" --allow-empty
git push origin main
```

GitHub → pestaña **Actions**: primero corre CI en la nube, luego el runner local ejecuta
`deploy.sh`. Al terminar en verde, valida:

- Frontend: `http://IP-DEL-SERVIDOR:3000`
- Backend: `http://IP-DEL-SERVIDOR:4102/health` → `{"status":"ok",...}`

En el servidor: `docker compose ps` (3 contenedores *healthy*) y
`docker exec bebras_user_svc whoami` → `node` (corre como no-root).

---

## Notas

- El despliegue exporta `BUILDX_NO_DEFAULT_ATTESTATIONS=1` (igual que `npm run docker:build`
  en local) para no inflar las imágenes del servidor.
- `deploy.sh` corre `docker system prune -f` antes de cada build para no saturar el disco.
- El backend, al arrancar, crea el schema `bebras`, aplica migraciones y siembra
  (idempotente) — todo en el `CMD` del Dockerfile; no hay paso de migración aparte.
