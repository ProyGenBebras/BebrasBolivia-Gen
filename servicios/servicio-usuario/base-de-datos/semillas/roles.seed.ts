import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    const roles = [
        {
            nombre: 'adm',
            descripcion: 'Administrador del sistema con acceso total a la plataforma',
            estaActivo: true,
        },
        {
            nombre: 'examinador',
            descripcion: 'Examina y evalua los portafolios de los participantes',
            estaActivo: true,
        },
        {
            nombre: 'participante',
            descripcion: 'Usuario registrado que participa en las competencias',
            estaActivo: true,
        },
    ];

    for (const rol of roles) {
        await prisma.rol.upsert({
            where: { nombre: rol.nombre },
            update: { descripcion: rol.descripcion, estaActivo: rol.estaActivo },
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