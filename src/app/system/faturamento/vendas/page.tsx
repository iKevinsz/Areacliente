import { getHistoricoCaixas } from '@/app/actions/caixa';
import HistoricoCaixaClient from './HistoricoCaixaClient'; 

export default async function Page() {
  const empresaId = 1; // Substituir pelo ID da sessão real no futuro

  // 1. Busca os dados no banco (Server Side)
  const dadosDoBanco = await getHistoricoCaixas(empresaId);

  // 2. Passa os dados reais para o componente
  return <HistoricoCaixaClient dadosIniciais={dadosDoBanco} />;
}