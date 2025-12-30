import { getContasReceber } from "@/app/actions/contas";
import ContasReceberClient from "./ContasReceberClient";

export default async function Page() {
  const empresaId = 1; // ID da empresa fixo ou da sessão
  
  // Busca dados iniciais
  const dados = await getContasReceber(empresaId);

  return <ContasReceberClient initialContas={dados} />;
}