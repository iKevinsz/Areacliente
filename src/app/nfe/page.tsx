"use client";

import React, { useState } from "react";

// --- Componentes de UI Reutilizáveis (Inputs, Labels, etc.) ---

// Componente de Label padrão
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

// Componente de Input de Texto padrão
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
  />
);

// Componente de Select padrão
const Select = ({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
  >
    {children}
  </select>
);

// Componente de Título de Seção
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 mb-4 flex items-center">
    {children}
  </h3>
);


// --- Componentes da Página de NF-e ---

// Tab 1: Dados Gerais e Destinatário
function TabDestinatario() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Seção: Dados da Operação */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <SectionTitle>
          <span className="bg-blue-100 text-blue-800 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">1</span>
          Dados da Operação
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Tipo de Operação</Label>
            <Select>
              <option>Saída (Venda)</option>
              <option>Entrada (Devolução)</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Natureza da Operação (CFOP principal)</Label>
            <Select>
              <option value="5102">5.102 - Venda de mercadoria adquirida de terceiros</option>
              <option value="5405">5.405 - Venda de mercadoria (ST)</option>
            </Select>
          </div>
          <div>
            <Label>Data de Emissão</Label>
            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>
      </section>

      {/* Seção: Destinatário */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <SectionTitle>
           <span className="bg-blue-100 text-blue-800 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">2</span>
           Destinatário / Remetente
        </SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-3">
            <Label>CPF / CNPJ</Label>
             <div className="flex">
              <Input placeholder="00.000.000/0000-00" className="rounded-r-none" />
              <button className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-2 rounded-r-md text-sm hover:bg-gray-200">🔍 Buscar</button>
             </div>
          </div>
           <div className="md:col-span-5">
            <Label>Nome / Razão Social</Label>
            <Input placeholder="Nome do Cliente SA" />
          </div>
          <div className="md:col-span-4">
            <Label>Inscrição Estadual</Label>
            <Input placeholder="Isento ou número" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-2">
            <Label>CEP</Label>
            <Input placeholder="00000-000" />
          </div>
          <div className="md:col-span-6">
            <Label>Logradouro (Rua, Av...)</Label>
            <Input />
          </div>
          <div className="md:col-span-2">
            <Label>Número</Label>
            <Input />
          </div>
           <div className="md:col-span-2">
            <Label>Complemento</Label>
            <Input />
          </div>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Label>Bairro</Label>
            <Input />
          </div>
           <div className="md:col-span-2">
            <Label>UF</Label>
            <Select>
              <option>SP</option>
              <option>RJ</option>
              <option>MG</option>
              {/* Outros estados */}
            </Select>
          </div>
          <div className="md:col-span-6">
            <Label>Município</Label>
            <Select>
              <option>Selecione a UF primeiro...</option>
               <option>São Paulo</option>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}

