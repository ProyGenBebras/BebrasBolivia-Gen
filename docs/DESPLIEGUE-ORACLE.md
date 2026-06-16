# Despliegue en Oracle Cloud (Always Free, ARM) — Guía paso a paso

Servidor 24/7 gratuito para el self-hosted runner + el stack Docker. La VM es **ARM
(Ampere A1)**; el repo ya está preparado para ARM (imagen base multi-arch + `binaryTargets`
de Prisma con `linux-musl-arm64-openssl-3.0.x`).

> Complementa a [DESPLIEGUE.md](DESPLIEGUE.md) (visión general del pipeline). Aquí van los
> pasos concretos para Oracle.

---

## 0. Crear cuenta Oracle Cloud

1. https://www.oracle.com/cloud/free/ → **Start for free**.
2. Pide **tarjeta** solo para verificar identidad. La capa **Always Free no cobra**
   (no subas de los límites gratis y no quedará deuda).
3. **Home Region**: elígela cerca tuyo (Brasil/Chile para Bolivia, ej. `sa-saopaulo-1`).
   ⚠️ **No se puede cambiar después** y determina dónde hay capacidad ARM.

---

## 1. Crear la VM Ubuntu ARM (Always Free)

Consola Oracle → **Menú ☰ → Compute → Instances → Create instance**:

- **Image**: Ubuntu 24.04 (o 22.04).
- **Shape**: *Change shape* → **Ampere** → **VM.Standard.A1.Flex** →
  asigna **2 OCPU / 12 GB RAM** (dentro del free de 4 OCPU/24 GB; sobra para el build).
- **Networking**: deja que cree una VCN nueva con subred pública. Marca **Assign a public
  IPv4 address**.
- **SSH keys**: *Generate a key pair for me* → **descarga la llave privada** (la usarás para
  entrar). Guárdala bien.
- **Create**.

> ⚠️ **"Out of host capacity"**: las VM ARM gratis se agotan seguido. Si falla, reintenta
> en otro *Availability Domain* o más tarde. Es el obstáculo nº1 de Oracle Free.

Cuando esté *Running*, anota la **Public IP address**.

---

## 2. Abrir puertos — Oracle tiene DOS firewalls (clave)

Debes abrir **3000** (frontend) y **4102** (backend) en **ambos**:

### 2a. Security List de Oracle (firewall de la nube)
Instancia → su **Subnet** → **Security List por defecto** → **Add Ingress Rules**. Por cada
puerto:
- Source CIDR: `0.0.0.0/0`
- IP Protocol: `TCP`
- Destination Port Range: `3000` (repite para `4102`)

### 2b. iptables de Ubuntu (firewall del SO)
Las imágenes Ubuntu de Oracle traen iptables que **bloquea todo menos SSH**. Tras entrar
por SSH (paso 3), ejecuta:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 4102 -j ACCEPT
sudo netfilter-persistent save     # persiste tras reinicios
```

---

## 3. Conectarte por SSH

Desde tu PC (PowerShell o Git Bash), con la llave descargada:

```bash
chmod 600 ./ssh-key.key                 # solo en Git Bash/Linux
ssh -i ./ssh-key.key ubuntu@TU_IP_PUBLICA
```

(El usuario por defecto de Ubuntu en Oracle es `ubuntu`.)

---

## 4. Instalar Docker en la VM (ARM)

El repo de Docker detecta ARM automáticamente; los comandos son los mismos:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker sin sudo (el runner lo necesita)
sudo usermod -aG docker $USER
```

Cierra y reabre la sesión SSH para que el grupo `docker` aplique. Verifica: `docker ps`.

---

## 5. Registrar el GitHub Self-Hosted Runner (¡ARM64!)

GitHub → repo `WilHacker/BebrasBolivia-Gen` → **Settings → Actions → Runners →
New self-hosted runner**:

- **Runner image: Linux**
- **Architecture: ARM64** ← ⚠️ NO dejes x64; esta VM es ARM.

