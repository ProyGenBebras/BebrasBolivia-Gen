import { PrismaClient } from '@prisma/client';

describe('Conectividad de base de datos', () => {
  it('deberia conectar y responder un SELECT 1', async () => {
    const prisma = new PrismaClient();

    try {
      const resultados = await prisma.$queryRaw<Array<{ valor: number }>>`SELECT 1 as valor`;
      expect(resultados[0]?.valor).toBe(1);
    } finally {
      await prisma.$disconnect();
    }
  });
});
