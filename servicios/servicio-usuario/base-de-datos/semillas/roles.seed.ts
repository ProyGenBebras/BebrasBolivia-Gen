import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    const roles = [
        {
            nombre: 'adm',
            descripcion: 'Administrador del sistema con acceso total a la plataforma',
            activo: true,
        },
        {
            nombre: 'examinador',
            descripcion: 'Examina y evalua los portafolios de los participantes',
            activo: true,
        },
        {
            nombre: 'participante',
            descripcion: 'Usuario registrado que participa en las competencias',
            activo: true,
        },
    ];

    for (const rol of roles) {
        await prisma.rol.upsert({
            where: { nombre: rol.nombre },
            update: { descripcion: rol.descripcion, activo: rol.activo },
            create: rol,
        });
    }
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });