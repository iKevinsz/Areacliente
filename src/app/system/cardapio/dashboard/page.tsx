"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend
} from "recharts";
import {
  FaSackDollar,
  FaCartShopping,
  FaUsers,
  FaCalendarCheck,
  FaArrowUp,
  FaArrowDown 
} from "react-icons/fa6";

// --- DADOS MOCKADOS ESTRUTURADOS POR PERÍODO ---

const allMockData: any = {
  "Este Mês": {
    kpi: {
      faturamento: 12450.00,
      faturamentoSubtext: "+ 12% vs mês anterior",
      pedidos: 452,
      visitas: 3200,
      visitasSubtext: "Taxa de conversão: 14%"
    },
    graficoFaturamento: [
      { dia: "01", valor: 1200 }, { dia: "05", valor: 2100 }, { dia: "10", valor: 800 },
      { dia: "15", valor: 1600 }, { dia: "20", valor: 2400 }, { dia: "25", valor: 1900 },
      { dia: "30", valor: 3100 },
    ],
    formaPagamento: [
      { name: "Pix", value: 4000, color: "#10B981" },
      { name: "Crédito", value: 3000, color: "#3B82F6" },
      { name: "Débito", value: 2000, color: "#F59E0B" },
      { name: "Dinheiro", value: 1000, color: "#EF4444" },
    ],
    topProdutos: [
      { nome: "X-Tudo Artesanal", qtd: 120 },
      { nome: "Coca-Cola 2L", qtd: 98 },
      { nome: "Porção de Batata", qtd: 85 },
      { nome: "Suco de Laranja", qtd: 70 },
      { nome: "Açaí 500ml", qtd: 65 },
    ]
  },
  "Mês Passado": {
    kpi: {
      faturamento: 11100.00,
      faturamentoSubtext: "- 2% vs mês anterior",
      pedidos: 401,
      visitas: 2950,
      visitasSubtext: "Taxa de conversão: 13.5%"
    },
    graficoFaturamento: [
      { dia: "01", valor: 1500 }, { dia: "05", valor: 1800 }, { dia: "10", valor: 1200 },
      { dia: "15", valor: 1400 }, { dia: "20", valor: 2000 }, { dia: "25", valor: 1500 },
      { dia: "30", valor: 1800 },
    ],
    formaPagamento: [
      { name: "Pix", value: 3500, color: "#10B981" },
      { name: "Crédito", value: 3200, color: "#3B82F6" },
      { name: "Débito", value: 1800, color: "#F59E0B" },
      { name: "Dinheiro", value: 1200, color: "#EF4444" },
    ],
    topProdutos: [
      { nome: "X-Salada", qtd: 110 },
      { nome: "X-Tudo Artesanal", qtd: 105 },
      { nome: "Coca-Cola 2L", qtd: 90 },
      { nome: "Porção de Batata", qtd: 80 },
      { nome: "Água s/ Gás", qtd: 60 },
    ]
  },
  "Este Ano": {
    kpi: {
      faturamento: 158900.00,
      faturamentoSubtext: "Acumulado 2024",
      pedidos: 5420,
      visitas: 38500,
      visitasSubtext: "Média anual"
    },
    graficoFaturamento: [
      // Simplificado para meses para o exemplo anual
      { dia: "Jan", valor: 10500 }, { dia: "Fev", valor: 11100 }, { dia: "Mar", valor: 12450 },
      { dia: "Abr", valor: 9800 }, { dia: "Mai", valor: 13200 }, { dia: "Jun", valor: 14500 },
    ],
    formaPagamento: [
      { name: "Pix", value: 50000, color: "#10B981" },
      { name: "Crédito", value: 45000, color: "#3B82F6" },
      { name: "Débito", value: 30000, color: "#F59E0B" },
      { name: "Dinheiro", value: 15000, color: "#EF4444" },
    ],
    topProdutos: [
      { nome: "X-Tudo Artesanal", qtd: 1500 },
      { nome: "Porção de Batata", qtd: 1200 },
      { nome: "Coca-Cola 2L", qtd: 1100 },
      { nome: "X-Bacon", qtd: 900 },
      { nome: "Suco Natural", qtd: 850 },
    ]
  }
};

// Dado fixo que não muda com o filtro (exemplo)
const faturamentoTotalAnoFixo = 158900.00;

// --- COMPONENTES ---

