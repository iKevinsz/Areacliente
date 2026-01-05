'use server';

import { prisma } from '@/lib/prisma'; 
import { revalidatePath } from 'next/cache';

// Busca transações
export async function getTransacoes(empresaId: number) {
  try {
    const data = await prisma.fluxoCaixa.findMany({
      where: { empresaId },
      orderBy: { data: 'desc' }
    });

    return data.map(t => ({
      id: t.id,
      descricao: t.descricao,
      tipo: t.tipo as 'receita' | 'despesa',
      categoria: t.categoria || '',
      valor: Number(t.valor),
      data: t.data.toISOString().split('T')[0],
      status: (t.status.toLowerCase()) as 'confirmado' | 'pendente'
    }));
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
}

// Salva (Novo) ou Atualiza (Edição)
export async function saveTransacao(data: any) {
  try {
    const empresaId = 1; // Ajuste conforme a sessão do usuário

    // Formata o objeto para o padrão do banco
    const payload = {
      empresaId,
      descricao: data.descricao,
      tipo: data.tipo,
      categoria: data.categoria,
      valor: data.valor,
      // Adiciona hora para evitar problemas de fuso horário voltando 1 dia
      data: new Date(data.data + "T12:00:00Z"), 
      status: data.status
    };

    if (data.id) {
      // --- LÓGICA DE EDIÇÃO (UPDATE) ---
      // Se tem ID, atualiza o registro existente
      await prisma.fluxoCaixa.update({
        where: { id: Number(data.id) },
        data: payload
      });
    } else {
      // --- LÓGICA DE NOVO CADASTRO (CREATE) ---
      // Se não tem ID, cria um novo
      await prisma.fluxoCaixa.create({
        data: payload
      });
    }

    revalidatePath('/system/financeiro/fluxo-caixa'); // Atualiza a tela 
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return { success: false, error: "Erro ao salvar no banco." };
  }
}

// Deleta
export async function deleteTransacao(id: number) {
  try {
    await prisma.fluxoCaixa.delete({
      where: { id: Number(id) }
    });
    revalidatePath('/system/financeiro/fluxo-caixa');
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false };
  }
}