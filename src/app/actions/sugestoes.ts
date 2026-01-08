"use server";

import { prisma } from "@/lib/prisma"; 
import { revalidatePath } from "next/cache";

export async function criarSugestao(formData: FormData) {
  try {
    const descricao = formData.get("descricao") as string;
    const observacoes = formData.get("observacoes") as string;
    const sistema = formData.get("sistema") as string;
    const classificacao = formData.get("classificacao") as string;

    if (!descricao || !observacoes || !sistema || !classificacao) {
      return { success: false, message: "Campos obrigatórios faltando." };
    }

    await prisma.sugestao.create({
      data: {
        descricao,
        observacoes,
        sistema,
        classificacao,
        data: new Date().toLocaleDateString('pt-BR'), 
        curtidas: 0,
        status: "pendente",
      },
    });

    revalidatePath("/sistema/sugestoes"); // Atualiza a tela sem refresh
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar sugestão:", error);
    return { success: false, message: "Erro ao salvar no banco." };
  }
}

export async function toggleLikeAction(id: number, incrementar: boolean) {
  try {
    await prisma.sugestao.update({
      where: { id },
      data: {
        curtidas: {
          [incrementar ? "increment" : "decrement"]: 1,
        },
      },
    });
    revalidatePath("/sistema/sugestoes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao dar like:", error);
    return { success: false };
  }
}