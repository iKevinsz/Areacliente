import { prisma } from "@/lib/prisma";
import FluxoCaixaClient from "./FluxoCaixaClient";

export default async function Page() {
  const empresaId = 1; // Ajuste conforme auth

  const dados = await prisma.fluxoCaixa.findMany({
    where: { empresaId },
    orderBy: { data: 'desc' }
  });

  // Serializa (Decimal -> Number, Date -> String)
  const dadosFormatados = dados.map((t) => ({
    ...t,
    id: t.id,
    valor: Number(t.valor),
    data: t.data.toISOString(),
  }));

  return <FluxoCaixaClient transacoesIniciais={dadosFormatados} />;
}