Copia los comandos que GitHub te muestra (traen tu token único). Quedan así:

```bash
mkdir actions-runner && cd actions-runner
# (usa la URL del tarball ARM64 que te da GitHub)
curl -o actions-runner-linux-arm64.tar.gz -L https://github.com/actions/runner/releases/download/vX.X.X/actions-runner-linux-arm64-X.X.X.tar.gz
tar xzf ./actions-runner-linux-arm64.tar.gz
./config.sh --url https://github.com/WilHacker/BebrasBolivia-Gen --token TU_TOKEN
```

En el asistente: Enter en los defaults; **mantén la etiqueta `self-hosted`** (la que exige
`runs-on: self-hosted` en el workflow).

Instálalo como servicio (sobrevive a reinicios):

```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

Confirma en GitHub que el runner figura **verde / Idle**.

---

## 6. Cargar los Secrets en GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**. Los **7**
que consume [deploy.yml](../.github/workflows/deploy.yml):

| Secret | Valor |
|---|---|
| `DB_USER` | usuario de la BD (ej. `usuario_admin`) |
| `DB_PASSWORD` | contraseña robusta |
| `DB_NAME` | nombre de la BD (ej. `produccion_db`) |
| `SEED_ADMIN_CORREO` | correo del primer admin |
| `SEED_ADMIN_PASSWORD` | contraseña del primer admin |
| `API_URL_PUBLICA` | **`http://TU_IP_PUBLICA:4102/api/v1`** |
| `URL_CLIENTE` | **`http://TU_IP_PUBLICA:3000`** |

> ⚠️ **Crítico**: `API_URL_PUBLICA` y `URL_CLIENTE` deben usar la **IP pública del servidor**,
> NO `localhost`. `API_URL_PUBLICA` se incrusta en el build del frontend (el navegador del
> usuario la usa para llamar al backend); si pones localhost, el frontend público no
> encontrará la API.

---

## 7. Disparar el despliegue

Con el runner verde y los secrets cargados:

- Si tienes un job **colgado esperando runner**, lo tomará automáticamente (no hace falta
  re-pushear).
- O fuerza uno nuevo: `git commit --allow-empty -m "ci: probar despliegue" && git push origin main`.

GitHub → **Actions**: primero CI en la nube, luego tu runner ejecuta `scripts/deploy.sh`
(genera `.env`, build ARM, `docker compose up -d`).

---

## 8. Validar

```bash
# En la VM:
docker compose ps                      # 3 contenedores, backend y db 'healthy'
curl -s http://localhost:4102/health   # {"status":"ok",...}
docker exec bebras_user_svc whoami     # node (no-root)
```

Desde tu navegador (cualquier PC):
- Frontend: `http://TU_IP_PUBLICA:3000`
- Backend: `http://TU_IP_PUBLICA:4102/health`

Login inicial: el `SEED_ADMIN_CORREO` / `SEED_ADMIN_PASSWORD` que cargaste como secrets
(en producción `SEED_DATOS_DEMO=false`, así que no hay datos de muestra).

---

## Problemas frecuentes

| Síntoma | Causa / arreglo |
|---|---|
| Job sigue *"Waiting for a runner"* | Runner no está verde/Idle. Revisa `sudo ./svc.sh status`. |
| `exec format error` en el build | Runner registrado como x64 en VM ARM. Re-registra con **ARM64**. |
| Web no carga desde el navegador | Falta abrir puerto en **Security List** Y/O en **iptables** (paso 2). |
| Frontend carga pero no llama a la API | `API_URL_PUBLICA` apunta a localhost en vez de la IP pública. |
| Build OOM | Asigna más RAM al shape A1.Flex (tienes hasta 24 GB gratis). |
| `migrate deploy` falla | El backend crea el schema `bebras` en el CMD; revisa `DATABASE_URL`/credenciales de los secrets. |
