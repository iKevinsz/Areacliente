import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// --- FUNÇÃO PARA BUSCAR DADOS (GET) ---
export async function GET() {
  try {
    // Busca a primeira empresa cadastrada
    const empresa = await prisma.empresa.findFirst();
    
    if (!empresa) {
      return NextResponse.json({ message: "Nenhuma empresa encontrada" }, { status: 404 });
    }

    return NextResponse.json(empresa);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return NextResponse.json({ message: "Erro ao buscar dados" }, { status: 500 });
  }
}

// --- FUNÇÃO PARA SALVAR DADOS (POST) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const linkLojaIdentificador = body.linkLoja || "loja-padrao";

    const empresa = await prisma.empresa.upsert({
      where: { link_loja: linkLojaIdentificador },
      update: {
        cnpj_cpf: body.cnpj,
        razao_social: body.razaoSocial,
        nome_fantasia: body.nomeFantasia,
        inscricao_estadual: body.ie,
        inscricao_municipal: body.im,
        segmento: body.segmento,
        cep: body.cep,
        endereco: body.endereco,
        numero: body.numero,
        bairro: body.bairro,
        complemento: body.complemento,
        uf: body.uf,
        cidade: body.cidade,
        telefone: body.telefone,
        celular: body.celular,
        email: body.email,
        site: body.site,
        fuso_horario: body.fusoHorario,
        tempo_retirada: parseInt(body.tempoEstimado) || 0,
        tempo_entrega: parseInt(body.tempoEntrega) || 0,
        whatsapp: body.whatsapp,
        instagram: body.instagram,
        facebook: body.facebook,
        logo_path: body.logo,
      },
      create: {
        cnpj_cpf: body.cnpj,
        razao_social: body.razaoSocial,
        nome_fantasia: body.nomeFantasia,
        link_loja: linkLojaIdentificador,
        uf: body.uf,
        cidade: body.cidade,
        fuso_horario: body.fusoHorario,
        segmento: body.segmento,
        logo_path: body.logo,
      },
    });

    return NextResponse.json({ message: "Dados salvos com sucesso", empresa }, { status: 200 });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return NextResponse.json({ message: "Erro ao salvar" }, { status: 500 });
  }
}