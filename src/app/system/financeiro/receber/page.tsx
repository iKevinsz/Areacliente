import { prisma } from "@/lib/prisma";
import ContasReceberClient from "./ContasReceberClient";

export default async function Page() {
  const empresaId = 1; 

  const dados = await prisma.contaReceber.findMany({
    where: { empresaId },
    orderBy: { vencimento: 'asc' }
  });

  // Serialização
  const contasFormatadas = dados.map((c) => ({
    ...c,
    id: c.id,
    valor: Number(c.valor),
    vencimento: c.vencimento.toISOString(),
  }));

  return <ContasReceberClient contasIniciais={contasFormatadas} />;
}