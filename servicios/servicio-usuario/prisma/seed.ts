import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// IDs fijos para que el seed sea idempotente: el upsert por id NO duplica
// datos aunque el seed se ejecute en cada arranque del contenedor.
const ADMIN_ID = '00000000-0000-0000-0000-000000000001';
const INSTITUCION_ID = '00000000-0000-0000-0000-000000000010';
const CATEGORIA_ID = '00000000-0000-0000-0000-000000000020';
const PREGUNTA_ID = '00000000-0000-0000-0000-000000000030';

// Credenciales por defecto SOLO para desarrollo (NODE_ENV != production sin vars).
const ADMIN_CORREO_DEV = 'admin@bebras.bo';
const ADMIN_PASSWORD_DEV = 'Admin1234';

const esProduccion = process.env.NODE_ENV === 'production';

/**
 * Configuración del seed vía entorno:
 * - SEED_ADMIN_CORREO / SEED_ADMIN_PASSWORD: credenciales del admin inicial.
 *   En producción son OBLIGATORIAS (sin ellas el admin no se siembra).
 * - SEED_DATOS_DEMO=true: siembra institución/categoría/pregunta de muestra.
 */
function resolverCredencialesAdmin(): { correo: string; password: string } | null {
  const correo = process.env.SEED_ADMIN_CORREO ?? (esProduccion ? null : ADMIN_CORREO_DEV);
  const password = process.env.SEED_ADMIN_PASSWORD ?? (esProduccion ? null : ADMIN_PASSWORD_DEV);

  if (!correo || !password) {
    return null;
  }
  return { correo, password };
}

async function sembrarAdmin(): Promise<boolean> {
  const credenciales = resolverCredencialesAdmin();

  if (!credenciales) {
    console.warn(
      'Seed: SEED_ADMIN_CORREO/SEED_ADMIN_PASSWORD no definidas en producción; se omite el admin.',
    );
    return false;
  }

  const contrasena_hash = await bcrypt.hash(credenciales.password, 10);

  await prisma.usuarios.upsert({
    where: { id: ADMIN_ID },
    update: {},
    create: {
      id: ADMIN_ID,
      correo: credenciales.correo,
      nombre_usuario: 'admin',
      contrasena_hash,
      rol: 'administrador',
      nombres: 'Administrador',
      apellidos: 'General',
      esta_activo: true,
      esta_verificado: true,
    },
  });

  // Nunca registrar contraseñas reales en logs: solo se muestra el default de desarrollo.
  const sufijo =
    credenciales.password === ADMIN_PASSWORD_DEV ? ` / ${ADMIN_PASSWORD_DEV} (default dev)` : '';
  console.log(`Seed: admin ${credenciales.correo}${sufijo} (x-usuario-id: ${ADMIN_ID})`);
  return true;
}

async function sembrarDatosDemo(adminSembrado: boolean): Promise<void> {
  if (process.env.SEED_DATOS_DEMO !== 'true') {
    return;
  }

  await prisma.instituciones.upsert({
    where: { id: INSTITUCION_ID },
    update: {},
    create: {
      id: INSTITUCION_ID,
      nombre: 'Colegio Bebras Bolivia',
      codigo: 'BEB-001',
    },
  });

  await prisma.categorias.upsert({
    where: { id: CATEGORIA_ID },
    update: {},
    create: {
      id: CATEGORIA_ID,
      nombre: 'Pensamiento computacional',
      descripcion: 'Categoría base de ejemplo',
    },
  });

  await prisma.preguntas.upsert({
    where: { id: PREGUNTA_ID },
    update: {},
    create: {
      id: PREGUNTA_ID,
      titulo: '¿Cuál es el siguiente número de la secuencia?',
      contenido: 'Secuencia: 2, 4, 8, 16, ...',
      categoria_id: CATEGORIA_ID,
      dificultad: 'facil',
      puntaje: 1,
      // FK opcional: solo se referencia al admin si realmente fue sembrado
      creado_por: adminSembrado ? ADMIN_ID : null,
    },
  });

  console.log('Seed: datos demo (1 institución, 1 categoría, 1 pregunta)');
}

async function main(): Promise<void> {
  const adminSembrado = await sembrarAdmin();
  await sembrarDatosDemo(adminSembrado);
  console.log('Seed completado.');
}

main()
  .catch((error) => {
    console.error('Error en seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
