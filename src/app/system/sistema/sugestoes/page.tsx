import { prisma } from "@/lib/prisma"; 
import SugestoesClient from "./SugestoesClient"; 

// Revalida a cada 0 segundos 
export const dynamic = 'force-dynamic'; 

export default async function SugestoesPage() {
  // Busca as sugestões no banco ordenadas
  const sugestoes = await prisma.sugestao.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  return (
    <main>
      <SugestoesClient dadosIniciais={sugestoes as any} />
    </main>
  );
}