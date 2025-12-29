import { prisma } from "@/lib/prisma";
import EmpresaSettingsPage from "./EmpresaSettingsClient";

export default async function Page() {
  const empresa = await prisma.empresa.findFirst();

  if (!empresa) {
    return <div>Nenhuma empresa encontrada.</div>;
  }

  // Convertendo campos não serializáveis (Decimal) para tipos simples (Number)
  const empresaSerializada = {
    ...empresa,
    valorMinimo: empresa.valorMinimo ? Number(empresa.valorMinimo) : 0,
    // Se houver outros campos Decimal, adicione-os aqui seguindo o mesmo padrão
  };

  return <EmpresaSettingsPage empresaInicial={empresaSerializada} />;
}