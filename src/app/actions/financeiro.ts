"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// SALVAR (CRIA OU EDITA)
export async function salvarConta(data: any) {
  try {
    const empresaId = 1; // Ajuste conforme sua sessão/auth

    const payload = {
      descricao: data.descricao,
      fornecedor: data.fornecedor,
      valor: Number(data.valor),
      vencimento: new Date(data.vencimento),
      status: data.status,
      categoria: data.categoria,
      empresaId: empresaId
    };

    if (data.id) {
      // Edição
      await prisma.contaPagar.update({
        where: { id: Number(data.id) },
        data: payload
      });
    } else {
      // Criação
      await prisma.contaPagar.create({
        data: payload
      });
    }

    revalidatePath("/system/financeiro/contas-pagar");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar conta:", error);
    return { success: false, error: "Erro ao salvar." };
  }
}

// EXCLUIR
export async function excluirConta(id: number) {
  try {
    await prisma.contaPagar.delete({
      where: { id: Number(id) }
    });
    revalidatePath("/system/financeiro/contas-pagar");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir." };
  }
}