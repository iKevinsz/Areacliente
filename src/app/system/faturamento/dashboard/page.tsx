'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  Users, 
  CreditCard,
  X,
  Search,
  Trophy
} from 'lucide-react';

// --- MOCK DATA (DADOS FICTÍCIOS) ---

// 1. Vendas Gerais (Gráfico de Área)
const salesToday = [
  { name: '08:00', value: 150 }, { name: '10:00', value: 420 }, { name: '12:00', value: 850 },
  { name: '14:00', value: 600 }, { name: '16:00', value: 950 }, { name: '18:00', value: 1200 },
  { name: '20:00', value: 800 }, { name: '22:00', value: 300 },
];
const salesWeek = [
  { name: 'Seg', value: 3200 }, { name: 'Ter', value: 4100 }, { name: 'Qua', value: 3800 },
  { name: 'Qui', value: 5200 }, { name: 'Sex', value: 6900 }, { name: 'Sáb', value: 8400 }, { name: 'Dom', value: 7100 },
];
const salesMonth = [
  { name: 'Semana 1', value: 15400 }, { name: 'Semana 2', value: 18200 }, { name: 'Semana 3', value: 16800 }, { name: 'Semana 4', value: 21500 },
];

// 2. Produtos Mais Vendidos (Gráfico de Barras - Dinâmico)
const productsToday = [
  { name: 'Pão Francês', value: 850, color: '#f59e0b' },
  { name: 'Café Expresso', value: 120, color: '#3b82f6' },
  { name: 'Coca-Cola Lata', value: 95, color: '#ef4444' },
  { name: 'Pão de Queijo', value: 80, color: '#10b981' },
  { name: 'Misto Quente', value: 65, color: '#f97316' },
];

const productsWeek = [
  { name: 'Heineken Lata', value: 450, color: '#10b981' },
  { name: 'Coca-Cola 2L', value: 320, color: '#ef4444' },
  { name: 'Água Mineral', value: 280, color: '#3b82f6' },
  { name: 'Carvão 5kg', value: 150, color: '#a8a29e' },
  { name: 'Gelo 5kg', value: 120, color: '#06b6d4' },
];

const productsMonth = [
  { name: 'Heineken Lata 350ml', value: 1295, color: '#3b82f6' },
  { name: 'Amstel Lata 350ml', value: 945, color: '#f59e0b' },
  { name: 'Água Mineral 510ml', value: 830, color: '#ef4444' },
  { name: 'Heineken Garrafa', value: 545, color: '#10b981' },
  { name: 'Coca-Cola Lata', value: 425, color: '#06b6d4' },
];

// 3. Top Clientes (Resumo)
const topCustomersSummary = [
  { name: 'Kawan', value: 2700 },
  { name: 'Suelem Pignatari', value: 1200 },
  { name: 'Sérgio Trento', value: 1100 },
  { name: 'Gilmar da Silva', value: 950 },
  { name: 'Maira Silva', value: 450 },
];

// 4. Lista Completa de Clientes (Para o Modal)
const allCustomersData = [
  { id: 1, name: 'Kawan', value: 2700, orders: 15 },
  { id: 2, name: 'Suelem Pignatari', value: 1200, orders: 8 },
  { id: 3, name: 'Sérgio Trento', value: 1100, orders: 6 },
  { id: 4, name: 'Gilmar da Silva', value: 950, orders: 5 },
  { id: 5, name: 'Maira Silva', value: 450, orders: 3 },
  { id: 6, name: 'João Souza', value: 320, orders: 2 },
  { id: 7, name: 'Maria Oliveira', value: 280, orders: 2 },
  { id: 8, name: 'Pedro Santos', value: 150, orders: 1 },
  { id: 9, name: 'Ana Costa', value: 120, orders: 1 },
  { id: 10, name: 'Lucas Pereira', value: 90, orders: 1 },
];

