#!/bin/bash
# ===========================================================
# Script de despliegue (fase CD) ejecutado por el GitHub Self-Hosted Runner.
# Genera el .env desde los secretos inyectados y redespliega el stack con Docker Compose.
#
# Uso:
#   scripts/deploy.sh DB_USER DB_PASSWORD DB_NAME \
#       [SEED_ADMIN_CORREO] [SEED_ADMIN_PASSWORD] [API_URL_PUBLICA] [URL_CLIENTE]
# ===========================================================
set -euo pipefail

# --- Argumentos: los 3 primeros son obligatorios (base de datos) ---
DB_USER="${1:?Falta DB_USER}"
DB_PASSWORD="${2:?Falta DB_PASSWORD}"
DB_NAME="${3:?Falta DB_NAME}"
# Opcionales (recomendados en produccion): si no llegan, el compose usa sus defaults.
SEED_ADMIN_CORREO="${4:-}"
SEED_ADMIN_PASSWORD="${5:-}"
API_URL_PUBLICA="${6:-}"
URL_CLIENTE="${7:-}"

# --- Directorio del proyecto ---
# Por defecto: raiz del repo relativa a este script (scripts/..).
# Si copias el script fuera del repo (patron ~/deploy.sh de la guia), exporta
# PROYECTO_DIR con la ruta del checkout del runner.
if [ -n "${PROYECTO_DIR:-}" ]; then
  DIRECTORIO_PROYECTO="$PROYECTO_DIR"
else
  DIRECTORIO_PROYECTO="$(cd "$(dirname "$0")/.." && pwd)"
fi

if [ ! -d "$DIRECTORIO_PROYECTO" ]; then
  echo "Error critico: directorio del proyecto no encontrado: $DIRECTORIO_PROYECTO"
  exit 1
fi
cd "$DIRECTORIO_PROYECTO"
echo "==> Desplegando en: $DIRECTORIO_PROYECTO"

echo "==> Saneamiento de Docker (prune de recursos en desuso)..."
docker system prune -f

echo "==> Escribiendo .env de forma segura (solo lectura del propietario)..."
umask 077
{
  echo "DB_USER=${DB_USER}"
  echo "DB_PASSWORD=${DB_PASSWORD}"
  echo "DB_NAME=${DB_NAME}"
  if [ -n "$SEED_ADMIN_CORREO" ]; then echo "SEED_ADMIN_CORREO=${SEED_ADMIN_CORREO}"; fi
  if [ -n "$SEED_ADMIN_PASSWORD" ]; then echo "SEED_ADMIN_PASSWORD=${SEED_ADMIN_PASSWORD}"; fi
  if [ -n "$API_URL_PUBLICA" ]; then echo "API_URL_PUBLICA=${API_URL_PUBLICA}"; fi
  if [ -n "$URL_CLIENTE" ]; then echo "URL_CLIENTE=${URL_CLIENTE}"; fi
  # En produccion NO se siembran datos de muestra
  echo "SEED_DATOS_DEMO=false"
} > .env

echo "==> Reconstruyendo y levantando el stack multicontenedor..."
# Desactiva los attestation manifests (igual que npm run docker:build en local);
# evita ~150 MB extra por imagen sin beneficio en el servidor.
export BUILDX_NO_DEFAULT_ATTESTATIONS=1
docker compose down
docker compose build --no-cache
docker compose up -d

echo "==> Despliegue completado. Estado de los servicios:"
docker compose ps
