"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarParametros(empresaId: number, data: any) {
  try {
    // 1. Atualizar Configurações Gerais (Tabela Empresa)
    await prisma.empresa.update({
      where: { id: Number(empresaId) },
      data: {
        lojaFechada: data.geral.lojaFechada,
        ocultarCardapio: data.geral.ocultarCardapio,
        enviarWhatsapp: data.geral.enviarWhatsapp,
        cpfObrigatorio: data.geral.cpfObrigatorio,
        cepObrigatorio: data.geral.cepObrigatorio,
        calculoPreco: data.geral.calculoPreco,
        valorMinimo: Number(data.geral.valorMinimo || 0), // Adicionado conversão numérica
        
        configPagamento: {
          opcoes: data.pagamento.opcoes,
          gateways: data.pagamento.gateways,
          chavePix: data.pagamento.chavePix,
          bandeirasVale: data.pagamento.bandeirasVale
        },
        configEntrega: {
          metodos: data.entrega.metodos,
          tipoTaxa: data.entrega.tipoTaxa,
          freteGratis: data.entrega.freteGratis,
          valorTaxaFixa: data.entrega.valorTaxaFixa,
          percentualTaxa: data.entrega.percentualTaxa
        }
      },
    });

    // 2. Atualizar Horários 
    await prisma.horarioFuncionamento.deleteMany({ where: { empresaId } });
    if (data.horarios && data.horarios.length > 0) {
      await prisma.horarioFuncionamento.createMany({
        data: data.horarios.map((h: any) => ({
          empresaId,
          dia: h.dia,
          diaIndex: h.id === 0 ? 0 : h.id,
          ativo: h.ativo,
          inicio: h.inicio,
          fim: h.fim
        }))
      });
    }

    // 3. Atualizar Pausas 
    await prisma.pausa.deleteMany({ where: { empresaId } });
    if (data.pausas && data.pausas.length > 0) {
      await prisma.pausa.createMany({
        data: data.pausas.map((p: any) => ({
          empresaId,
          nome: p.nome,
          inicio: new Date(p.inicio),
          fim: new Date(p.fim)
        }))
      });
    }

    // 4. Atualizar Cupons 
    await prisma.cupom.deleteMany({ where: { empresaId } });
    if (data.cupons && data.cupons.length > 0) {
      await prisma.cupom.createMany({
        data: data.cupons.map((c: any) => ({
          empresaId,
          codigo: c.codigo,
          tipoDesconto: c.tipoDesconto,
          valor: Number(c.valor),
          minimoCompra: Number(c.minimoCompra || 0),
          limiteUso: Number(c.limiteUso || 0),
          validade: c.validade ? new Date(c.validade) : null,
          ativo: c.ativo
        }))
      });
    }

    // 5. Atualizar Regras de Frete 
    await prisma.regraFrete.deleteMany({ where: { empresaId } });
    const regrasParaCriar = [];

    if (data.bairros && data.bairros.length > 0) {
      regrasParaCriar.push(...data.bairros.map((b: any) => ({
        empresaId,
        tipo: 'bairro',
        nomeBairro: b.nome,
        valor: Number(b.valor)
      })));
    }

    if (data.regrasKm && data.regrasKm.length > 0) {
      regrasParaCriar.push(...data.regrasKm.map((k: any) => ({
        empresaId,
        tipo: 'km',
        kmMin: Number(k.min),
        kmMax: Number(k.max),
        valor: Number(k.valor)
      })));
    }

    if (regrasParaCriar.length > 0) {
      await prisma.regraFrete.createMany({ data: regrasParaCriar });
    }

    // 6. Atualizar Exceções 
    await prisma.excecaoFrete.deleteMany({ where: { empresaId } });
    if (data.excecoesCep && data.excecoesCep.length > 0) {
      await prisma.excecaoFrete.createMany({
        data: data.excecoesCep.map((e: any) => ({
          empresaId,
          cep: e.cep,
          valor: Number(e.valor)
        }))
      });
    }

    revalidatePath("/system/cardapio/parametros");
    return { success: true };

  } catch (error: any) {
    console.error("Erro detalhado ao salvar:", error);
    return { success: false, error: "Erro interno: " + error.message };
  }
}