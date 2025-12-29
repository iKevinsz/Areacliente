import { prisma } from "@/lib/prisma";
import HistoricoCaixaClient from "./HistoricoCaixaClient";

export default async function Page() {
  const empresaId = 1; // Ajuste conforme autenticação

  // Busca pedidos/vendas agrupados por data
  const dados = await prisma.pedido.findMany({
    where: { 
      status: 'Finalizado' // ou o status que indica venda concluída
    },
    orderBy: { data: 'desc' },
    include: {
      itens: {
        include: {
          produto: true
        }
      }
    }
  });

  // Serialização (Decimal para Number, Date para String)
  const dadosFormatados = dados.map((p) => ({
    id: p.id,
    operador: "Sistema", // Como não há campo operador, usar valor padrão
    dataAbertura: p.data.toISOString(),
    dataFechamento: p.data.toISOString(),
    saldoInicial: 0,
    total: Number(p.total),
    quebra: 0,
    qtdVendas: p.itens.length
  }));

  return <HistoricoCaixaClient dadosIniciais={dadosFormatados} />;
}