'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function saveProduct(data: any) {
  try {
    // Prepara o objeto para o Prisma
    // Obs: Como o banco atual não tem tabela de variações, 
    // vamos salvar o preço principal ou o menor preço da variação.
    const precoFinal = data.hasVariations && data.variations.length > 0 
      ? Math.min(...data.variations.map((v: any) => v.price)) 
      : data.price;

    const payload = {
      nome: data.description, // Mapeia 'description' da tela para 'nome' do banco
      categoria: data.group,
      preco: precoFinal,
      imagem: data.image,
      ativo: data.active,
      estoque: data.isAvailableOnline ? 100 : 0, // Lógica simples de estoque
      descricao: "Produto cadastrado via sistema", // Campo obrigatório no banco? Se não, pode remover
      // Se tiver grupoId fixo ou lógica para buscar, insira aqui:
      grupoId: 1 
    }

    if (data.id && data.id !== 0) {
      // --- ATUALIZAR (UPDATE) ---
      await prisma.produto.update({
        where: { id: data.id },
        data: payload
      })
    } else {
      // --- CRIAR (CREATE) ---
      await prisma.produto.create({
        data: payload
      })
    }

    // Atualiza a listagem na hora
    revalidatePath('/system/cardapio/produtos')
    return { success: true }
    
  } catch (error) {
    console.error("Erro ao salvar produto:", error)
    return { success: false, error }
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