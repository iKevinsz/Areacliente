// src/app/system/orcamentos/page.tsx
import OrcamentosClient, { OrcamentoDTO } from "./OrcamentosClient";

export default function Page() {
  
  // Mock de Dados
  const mockOrcamentos: OrcamentoDTO[] = [
    {
      id: 5001,
      cliente: "Restaurante Sabor & Arte",
      documento: "45.123.000/0001-99",
      dataEmissao: "2023-12-29",
      validade: "2024-01-15",
      total: 3250.00,
      status: 'pendente',
      observacao: "Entrega prevista para 5 dias úteis após aprovação.",
      itens: [
        { id: 1, produto: "Mesa Industrial Inox", qtd: 2, valorUnit: 1200.00, total: 2400.00 },
        { id: 2, produto: "Cadeira Estofada Premium", qtd: 10, valorUnit: 85.00, total: 850.00 }
      ]
    },
    {
      id: 5002,
      cliente: "Carlos Eduardo da Silva",
      documento: "123.456.789-00",
      dataEmissao: "2023-12-28",
      validade: "2024-01-05",
      total: 450.00,
      status: 'aprovado',
      itens: [
        { id: 3, produto: "Kit Ferramentas Profissional", qtd: 1, valorUnit: 450.00, total: 450.00 }
      ]
    },
    {
      id: 4998,
      cliente: "Tech Solutions",
      dataEmissao: "2023-12-10",
      validade: "2023-12-20",
      total: 12000.00,
      status: 'rejeitado',
      observacao: "Cliente achou o prazo de entrega muito longo.",
      itens: [
        { id: 4, produto: "Servidor Rack 2U", qtd: 1, valorUnit: 12000.00, total: 12000.00 }
      ]
    }
  ];

  return <OrcamentosClient initialOrcamentos={mockOrcamentos} />;
}