// Tab 2: Produtos e Serviços (A parte mais complexa)
function TabProdutos() {
  // Dados de exemplo para a tabela
  const produtosMock = [
    { id: 1, codigo: "PROD001", descricao: "Notebook Gamer Dell G15", ncm: "84713019", qtd: 1, valorUnit: 5500.00, total: 5500.00 },
    { id: 2, codigo: "MS-WRD", descricao: "Licença Office 365 Business", ncm: "00000000", qtd: 5, valorUnit: 50.00, total: 250.00 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
           <SectionTitle>
             <span className="bg-blue-100 text-blue-800 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">3</span>
             Itens da Nota
           </SectionTitle>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             Adicionar Produto
           </button>
        </div>

        {/* Tabela de Produtos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Código</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">NCM</th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Qtd.</th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Vlr. Unit.</th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Total Bruto</th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtosMock.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{prod.codigo}</td>
                  <td className="px-3 py-4 text-sm text-gray-900 font-medium">{prod.descricao}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{prod.ncm}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{prod.qtd}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-right">R$ {prod.valorUnit.toFixed(2)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">R$ {prod.total.toFixed(2)}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                    <button className="text-blue-600 hover:text-blue-900 mx-1">Editar</button>
                    <button className="text-red-600 hover:text-red-900 mx-1 text-xs">X</button>
                  </td>
                </tr>
              ))}
              {/* Linha de totais da tabela (opcional) */}
               <tr className="bg-gray-100 font-semibold">
                <td colSpan={5} className="px-3 py-3 text-right text-sm text-gray-700">Subtotal dos Itens:</td>
                <td className="px-3 py-3 text-right text-sm text-gray-900">R$ 5.750,00</td>
                <td></td>
               </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// Componente da Barra Lateral de Totais (Fixo à direita em telas grandes)
function TotaisSidebar() {
  // Função auxiliar para linhas de resumo
  const SummaryRow = ({ label, value, highlight = false, negative = false }: { label: string; value: string; highlight?: boolean; negative?: boolean }) => (
    <div className={`flex justify-between items-center py-2 ${highlight ? 'text-lg font-bold border-t-2 border-gray-300 mt-2 pt-4' : 'text-sm border-b border-gray-100'}`}>
      <span className={`${highlight ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
      <span className={`${highlight ? 'text-blue-800' : negative ? 'text-red-600' : 'text-gray-900'}`}>{negative && "- "}{value}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 h-fit sticky top-8">
      <h3 className="text-md font-bold text-gray-800 mb-4 uppercase tracking-wide pb-2 border-b">Resumo da Nota</h3>

      <div className="space-y-1">
        <SummaryRow label="Total dos Produtos" value="R$ 5.750,00" />
        <SummaryRow label="Frete" value="R$ 150,00" />
        <SummaryRow label="Seguro" value="R$ 0,00" />
        <SummaryRow label="Outras Despesas" value="R$ 0,00" />
        <SummaryRow label="Desconto Total" value="R$ 50,00" negative />
      </div>

      <div className="mt-6 mb-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Impostos Estimados</h4>
          <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-600 space-y-1">
             <div className="flex justify-between"><span>Total ICMS:</span> <span>R$ 1.035,00</span></div>
             <div className="flex justify-between"><span>Total IPI:</span> <span>R$ 275,00</span></div>
             <div className="flex justify-between"><span>PIS/COFINS:</span> <span>R$ 531,87</span></div>
          </div>
      </div>

      <SummaryRow label="Valor Total da Nota" value="R$ 5.850,00" highlight />

      <div className="mt-8 flex flex-col gap-3">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-bold text-lg shadow-sm transition-all flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Transmitir NF-e
        </button>
        <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-md font-medium transition-all">
          Salvar Rascunho
        </button>
         <button className="w-full text-gray-500 hover:text-red-600 py-2 text-sm transition-all">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// --- Página Principal ---
export default function NfeCreationPage() {
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState<'destinatario' | 'produtos' | 'pagamento'>('destinatario');

  // Função auxiliar para estilizar os botões das abas
  const tabTriggerClass = (tabName: string) =>
    `pb-3 px-1 border-b-2 font-medium text-sm transition-all ${
      activeTab === tabName
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      {/* Cabeçalho da Página */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
              <span className="bg-blue-600 text-white p-2 rounded mr-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </span>
              Nova Nota Fiscal Eletrônica (NF-e)
            </h1>
            <p className="mt-1 text-sm text-gray-500 ml-12">Preencha os dados abaixo para emitir o documento fiscal.</p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
             <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Status: Em Digitação
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout Principal: Coluna Esquerda (Formulário) + Coluna Direita (Totais) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Área Principal do Formulário (2/3 da largura) */}
          <div className="lg:col-span-2">
            {/* Navegação em Abas */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('destinatario')} className={tabTriggerClass('destinatario')}>
                  1. Destinatário e Dados
                </button>
                <button onClick={() => setActiveTab('produtos')} className={tabTriggerClass('produtos')}>
                  2. Produtos e Impostos
                </button>
                <button onClick={() => setActiveTab('pagamento')} className={tabTriggerClass('pagamento')}>
                  3. Transporte e Pagamento
                </button>
              </nav>
            </div>

            {/* Conteúdo das Abas */}
            <div className="mb-8">
              {activeTab === 'destinatario' && <TabDestinatario />}
              
              {activeTab === 'produtos' && <TabProdutos />}

              {activeTab === 'pagamento' && (
                <div className="bg-white p-12 text-center rounded-lg border border-dashed border-gray-300 text-gray-500 animate-in fade-in duration-300">
                  (Conteúdo das abas Transporte e Pagamento seria implementado aqui...)
                  <br/>
                  <button onClick={() => setActiveTab('destinatario')} className="text-blue-600 underline mt-4">Voltar ao início</button>
                </div>
              )}
            </div>

             {/* Botões de Navegação Inferior */}
             <div className="flex justify-between mt-4 py-4 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled={activeTab === 'destinatario'}>
                  ← Anterior
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Próximo Passo →
                </button>
             </div>
          </div>

          {/* Sidebar de Totais (1/3 da largura) */}
          <div className="lg:col-span-1">
             <TotaisSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}