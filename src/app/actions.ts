'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- AÇÕES DE GRUPOS ---

export async function saveGroup(data: any) {
  try {
    const empresaId = 1;

    // Prepara variações e complementos
    const variacoesCreate = data.variations.map((v: any) => ({
      nome: v.name
    }));

    const complementosCreate = data.complements.map((c: any) => ({
      nome: c.name,
      preco: parseFloat(c.price) || 0,
      maxQtd: parseInt(c.maxQuantity) || 1,
      obrigatorio: c.required
    }));

    if (data.id && data.id !== 0) {
      // UPDATE: Apaga os antigos e cria os novos (Transaction)
      await prisma.$transaction([
        prisma.grupoVariacao.deleteMany({ where: { grupoId: data.id } }),
        prisma.grupoComplemento.deleteMany({ where: { grupoId: data.id } }),
        prisma.grupo.update({
          where: { id: data.id },
          data: {
            nome: data.description,
            ordem: parseInt(data.sequence),
            ativo: data.active,
            variacoes: { create: variacoesCreate },
            complementos: { create: complementosCreate }
          }
        })
      ]);
    } else {
      // CREATE
      await prisma.grupo.create({
        data: {
          nome: data.description,
          ordem: parseInt(data.sequence),
          ativo: data.active,
          empresaId: empresaId,
          variacoes: { create: variacoesCreate },
          complementos: { create: complementosCreate }
        }
      });
    }

    revalidatePath('/system/cardapio/grupos');
    // Também atualiza a tela de produtos, pois os grupos mudaram
    revalidatePath('/system/cardapio/produtos'); 
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar grupo:", error);
    return { success: false, error };
  }
}

export async function deleteGroup(id: number) {
  try {
    const produtos = await prisma.produto.findFirst({ where: { grupoId: id } })
    if (produtos) {
      return { success: false, error: "Não é possível excluir um grupo que tem produtos." }
    }
    await prisma.grupo.delete({ where: { id } })
    revalidatePath('/system/cardapio/grupos')
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// --- AÇÕES DE PRODUTOS ---


export async function saveProduct(data: any) {
  try {
    const precoFinal = data.hasVariations && data.variations.length > 0 
      ? Math.min(...data.variations.map((v: any) => parseFloat(v.price || 0))) 
      : parseFloat(data.price || 0);

    let grupoIdConectado = null;
    if (data.group) {
      const grupo = await prisma.grupo.findFirst({ where: { nome: data.group } });
      if (grupo) grupoIdConectado = grupo.id;
    }

    const upsertData = {
      nome: data.description,
      preco: precoFinal,
      categoria: data.group,
      imagem: data.image,
      ativo: data.active,
      permiteComplemento: data.allowsComplements,
      visivelOnline: data.isVisibleOnline,
      grupoId: grupoIdConectado,
    };

    const produto = await prisma.produto.upsert({
      where: { id: data.id || 0 },
      update: {
        ...upsertData,
        // O SEGREDO ESTÁ AQUI:
        variacoes: {
          deleteMany: {}, // 1. Deleta TODAS as variações existentes deste produto
          create: data.hasVariations ? data.variations.map((v: any) => ({
            nome: v.name,
            preco: parseFloat(v.price || 0)
          })) : [] // 2. Cria apenas as que restaram no seu formulário
        }
      },
      create: {
        ...upsertData,
        variacoes: {
          create: data.hasVariations ? data.variations.map((v: any) => ({
            nome: v.name,
            preco: parseFloat(v.price || 0)
          })) : []
        }
      }
    });

    return { success: true, product: produto };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.produto.delete({ where: { id } })
    revalidatePath('/system/cardapio/produtos')
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

export async function responderAvaliacao(id: number, resposta: string) {
  try {
    await prisma.avaliacao.update({ where: { id }, data: { resposta } })
    revalidatePath('/system/cardapio/avaliacoes')
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
// --- AÇÃO DE SALVAR (CRIAR) ---
export async function saveLancamento(formData: FormData) {
  const empresaId = 1; // Ajuste conforme sua auth

  // 1. Tratar o Valor (Remover R$, pontos e trocar vírgula por ponto)
  const valorRaw = formData.get("valor") as string;
  const valorLimpo = parseFloat(
    valorRaw
      .replace("R$", "")       // Remove simbolo
      .replace(/\./g, "")      // Remove separador de milhar
      .replace(",", ".")       // Troca virgula decimal por ponto
      .trim()
  );

  // 2. Tratar a Data (Converter string para objeto Date)
  const dataRaw = formData.get("data") as string;
  
  // 3. Montar o objeto de dados
  const dados = {
    descricao: formData.get("descricao") as string,
    tipo: formData.get("tipo") as string, // 'entrada' ou 'saida'
    valor: valorLimpo,
    data: new Date(dataRaw),
    categoria: formData.get("categoria") as string,
    status: formData.get("status") as string,
    empresaId: empresaId,
    // criadoEm é preenchido automaticamente pelo @default(now()) no schema
  };

  try {
    // ATENÇÃO AQUI: Use prisma.fluxoCaixa (C maiúsculo)
    await prisma.fluxoCaixa.create({
      data: dados
    });

    revalidatePath("/system/financeiro/fluxo"); // Atualiza a tela
    return { success: true };

  } catch (error) {
    console.error("Erro ao salvar:", error);
    return { success: false, error: "Erro ao salvar no banco." };
  }
}

// --- AÇÃO DE EXCLUIR ---
export async function deleteLancamento(id: number) {
  try {
    // ATENÇÃO AQUI: Use prisma.fluxoCaixa (C maiúsculo)
    await prisma.fluxoCaixa.delete({
      where: { 
        id: Number(id) 
      }
    });

    revalidatePath("/system/financeiro/fluxo");
    return { success: true };

  } catch (error) {
    console.error("Erro ao excluir:", error);
    return { success: false, error: "Erro ao excluir lançamento." };
  }
}

