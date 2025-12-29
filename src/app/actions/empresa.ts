"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateEmpresaSettings(id: number, data: any) {
  try {
    // 1. MAPEAMENTO EXPLÍCITO
    // Isso garante que apenas campos que existem no seu model Empresa sejam enviados.
    // Também trata os campos opcionais que você pediu para não serem obrigatórios.
    const updateData = {
      ie: data.ie || null,
      im: data.im || null,
      segmento: data.segmento || null,
      razaoSocial: String(data.razaoSocial || ""),
      nomeFantasia: String(data.nomeFantasia || ""),
      cep: String(data.cep || ""),
      endereco: String(data.endereco || ""),
      numero: String(data.numero || ""),
      bairro: String(data.bairro || ""),
      complemento: data.complemento || null,
      uf: data.uf || "",
      cidade: data.cidade || "",
      telefone: data.telefone || null,
      telefoneComercial: data.telefoneComercial || null,
      celular: data.celular || null,
      email: data.email || null,
      site: data.site || null,
      logo: data.logo || null,
      fusoHorario: data.fusoHorario || "Sao_Paulo",
      categorias: data.categorias || null,
      tempoEstimado: data.tempoEstimado ? String(data.tempoEstimado) : "0",
      tempoEntrega: data.tempoEntrega ? String(data.tempoEntrega) : "0",
      linkLoja: data.linkLoja || null,
      whatsapp: data.whatsapp || null,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      youtube: data.youtube || null,
      twitter: data.twitter || null,
    };

    // 2. EXECUÇÃO NO BANCO
    await prisma.empresa.update({
      where: { id: Number(id) },
      data: updateData,
    });

    // 3. ATUALIZAÇÃO DA INTERFACE
    revalidatePath("/system/perfil");
    return { success: true };

  } catch (error: any) {
    console.error("ERRO DETALHADO NO PRISMA:", error);
    return { 
      success: false, 
      error: "Não foi possível salvar no banco. Verifique os dados e tente novamente." 
    };
  }
}