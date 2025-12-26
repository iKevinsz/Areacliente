'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart, // Importado para o novo gráfico
  Area       // Importado para o novo gráfico
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  Users, 
  CreditCard 
} from 'lucide-react';

// --- MOCK DATA ---

// 1. Dados de Vendas Mensais (NOVO)
const monthlySalesData = [
  { name: 'Jan', value: 4200 },
  { name: 'Fev', value: 5100 },
  { name: 'Mar', value: 3800 },
  { name: 'Abr', value: 6500 },
  { name: 'Mai', value: 5900 },
  { name: 'Jun', value: 7200 },
  { name: 'Jul', value: 8400 },
  { name: 'Ago', value: 7800 },
  { name: 'Set', value: 8900 },
  { name: 'Out', value: 9500 },
  { name: 'Nov', value: 10200 },
  { name: 'Dez', value: 11500 },
];

const topProductsData = [
  { name: 'Heineken Lata 350ml', value: 295, color: '#3b82f6' },
  { name: 'Amstel Lata 350ml', value: 245, color: '#f59e0b' },
  { name: 'Água Mineral 510ml', value: 230, color: '#ef4444' },
  { name: 'Heineken Garrafa 600ml', value: 145, color: '#10b981' },
  { name: 'Coca-Cola Lata 350ml', value: 125, color: '#06b6d4' },
  { name: 'Original Garrafa 600ml', value: 108, color: '#6366f1' },
  { name: 'Água com Gás 510ml', value: 95, color: '#8b5cf6' },
  { name: 'Corona Zero 350ml', value: 70, color: '#ec4899' },
  { name: 'Amstel Garrafa 600ml', value: 45, color: '#f97316' },
  { name: 'Coca Zero Lata 350ml', value: 40, color: '#a8a29e' },
];

const topCustomersData = [
  { name: 'Kawan', value: 2700 },
  { name: 'Suelem Pignatari', value: 1200 },
  { name: 'Sérgio Trento', value: 1100 },
  { name: 'Gilmar da Silva', value: 950 },
  { name: 'Maira Silva', value: 450 },
];

export default function AnalyticsDashboard() {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800 text-sm mb-1">{label}</p>
          <p className="text-blue-600 text-sm font-medium">
             {/* Verifica se é valor monetário ou unitário baseado no valor */}
             {payload[0].value > 1000 
                ? formatCurrency(payload[0].value) 
                : `${payload[0].value} un.`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Faturamento</h1>
          <p className="text-gray-500 text-sm">Visão geral do desempenho da sua loja</p>
        </div>
        
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">Hoje</button>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">7 Dias</button>
            <button className="px-4 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-md shadow-sm">Este Mês</button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Vendas Hoje</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(0)}</h3>
            <span className="text-xs font-medium text-gray-400 mt-1 block">0 pedidos hoje</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Faturamento Mês</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(0)}</h3>
            <span className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1">
               <TrendingUp size={12} className="rotate-180" /> -2% vs mês anterior
            </span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Calendar size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Faturamento Ano</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(79227.85)}</h3>
            <span className="text-xs font-medium text-green-600 mt-1 flex items-center gap-1">
               <TrendingUp size={12} /> +15% vs ano anterior
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><DollarSign size={24} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(43.75)}</h3>
            <span className="text-xs font-medium text-gray-400 mt-1 block">Média últimos 12 meses</span>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><CreditCard size={24} /></div>
        </div>
      </div>

      {/* --- NOVO GRÁFICO: Evolução de Vendas (Full Width) --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Evolução de Vendas</h3>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium flex items-center gap-1">
             <TrendingUp size={12} /> +12.5% Crescimento
          </span>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {/* Gradiente para o preenchimento azul bonito */}
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                tickFormatter={(value) => `R$${value/1000}k`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Inferior: Produtos e Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Produtos */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Produtos Mais Vendidos</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topProductsData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  tick={{fontSize: 11, fill: '#6b7280'}} 
                  interval={0}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Clientes */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Clientes</h3>
            <Users className="text-gray-400" size={20} />
          </div>

          <div className="space-y-6">
            {topCustomersData.map((customer, index) => (
              <div key={index} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{index + 1}. {customer.name}</span>
                  <span className="font-bold text-gray-900">{formatCurrency(customer.value)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 group-hover:bg-blue-700" 
                    style={{ width: `${(customer.value / 3000) * 100}%` }} 
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50">
             <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                Ver todos os clientes
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}