// 1. IMPORTAÇÕES NECESSÁRIAS
import { prisma } from "@/lib/prisma"; 
import FluxoCaixaClient from "./FluxoCaixaClient";

export default async function Page() {
  const empresaId = 1; 

  // Busca os dados brutos no banco
  const dados = await prisma.fluxoCaixa.findMany({
    where: { empresaId },
    orderBy: { data: 'desc' }
  });

  // Serializa (Decimal -> Number, Date -> String)
  const dadosFormatados = dados.map((t) => ({
    id: t.id,
    descricao: t.descricao,
    tipo: t.tipo as 'receita' | 'despesa', // Força a tipagem se necessário
    categoria: t.categoria || '',
    status: t.status as 'confirmado' | 'pendente',
    // Conversões críticas:
    valor: Number(t.valor),
    data: t.data.toISOString().split('T')[0], // Formato YYYY-MM-DD para o input type="date"
  }));

  // 2.Passar 'dadosFormatados' em vez de 'dados'
  return <FluxoCaixaClient initialTransacoes={dadosFormatados} />;
}