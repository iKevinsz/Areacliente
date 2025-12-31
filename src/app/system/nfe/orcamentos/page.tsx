// app/orcamentos/page.tsx
import { prisma } from '@/lib/prisma';
import OrcamentosClient from './OrcamentosClient'; // Seu componente atualizado

export default async function OrcamentosPage() {
  const orcamentos = await prisma.orcamento.findMany({
    include: { itens: true },
    orderBy: { createdAt: 'desc' }
  });

  return <OrcamentosClient initialOrcamentos={orcamentos as any} />;
}