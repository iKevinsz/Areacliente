import { prisma } from "@/lib/prisma";
import ContasPagarClient from "./ContasPagarClient";

// Esta função roda no Servidor antes de enviar o HTML para o navegador
export default async function Page() {
  // 1. Defina o ID da empresa (fixo em 1 para testes ou pegue da sessão do usuário)
  const empresaId = 1; 

  // 2. Busque os dados no banco usando o Prisma
  const dadosBrutos = await prisma.contaPagar.findMany({
    where: { 
      empresaId: empresaId 
    },
    orderBy: { 
      vencimento: 'asc' // Ordena por data de vencimento (mais antiga primeiro)
    }
  });

  // 3. Serialização (Tratamento de Dados)
  // O Next.js não aceita passar objetos "Decimal" ou "Date" diretamente para componentes "use client".
  // Precisamos converter Decimal para Number e Date para String.
  const contasFormatadas = dadosBrutos.map((conta) => ({
    ...conta,
    // Converte o ID para número (se necessário) ou mantém
    id: conta.id, 
    // Converte Decimal do banco para Number do Javascript
    valor: Number(conta.valor), 
    // Converte Date para String ISO (ex: "2023-10-25T00:00:00.000Z")
    // O seu componente Client já está preparado para tratar essa string.
    vencimento: conta.vencimento.toISOString(), 
  }));

  // 4. Renderiza o componente Cliente passando os dados iniciais
  return (
    <main>
      <ContasPagarClient contasIniciais={contasFormatadas} />
    </main>
  );
}