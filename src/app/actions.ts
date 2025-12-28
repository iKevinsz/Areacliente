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

// src/app/actions.ts

export async function saveProduct(data: any) {
  try {
    const precoFinal = data.hasVariations && data.variations.length > 0 
      ? Math.min(...data.variations.map((v: any) => parseFloat(v.price))) 
      : parseFloat(data.price);

    let grupoIdConectado = null;
    if (data.group) {
      const grupo = await prisma.grupo.findFirst({ where: { nome: data.group } });
      if (grupo) grupoIdConectado = grupo.id;
    }

    // MAPEAMENTO DOS SWITCHES PARA O BANCO
    const payloadProduto = {
      nome: data.description,
      categoria: data.group,
      preco: precoFinal,
      imagem: data.image,
      ativo: data.active,                               // Salva Switch "Produto Ativo"
      estoque: data.isAvailableOnline ? 100 : 0,        // Salva Switch "Controle de Estoque"
      permiteComplemento: data.allowsComplements,      // Salva Switch "Permitir Complemento"
      visivelOnline: data.isVisibleOnline,              // Salva Switch "Visível Online"
      grupoId: grupoIdConectado,
    };

    if (data.id && data.id !== 0) {
      await prisma.$transaction([
        prisma.produto.update({ where: { id: data.id }, data: payloadProduto }),
        prisma.variacao.deleteMany({ where: { produtoId: data.id } }),
        ...(data.hasVariations ? [
          prisma.variacao.createMany({
            data: data.variations.map((v: any) => ({
              nome: v.name,
              preco: parseFloat(v.price) || 0,
              produtoId: data.id
            }))
          })
        ] : [])
      ]);
    } else {
      await prisma.produto.create({
        data: {
          ...payloadProduto,
          variacoes: {
            create: data.hasVariations ? data.variations.map((v: any) => ({
              nome: v.name,
              preco: parseFloat(v.price) || 0
            })) : []
          }
        }
      });
    }

    revalidatePath('/system/cardapio/produtos');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
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