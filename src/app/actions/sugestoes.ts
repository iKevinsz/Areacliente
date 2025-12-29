'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Ação para Cadastrar Nova Sugestão
export async function criarSugestao(formData: FormData) {
  const descricao = formData.get('descricao') as string;
  const sistema = formData.get('sistema') as string;
  const classificacao = formData.get('classificacao') as string;

  try {
    // Insere no banco usando Prisma
    await prisma.sugestoes_melhorias.create({
      data: {
        data_registro: new Date(),
        descricao,
        sistema,
        classificacao,
        curtidas: 0,
        status: 'pendente'
      }
    });
    
    // Atualiza a tela para exibir o novo item
    revalidatePath('/system/sistema/sugestoes');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Erro ao cadastrar' };
  }
}

// Ação para Atualizar Curtidas (Toggle)
export async function toggleLikeAction(id: number, incrementar: boolean) {
  try {
    // Atualiza o contador no banco usando Prisma
    const sugestao = await prisma.sugestoes_melhorias.findUnique({ where: { id } });
    if (sugestao) {
      const curtidasAtuais = sugestao.curtidas ?? 0;
      await prisma.sugestoes_melhorias.update({
        where: { id },
        data: {
          curtidas: incrementar ? curtidasAtuais + 1 : Math.max(0, curtidasAtuais - 1)
        }
      });
    }
    
    revalidatePath('/system/sistema/sugestoes');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}