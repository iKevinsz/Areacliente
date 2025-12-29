// 1. Importe o prisma do seu arquivo de configuração (melhor prática)
// Se der erro aqui, certifique-se que o arquivo src/lib/prisma.ts existe
import { prisma } from "@/lib/prisma"; 
import GruposClient from "@/app/system/cardapio/grupos/GruposClient";

async function getGrupos() {
  const grupos = await prisma.grupo.findMany({
    orderBy: { ordem: 'asc' },
    include: {
      
      produtos: true, 
      
      
      variacoes: true,
      complementos: true
    }
  });
  return grupos;
}

export default async function Page() {
  const dados = await getGrupos();


  const dadosFormatados = JSON.parse(JSON.stringify(dados));

  return (
    <main>
      
      <GruposClient grupos={dadosFormatados || []} />
    </main>
  );
}