export default function AnalyticsDashboard() {
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month'>('month');
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  // Lógica para alternar dados de VENDAS (Gráfico de Área)
  const chartData = useMemo(() => {
    switch (activeFilter) {
      case 'today': return salesToday;
      case 'week': return salesWeek;
      case 'month': default: return salesMonth;
    }
  }, [activeFilter]);

  // Lógica para alternar dados de PRODUTOS (Gráfico de Barras)
  const productsData = useMemo(() => {
    switch (activeFilter) {
      case 'today': return productsToday;
      case 'week': return productsWeek;
      case 'month': default: return productsMonth;
    }
  }, [activeFilter]);

  const chartTitle = useMemo(() => {
    switch (activeFilter) {
      case 'today': return 'Hoje';
      case 'week': return 'Últimos 7 Dias';
      case 'month': return 'Este Mês';
    }
  }, [activeFilter]);

  // Filtragem da lista completa de clientes no modal
  const filteredAllClients = allCustomersData.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800 text-sm mb-1">{label}</p>
          <p className="text-blue-600 text-sm font-medium">
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
        
        {/* FILTROS */}
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setActiveFilter('today')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === 'today' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hoje
            </button>
            <button 
              onClick={() => setActiveFilter('week')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === 'week' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              7 Dias
            </button>
            <button 
              onClick={() => setActiveFilter('month')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === 'month' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Este Mês
            </button>
        </div>
      </div>

      {/* Grid de KPIs (Estáticos para exemplo, mas poderiam ser dinâmicos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div><p className="text-sm font-medium text-gray-500 mb-1">Vendas Hoje</p><h3 className="text-2xl font-bold text-gray-900">{formatCurrency(5270.00)}</h3><span className="text-xs font-medium text-gray-400 mt-1 block">12 pedidos hoje</span></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div><p className="text-sm font-medium text-gray-500 mb-1">Faturamento Mês</p><h3 className="text-2xl font-bold text-gray-900">{formatCurrency(71900.00)}</h3><span className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1"><TrendingUp size={12} className="rotate-180" /> -2% vs mês anterior</span></div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Calendar size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div><p className="text-sm font-medium text-gray-500 mb-1">Faturamento Ano</p><h3 className="text-2xl font-bold text-gray-900">{formatCurrency(79227.85)}</h3><span className="text-xs font-medium text-green-600 mt-1 flex items-center gap-1"><TrendingUp size={12} /> +15% vs ano anterior</span></div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><DollarSign size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
          <div><p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio</p><h3 className="text-2xl font-bold text-gray-900">{formatCurrency(43.75)}</h3><span className="text-xs font-medium text-gray-400 mt-1 block">Média últimos 12 meses</span></div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><CreditCard size={24} /></div>
        </div>
      </div>

      {/* --- GRÁFICO DE VENDAS (ÁREA) --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Evolução de Vendas ({chartTitle})</h3>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium flex items-center gap-1">
             <TrendingUp size={12} /> +12.5%
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart key={activeFilter + 'sales'} data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `R$${value/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- TOP PRODUTOS (DINÂMICO) --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Produtos ({chartTitle})</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* key força a reanimação quando o filtro muda */}
              <BarChart key={activeFilter + 'products'} layout="vertical" data={productsData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 11, fill: '#6b7280'}} interval={0} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {productsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TOP CLIENTES --- */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Clientes (Mês)</h3>
            <Users className="text-gray-400" size={20} />
          </div>

          <div className="space-y-6 flex-1">
            {topCustomersSummary.map((customer, index) => (
              <div key={index} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{index + 1}. {customer.name}</span>
                  <span className="font-bold text-gray-900">{formatCurrency(customer.value)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 group-hover:bg-blue-700" style={{ width: `${(customer.value / 3000) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50">
             <button 
                onClick={() => setIsClientsModalOpen(true)}
                className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
             >
               Ver todos os clientes
             </button>
          </div>
        </div>
      </div>

      {/* --- MODAL: LISTA COMPLETA DE CLIENTES --- */}
      {isClientsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500"/> Ranking de Clientes
                </h2>
                <p className="text-sm text-gray-500">Listagem completa ordenada por valor de compra</p>
              </div>
              <button 
                onClick={() => setIsClientsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Barra de Busca Modal */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all" 
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Lista Scrollável */}
            <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3 text-center">Pedidos</th>
                    <th className="px-6 py-3 text-right">Total Gasto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAllClients.map((client, index) => (
                    <tr key={client.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono w-12">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{client.name}</td>
                      <td className="px-6 py-4 text-center text-gray-600 bg-gray-50/30">{client.orders}</td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600">{formatCurrency(client.value)}</td>
                    </tr>
                  ))}
                  {filteredAllClients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
              <button 
                onClick={() => setIsClientsModalOpen(false)} 
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}