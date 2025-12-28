import { PrismaClient } from '@prisma/client'
import ProdutosClient from "@/components/ProdutosClient";

// 1. Configuração do Banco de Dados
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 2. Função que busca os produtos no banco
async function getProdutos() {
  // Busca no banco e ordena por nome
  const produtos = await prisma.produto.findMany({
    orderBy: {
      nome: 'asc'
    }
  });

  // Converte "Decimal" (do banco) para "Number" (do Javascript) para não dar erro na tela
  // Isso é necessário porque o Next.js as vezes reclama de passar números decimais diretos
  const produtosFormatados = produtos.map(produto => ({
    ...produto,
    preco: Number(produto.preco) 
  }));

  return produtosFormatados;
}

// 3. A Página que carrega tudo
export default async function Page() {
  const dados = await getProdutos();

  return (
    <main>
      <ProdutosClient produtos={dados} />
    </main>
  );
}