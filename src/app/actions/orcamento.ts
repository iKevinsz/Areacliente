'use server';

import { prisma } from '@/lib/prisma'; 
import { revalidatePath } from 'next/cache';

// Tipagem de entrada (sem ID, pois o banco cria)
interface CreateOrcamentoData {
  cliente: string;
  documento?: string;
  validade: string; 
  observacao?: string;
  total: number;
  itens: {
    produto: string;
    qtd: number;
    valorUnit: number;
    total: number;
  }[];
}

export async function createOrcamento(data: CreateOrcamentoData) {
  try {
    await prisma.orcamento.create({
      data: {
        cliente: data.cliente,
        documento: data.documento,
        validade: new Date(data.validade),
        total: data.total,
        observacao: data.observacao,
        status: 'pendente',
        itens: {
          create: data.itens.map(item => ({
            produto: item.produto,
            qtd: item.qtd,
            valorUnit: item.valorUnit,
            total: item.total
          }))
        }
      }
    });

    revalidatePath('/orcamentos'); 
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);
    return { success: false, error: "Erro ao salvar no banco." };
  }
}

export async function updateOrcamentoStatus(id: number, status: string) {
  try {
    await prisma.orcamento.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/orcamentos');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar status." };
  }
}