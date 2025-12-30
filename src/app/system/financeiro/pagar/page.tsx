import { getContasPagar } from "@/app/actions/contas";
import ContasPagarClient from "./ContasPagarClient";

export default async function Page() {
  const empresaId = 1; // ID fixo por enquanto
  
  // Busca dados iniciais
  const dados = await getContasPagar(empresaId);

  return <ContasPagarClient initialContas={dados} />;
}