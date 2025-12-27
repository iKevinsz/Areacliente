'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  Filter,
  Download,
  MoreHorizontal,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// --- DADOS MOCKADOS (Baseado na sua referência) ---

const financialSummary = {
  totalRevenue: 48000.00,
  totalExpense: 12500.00,
  balance: 35500.00,
  profitMargin: 74, // %
};

// Dados para o Gráfico de Balanço Mensal (Barras)
const monthlyBalanceData = [
  { month: 'Jan', receita: 4500, despesa: 3200 },
  { month: 'Fev', receita: 5200, despesa: 2800 },
  { month: 'Mar', receita: 4800, despesa: 4100 },
  { month: 'Abr', receita: 6100, despesa: 3500 },
  { month: 'Mai', receita: 5900, despesa: 3000 },
  { month: 'Jun', receita: 7200, despesa: 4500 },
  { month: 'Jul', receita: 8400, despesa: 3900 },
  { month: 'Ago', receita: 7800, despesa: 4200 },
  { month: 'Set', receita: 8900, despesa: 4800 },
  { month: 'Out', receita: 9500, despesa: 5100 },
  { month: 'Nov', receita: 10200, despesa: 5500 },
  { month: 'Dez', receita: 11500, despesa: 6000 },
];

// Dados para o Gráfico de Rosca (Categorias de Despesas)
const expensesByCategory = [
  { name: 'Fornecedores', value: 4500, color: '#ef4444' }, // Vermelho
  { name: 'Pessoal', value: 3200, color: '#f97316' },     // Laranja
  { name: 'Operacional', value: 2100, color: '#eab308' },  // Amarelo
  { name: 'Marketing', value: 1500, color: '#3b82f6' },    // Azul
  { name: 'Impostos', value: 1200, color: '#64748b' },     // Cinza
];

// Dados para o Gráfico de Rosca (Categorias de Receitas)
const revenueByCategory = [
  { name: 'Vendas Loja', value: 28000, color: '#10b981' }, // Verde Esmeralda
  { name: 'Delivery', value: 15000, color: '#3b82f6' },    // Azul
  { name: 'Outros', value: 5000, color: '#8b5cf6' },       // Roxo
];

export default function FinancialOverview() {
  const [dateRange, setDateRange] = useState('Este Mês');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg z-50">
          <p className="font-bold text-gray-800 text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full font-sans">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral Financeira</h1>
          <p className="text-gray-500 text-sm">Acompanhe a saúde financeira do seu negócio</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
            <Calendar size={16} />
            <span className="hidden sm:inline">Período:</span> 
            <select 
              className="bg-transparent outline-none cursor-pointer font-semibold text-blue-600"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>Hoje</option>
              <option>Esta Semana</option>
              <option>Este Mês</option>
              <option>Este Ano</option>
            </select>
          </button>
          <div className="w-px h-6 bg-gray-200"></div>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors" title="Filtrar">
            <Filter size={18} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors" title="Exportar">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* --- KPIs (Cards de Resumo) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Card 1: Saldo */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} className="text-blue-600" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">Saldo em Caixa</p>
            <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(financialSummary.balance)}</h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-medium bg-green-50 w-fit px-2 py-0.5 rounded-full">
               <TrendingUp size={14} /> +12% vs mês anterior
            </div>
          </div>
        </div>

        {/* Card 2: Receitas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Receitas (Entradas)</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(financialSummary.totalRevenue)}</h3>
              </div>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <ArrowUpCircle size={24} />
              </div>
           </div>
           <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[75%] rounded-full"></div>
           </div>
           <p className="text-xs text-gray-400 mt-2">75% da meta mensal atingida</p>
        </div>

        {/* Card 3: Despesas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Despesas (Saídas)</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(financialSummary.totalExpense)}</h3>
              </div>
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <ArrowDownCircle size={24} />
              </div>
           </div>
           <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[25%] rounded-full"></div>
           </div>
           <p className="text-xs text-gray-400 mt-2">Dentro do orçamento previsto</p>
        </div>

        {/* Card 4: Lucratividade */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Margem de Lucro</p>
                <h3 className="text-2xl font-bold text-gray-800">{financialSummary.profitMargin}%</h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <AlertCircle size={24} />
              </div>
           </div>
           <p className="text-sm text-gray-600 mt-4">
             Excelente saúde financeira. Mantenha as despesas controladas.
           </p>
        </div>
      </div>

      {/* --- GRÁFICOS PRINCIPAIS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Gráfico de Barras: Balanço Mensal */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Balanço Mensal (Entradas x Saídas)</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyBalanceData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barSize={12} // Barras finas e modernas
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" />
                
                {/* Barras com Radius apenas no topo */}
                <Bar dataKey="receita" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca: Receitas por Categoria */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Receitas por Categoria</h3>
          </div>
          
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // Faz virar uma Rosca (Donut)
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => value ? formatCurrency(value) : ''} />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto central do Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-xs uppercase">Total</span>
                <span className="text-gray-800 font-bold text-lg">100%</span>
            </div>
          </div>

          {/* Legenda Customizada */}
          <div className="mt-6 space-y-3">
             {revenueByCategory.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(item.value)}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* --- TABELA DE BALANÇO MENSAL --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Detalhamento Financeiro</h3>
            <button className="text-blue-600 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">Ver Relatório Completo</button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-4">Mês</th>
                        <th className="px-6 py-4">Receitas</th>
                        <th className="px-6 py-4">Despesas</th>
                        <th className="px-6 py-4 text-right">Saldo Líquido</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {monthlyBalanceData.map((row, index) => {
                        const balance = row.receita - row.despesa;
                        return (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-700">{row.month}/2025</td>
                                <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(row.receita)}</td>
                                <td className="px-6 py-4 text-red-500 font-medium">{formatCurrency(row.despesa)}</td>
                                <td className={`px-6 py-4 text-right font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {formatCurrency(balance)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                {/* Footer da Tabela */}
                <tfoot className="bg-gray-50 font-bold text-gray-800">
                    <tr>
                        <td className="px-6 py-4">TOTAL ANUAL</td>
                        <td className="px-6 py-4 text-green-700">{formatCurrency(financialSummary.totalRevenue * 12)}</td>
                        <td className="px-6 py-4 text-red-700">{formatCurrency(financialSummary.totalExpense * 12)}</td>
                        <td className="px-6 py-4 text-right text-blue-700">{formatCurrency(financialSummary.balance * 12)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
      </div>

    </div>
  );
}