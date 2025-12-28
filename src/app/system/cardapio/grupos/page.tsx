import { PrismaClient } from '@prisma/client'
import GruposClient from "@/app/system/cardapio/grupos/GruposClient";

const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function getGrupos() {
  const grupos = await prisma.grupo.findMany({
    orderBy: { ordem: 'asc' },
    // AQUI ESTÁ O SEGREDO: Include traz as tabelas relacionadas
    include: {
      variacoes: true,
      complementos: true
    }
  });
  return grupos;
}

export default async function Page() {
  const dados = await getGrupos();
  // Precisamos converter os Decimals (preço) para number antes de passar para o Client
  const dadosFormatados = JSON.parse(JSON.stringify(dados));

  return (
    <main>
      <GruposClient grupos={dadosFormatados} />
    </main>
  );
}