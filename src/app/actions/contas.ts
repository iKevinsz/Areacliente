'use server';

import { prisma } from '@/lib/prisma'; // Sua instância do Prisma
import { revalidatePath } from 'next/cache';

export async function getContas() {
  return await prisma.contaReceber.findMany({
    orderBy: { vencimento: 'asc' }
  });
}

export async function upsertConta(data: any) {
  const { id, ...rest } = data;
  
  if (id && id.length > 15) { // Se tem um ID real do banco
    await prisma.contaReceber.update({
      where: { id: Number(id) },
      data: { ...rest, vencimento: new Date(rest.vencimento) }
    });
  } else {
    await prisma.contaReceber.create({
      data: { ...rest, vencimento: new Date(rest.vencimento) }
    });
  }
  
  revalidatePath('/contas-receber');
}

export async function deleteConta(id: string) {
  await prisma.contaReceber.delete({ where: { id: Number(id) } });
  revalidatePath('/contas-receber');
}