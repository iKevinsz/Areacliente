'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- INTERFACES (DTOs) ---

export interface ContaReceberDTO {
  id: number | null;
  descricao: string;
  cliente: string;
  valor: number;
  vencimento: string; // YYYY-MM-DD
  status: 'pendente' | 'recebido' | 'vencido';
  categoria: string;
}

export interface ContaPagarDTO {
  id: number | null;
  descricao: string;
  fornecedor: string;
  valor: number;
  vencimento: string; // YYYY-MM-DD
  status: 'pendente' | 'pago' | 'vencido';
  categoria: string;
}


// 1. CONTAS A RECEBER


export async function getContasReceber(empresaId: number) {
  try {
    const contas = await prisma.contaReceber.findMany({
      where: { empresaId },
      orderBy: { vencimento: 'asc' }
    });

    return contas.map(c => ({
      id: c.id,
      descricao: c.descricao,
      cliente: c.cliente || '',
      valor: Number(c.valor), // Converte Decimal para Number
      vencimento: c.vencimento.toISOString().split('T')[0],
      status: (c.status.toLowerCase()) as 'pendente' | 'recebido' | 'vencido',
      categoria: c.categoria || ''
    }));
  } catch (error) {
    console.error("Erro ao buscar contas a receber:", error);
    return [];
  }
}

export async function saveContaReceber(data: ContaReceberDTO) {
  try {
    const empresaId = 1; 

    const payload = {
      empresaId,
      descricao: data.descricao,
      cliente: data.cliente,
      valor: data.valor,
      // Fixa hora para evitar problemas de fuso horário (UTC vs Local)
      vencimento: new Date(data.vencimento + "T12:00:00Z"), 
      status: data.status,
      categoria: data.categoria
    };

    if (data.id) {
      await prisma.contaReceber.update({
        where: { id: Number(data.id) },
        data: payload
      });
    } else {
      await prisma.contaReceber.create({
        data: payload
      });
    }

    revalidatePath('/system/financeiro/receber'); 
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar conta a receber:", error);
    return { success: false };
  }
}

export async function deleteContaReceber(id: number) {
  try {
    await prisma.contaReceber.delete({
      where: { id: Number(id) }
    });
    revalidatePath('/system/financeiro/receber');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}


// 2. CONTAS A PAGAR


export async function getContasPagar(empresaId: number) {
  try {
    const contas = await prisma.contaPagar.findMany({
      where: { empresaId },
      orderBy: { vencimento: 'asc' }
    });

    return contas.map(c => ({
      id: c.id,
      descricao: c.descricao,
      fornecedor: c.fornecedor || '',
      valor: Number(c.valor),
      vencimento: c.vencimento.toISOString().split('T')[0],
      status: (c.status.toLowerCase()) as 'pendente' | 'pago' | 'vencido',
      categoria: c.categoria || ''
    }));
  } catch (error) {
    console.error("Erro ao buscar contas a pagar:", error);
    return [];
  }
}

export async function saveContaPagar(data: ContaPagarDTO) {
  try {
    const empresaId = 1; 

    const payload = {
      empresaId,
      descricao: data.descricao,
      fornecedor: data.fornecedor,
      valor: data.valor,
      vencimento: new Date(data.vencimento + "T12:00:00Z"),
      status: data.status,
      categoria: data.categoria
    };

    if (data.id) {
      await prisma.contaPagar.update({
        where: { id: Number(data.id) },
        data: payload
      });
    } else {
      await prisma.contaPagar.create({
        data: payload
      });
    }

    revalidatePath('/system/financeiro/pagar'); 
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar conta a pagar:", error);
    return { success: false };
  }
}

export async function deleteContaPagar(id: number) {
  try {
    await prisma.contaPagar.delete({
      where: { id: Number(id) }
    });
    revalidatePath('/system/financeiro/pagar');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}