"use client";

import React from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend 
} from "recharts";
import { 
  FaSackDollar, 
  FaCartShopping, 
  FaUsers, 
  FaCalendarCheck,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa6";

// --- DADOS MOCKADOS (Substituir pela sua API/Banco de Dados) ---
const kpiData = {
  faturamentoMes: 12450.00,
  faturamentoAno: 158900.00, 
  pedidos: 452,
  visitas: 3200,
};

const dadosFaturamentoDiario = [
  { dia: "01", valor: 1200 }, { dia: "05", valor: 2100 }, { dia: "10", valor: 800 },
  { dia: "15", valor: 1600 }, { dia: "20", valor: 2400 }, { dia: "25", valor: 1900 },
  { dia: "30", valor: 3100 },
];

const dadosFormaPagamento = [
  { name: "Pix", value: 4000, color: "#10B981" }, // Verde
  { name: "Crédito", value: 3000, color: "#3B82F6" }, // Azul
  { name: "Débito", value: 2000, color: "#F59E0B" }, // Laranja
  { name: "Dinheiro", value: 1000, color: "#EF4444" }, // Vermelho
];

const topProdutos = [
  { nome: "X-Tudo Artesanal", qtd: 120 },
  { nome: "Coca-Cola 2L", qtd: 98 },
  { nome: "Porção de Batata", qtd: 85 },
  { nome: "Suco de Laranja", qtd: 70 },
  { nome: "Açaí 500ml", qtd: 65 },
];

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
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Cardápio</h1>
          <p className="text-gray-500 text-sm">Visão geral da performance do seu delivery.</p>
        </div>
        
        {/* Filtro de Data (Exemplo Visual) */}
        <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option>Este Mês</option>
          <option>Mês Passado</option>
          <option>Este Ano</option>
        </select>
      </div>

      {/* KPI CARDS (BENTO GRID SUPERIOR) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Mês" 
          value={`R$ ${kpiData.faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtext="+ 12% vs mês anterior"
          icon={<FaSackDollar />}
          colorBg="bg-green-100"
          colorText="text-green-600"
        />
        <StatCard 
          title="Faturamento Anual" 
          value={`R$ ${kpiData.faturamentoAno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtext="Acumulado 2025"
          icon={<FaCalendarCheck />}
          colorBg="bg-blue-100"
          colorText="text-blue-600"
        />
        <StatCard 
          title="Total de Pedidos" 
          value={kpiData.pedidos}
          subtext="Média de 15/dia"
          icon={<FaCartShopping />}
          colorBg="bg-purple-100"
          colorText="text-purple-600"
        />
        <StatCard 
          title="Total de Visitas" 
          value={kpiData.visitas}
          subtext="Taxa de conversão: 14%"
          icon={<FaUsers />}
          colorBg="bg-orange-100"
          colorText="text-orange-600"
        />
      </div>

      {/* ÁREA DE GRÁFICOS PRINCIPAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE FATURAMENTO (OCUPA 2 COLUNAS) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Evolução do Faturamento</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosFaturamentoDiario}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number | undefined) => [`R$ ${value?.toFixed(2) || '0.00'}`, 'Vendas']}
                />
                <Area type="monotone" dataKey="valor" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE FORMAS DE PAGAMENTO (PIE CHART) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Formas de Pagamento</h2>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosFormaPagamento}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosFormaPagamento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            {/* Texto centralizado no Donut (Opcional) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-12 text-center pointer-events-none">
               <span className="block text-2xl font-bold text-gray-700">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP PRODUTOS E RANKING */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top 5 Produtos Mais Vendidos</h2>
          <div className="space-y-4">
            {topProdutos.map((produto, index) => (
              <div key={index} className="flex items-center">
                <span className="w-6 text-gray-400 font-bold text-sm">#{index + 1}</span>
                <div className="flex-1 ml-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{produto.nome}</span>
                    <span className="text-sm text-gray-500">{produto.qtd} vendas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(produto.qtd / topProdutos[0].qtd) * 100}%` }}
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