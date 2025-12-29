import { prisma } from "@/lib/prisma";
import ParametrosClient from "./ParametrosClient";

export default async function Page() {
  // Ajuste o ID conforme sua lógica de autenticação
  const empresaId = 1;

  const dados = await prisma.empresa.findUnique({
    where: { id: empresaId },
    include: {
      horariosFuncionamento: true,
      pausas: true,
      cupons: true,
      regrasFrete: true,
      excecoesFrete: true,
    },
  });

  if (!dados) {
    return <div className="p-8 text-center text-gray-500">Empresa não encontrada.</div>;
  }

  // --- CONVERSÃO (SERIALIZAÇÃO) E TRATAMENTO DE NOMES ---
  // Utilizamos o plural conforme definido no include acima para evitar erro de 'undefined'
  const dadosSerializados = {
    ...dados,

    // Converte o campo Decimal da própria Empresa
    valorMinimo: dados.valorMinimo ? Number(dados.valorMinimo) : 0,

    // Converte os decimais dentro da lista de Cupons
    cupons: (dados.cupons || []).map((c) => ({
      ...c,
      valor: Number(c.valor),
      minimoCompra: Number(c.minimoCompra),
    })),

    // Converte os decimais das Regras de Frete (KM e Bairro)
    regrasFrete: (dados.regrasFrete || []).map((r) => ({
      ...r,
      valor: Number(r.valor),
      kmMin: r.kmMin ? Number(r.kmMin) : null,
      kmMax: r.kmMax ? Number(r.kmMax) : null,
    })),

    // Converte os decimais das Exceções de Frete
    excecoesFrete: (dados.excecoesFrete || []).map((e) => ({
      ...e,
      valor: Number(e.valor),
    })),

    // Garante que horários e pausas existam como arrays
    horariosFuncionamento: dados.horariosFuncionamento || [],
    pausas: dados.pausas || [],
  };

  return <ParametrosClient dadosIniciais={dadosSerializados} />;
}