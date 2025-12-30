// src/app/system/cardapio/produtos/page.tsx

import { PrismaClient } from '@prisma/client'
import ProdutosClient from "./ProdutosClient";

const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function getData() {
  // Busca produtos E suas variações
  const produtos = await prisma.produto.findMany({
    orderBy: { nome: 'asc' },
    include: { variacoes: true } 
  });

  // Busca grupos E suas variações padrão
  const grupos = await prisma.grupo.findMany({
    where: { ativo: true },
    orderBy: { ordem: 'asc' },
    include: { variacoes: true } // <--- ISSO É ESSENCIAL
  });

  return { 
    produtos: JSON.parse(JSON.stringify(produtos)), 
    grupos: JSON.parse(JSON.stringify(grupos)) 
  };
}

export default async function Page() {
  const { produtos, grupos } = await getData();

  return (
    <main>
      <ProdutosClient produtos={produtos} gruposDisponiveis={grupos} />
    </main>
  );
}