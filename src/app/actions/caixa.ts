'use server';

import { prisma } from '@/lib/prisma';

// Busca a lista de caixas para a tabela principal
export async function getHistoricoCaixas(empresaId: number) {
  try {
    const caixas = await prisma.caixa.findMany({
      where: { 
        empresaId: empresaId,
        // status: 'FECHADO' // Descomente se quiser ver apenas fechados
      },
      orderBy: { dataAbertura: 'desc' },
      take: 50 // Limita para não pesar a página
    });

    return caixas.map(c => ({
      id: c.id,
      operador: c.operador,
      dataAbertura: c.dataAbertura.toISOString(),
      dataFechamento: c.dataFechamento ? c.dataFechamento.toISOString() : '',
      saldoInicial: Number(c.saldoInicial),
      total: Number(c.saldoFinal || 0),
      quebra: Number(c.quebraDeCaixa || 0),
      qtdVendas: 0 // Se quiser contar pedidos: await prisma.pedido.count({ where: { caixaId: c.id } })
    }));
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
}

// Busca os detalhes (movimentações) de um caixa específico
export async function getMovimentacoesCaixa(caixaId: number) {
  try {
    const movimentos = await prisma.caixaMovimento.findMany({
      where: { caixaId },
      orderBy: { dataHora: 'asc' }
    });

    return movimentos.map(m => ({
      id: m.id,
      hora: m.dataHora ? m.dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
      descricao: m.descricao || 'Sem descrição',
      tipo: m.tipo as 'VENDA' | 'SANGRIA' | 'SUPRIMENTO',
      formaPagamento: m.formaPagamento || 'DINHEIRO',
      valor: Number(m.valor)
    }));
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return [];
  }
}