const StatCard = ({ title, value, icon, subtext, colorBg, colorText }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between transition-transform hover:-translate-y-1">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorBg} ${colorText} text-xl`}>
      {icon}
    </div>
  </div>
);

export default function DashboardCardapio() {
  // 1. Estado para controlar o filtro ativo
  const [filtroAtivo, setFiltroAtivo] = useState("Este Mês");
  const opcoesFiltro = ["Este Mês", "Mês Passado", "Este Ano"];

  // 2. Seleciona os dados com base no estado atual
  const dadosAtuais = allMockData[filtroAtivo];

  // Função auxiliar para formatar moeda
  const formatarMoeda = (valor: number) => valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* CABEÇALHO COM TABS */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Cardápio</h1>
          <p className="text-gray-500 text-sm">Visão geral da performance do seu delivery.</p>
        </div>

        {/* 3. Implementação das Tabs */}
        <div className="bg-gray-200 p-1 rounded-lg flex w-full md:w-auto">
          {opcoesFiltro.map((opcao) => (
            <button
              key={opcao}
              onClick={() => setFiltroAtivo(opcao)}
              className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filtroAtivo === opcao
                  ? "bg-white text-blue-600 shadow-sm" // Estilo Ativo
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-300/50" // Estilo Inativo
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Faturamento Variável (depende do filtro) */}
        <StatCard
          title={`Faturamento (${filtroAtivo})`}
          value={formatarMoeda(dadosAtuais.kpi.faturamento)}
          subtext={dadosAtuais.kpi.faturamentoSubtext}
          icon={<FaSackDollar />}
          colorBg="bg-green-100"
          colorText="text-green-600"
        />
        {/* Card Faturamento Fixo (Exemplo de dado que não muda) */}
        <StatCard
          title="Faturamento Total 2024"
          value={formatarMoeda(faturamentoTotalAnoFixo)}
          subtext="Acumulado fixo anual"
          icon={<FaCalendarCheck />}
          colorBg="bg-blue-100"
          colorText="text-blue-600"
        />
         {/* Card Pedidos Variável */}
        <StatCard
          title="Total de Pedidos"
          value={dadosAtuais.kpi.pedidos}
          subtext={filtroAtivo === 'Este Ano' ? "Total do ano" : "Média de vendas no período"}
          icon={<FaCartShopping />}
          colorBg="bg-purple-100"
          colorText="text-purple-600"
        />
         {/* Card Visitas Variável */}
        <StatCard
          title="Total de Visitas"
          value={dadosAtuais.kpi.visitas}
          subtext={dadosAtuais.kpi.visitasSubtext}
          icon={<FaUsers />}
          colorBg="bg-orange-100"
          colorText="text-orange-600"
        />
      </div>

      {/* ÁREA DE GRÁFICOS PRINCIPAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* GRÁFICO DE FATURAMENTO - Usando dadosAtuais */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Evolução do Faturamento - {filtroAtivo}</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              
              <AreaChart key={filtroAtivo} data={dadosAtuais.graficoFaturamento}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => value ? `R$${value/1000}k` : ''} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [formatarMoeda(typeof value === 'number' ? value : 0), 'Vendas']}
                />
                <Area type="monotone" dataKey="valor" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE FORMAS DE PAGAMENTO - Usando dadosAtuais */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Formas de Pagamento</h2>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
             
              <PieChart key={filtroAtivo}>
                <Pie
                  data={dadosAtuais.formaPagamento}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosAtuais.formaPagamento.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatarMoeda(typeof value === 'number' ? value : 0)} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-12 text-center pointer-events-none">
              <span className="block text-sm text-gray-500">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP PRODUTOS - Usando dadosAtuais */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top 5 Produtos Mais Vendidos - {filtroAtivo}</h2>
          <div className="space-y-4">
            {dadosAtuais.topProdutos.map((produto: any, index: number) => (
              <div key={index} className="flex items-center transition-all duration-300">
                <span className="w-6 text-gray-400 font-bold text-sm">#{index + 1}</span>
                <div className="flex-1 ml-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{produto.nome}</span>
                    <span className="text-sm text-gray-500">{produto.qtd} vendas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 rounded-r-none overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                      // Cálculo seguro para evitar divisão por zero se a lista estiver vazia
                      style={{ width: `${dadosAtuais.topProdutos[0]?.qtd ? (produto.qtd / dadosAtuais.topProdutos[0].qtd) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}