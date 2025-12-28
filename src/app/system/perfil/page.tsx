import { prisma } from "@/lib/prisma";
import EmpresaSettingsPage from "./EmpresaSettingsClient";

export default async function Page() {
  const empresa = await prisma.empresa.findFirst();
  return <EmpresaSettingsPage empresaInicial={empresa} />;
}