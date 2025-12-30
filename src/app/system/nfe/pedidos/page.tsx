// src/app/system/nfe/page.tsx
import PedidosNfeClient, { PedidoNfeDTO } from "./PedidoNfeClient";

export default function Page() {
  // Mock para visualização inicial
  const dadosMock: PedidoNfeDTO[] = [
    { 
      id: 1020, 
      clienteNome: "Mercado Silva LTDA", 
      clienteDoc: "12.345.678/0001-90", 
      data: "2023-12-28", 
      total: 1450.00, 
      status: 'pendente',
      itens: [
        { produto: "Farinha de Trigo 5kg", qtd: 10, valor: 45.00 },
        { produto: "Óleo de Soja", qtd: 50, valor: 10.00 },
        { produto: "Arroz Tipo 1", qtd: 20, valor: 25.00 }
      ]
    },
    { 
      id: 1019, 
      clienteNome: "João da Silva", 
      clienteDoc: "123.456.789-00", 
      data: "2023-12-27", 
      total: 89.90, 
      status: 'autorizada',
      nfeChave: '352312...',
      itens: [{ produto: "Kit Churrasco", qtd: 1, valor: 89.90 }]
    },
    { 
      id: 1018, 
      clienteNome: "Padaria Central", 
      clienteDoc: "98.765.432/0001-10", 
      data: "2023-12-26", 
      total: 5000.00, 
      status: 'erro',
      itens: [{ produto: "Equipamento Industrial", qtd: 1, valor: 5000.00 }]
    }
  ];

  return <PedidosNfeClient initialPedidos={dadosMock} />;
}