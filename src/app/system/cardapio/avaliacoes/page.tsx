import { PrismaClient } from '@prisma/client'
import AvaliacoesClient from "@/components/AvaliacoesClient";

// 1. Configura a conexão com o banco
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 2. Função que vai no banco buscar os dados
async function getAvaliacoes() {
  const dados = await prisma.avaliacao.findMany({
    orderBy: {
      criadoEm: 'desc' // Mostra as mais novas primeiro
    }
  });
  return dados;
}

// 3. O componente da página
export default async function Page() {
  // Chama a busca de dados
  const dadosDoBanco = await getAvaliacoes();

  // Entrega os dados para o componente visual desenhar
  return (
    <main>
      <AvaliacoesClient dadosDoBanco={dadosDoBanco} />
    </main>
  );
}