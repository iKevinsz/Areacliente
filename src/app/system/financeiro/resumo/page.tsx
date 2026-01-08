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
  Legend
} from 'recharts';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  Download,
  MoreHorizontal,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// ... (MANTENHA OS DADOS MOCKADOS IGUAIS AO CÓDIGO ANTERIOR) ...
const allFinancialData: any = {
  "Hoje": {
    summary: {
      totalRevenue: 2500.00,
      totalExpense: 800.00,
      balance: 1700.00,
      profitMargin: 68,
      balanceTrend: "+5% vs ontem",
      revenueProgress: 85,
      expenseProgress: 40,
    },
    monthlyBalance: [
      { label: '08h', receita: 200, despesa: 50 },
      { label: '10h', receita: 450, despesa: 100 },
      { label: '12h', receita: 800, despesa: 200 },
      { label: '14h', receita: 300, despesa: 150 },
      { label: '16h', receita: 500, despesa: 100 },
      { label: '18h', receita: 250, despesa: 200 },
    ],
    revenueByCategory: [
      { name: 'Vendas Loja', value: 1500, color: '#10b981' },
      { name: 'Delivery', value: 800, color: '#3b82f6' },
      { name: 'Outros', value: 200, color: '#8b5cf6' },
    ]
  },
  "Esta Semana": {
    summary: {
      totalRevenue: 12500.00,
      totalExpense: 4200.00,
      balance: 8300.00,
      profitMargin: 66,
      balanceTrend: "+8% vs semana passada",
      revenueProgress: 70,
      expenseProgress: 55,
    },
    monthlyBalance: [
      { label: 'Seg', receita: 1800, despesa: 600 },
      { label: 'Ter', receita: 2100, despesa: 550 },
      { label: 'Qua', receita: 1950, despesa: 700 },
      { label: 'Qui', receita: 2400, despesa: 800 },
      { label: 'Sex', receita: 2800, despesa: 900 },
      { label: 'Sáb', receita: 1450, despesa: 650 },
    ],
    revenueByCategory: [
      { name: 'Vendas Loja', value: 7000, color: '#10b981' },
      { name: 'Delivery', value: 4500, color: '#3b82f6' },
      { name: 'Outros', value: 1000, color: '#8b5cf6' },
    ]
  },
  "Este Mês": {
    summary: {
      totalRevenue: 48000.00,
      totalExpense: 12500.00,
      balance: 35500.00,
      profitMargin: 74,
      balanceTrend: "+12% vs mês anterior",
      revenueProgress: 75,
      expenseProgress: 25,
    },
    monthlyBalance: [
      { label: 'Sem 1', receita: 11000, despesa: 3000 },
      { label: 'Sem 2', receita: 12500, despesa: 3200 },
      { label: 'Sem 3', receita: 10800, despesa: 2800 },
      { label: 'Sem 4', receita: 13700, despesa: 3500 },
    ],
    revenueByCategory: [
      { name: 'Vendas Loja', value: 28000, color: '#10b981' },
      { name: 'Delivery', value: 15000, color: '#3b82f6' },
      { name: 'Outros', value: 5000, color: '#8b5cf6' },
    ]
  },
  "Este Ano": {
    summary: {
      totalRevenue: 580000.00,
      totalExpense: 185000.00,
      balance: 395000.00,
      profitMargin: 68,
      balanceTrend: "Acumulado Anual",
      revenueProgress: 60,
      expenseProgress: 45,
    },
    monthlyBalance: [
      { label: 'Jan', receita: 45000, despesa: 15000 },
      { label: 'Fev', receita: 52000, despesa: 14000 },
      { label: 'Mar', receita: 48000, despesa: 16000 },
      { label: 'Abr', receita: 61000, despesa: 18000 },
      { label: 'Mai', receita: 59000, despesa: 17000 },
      { label: 'Jun', receita: 72000, despesa: 21000 },
    ],
    revenueByCategory: [
      { name: 'Vendas Loja', value: 350000, color: '#10b981' },
      { name: 'Delivery', value: 180000, color: '#3b82f6' },
      { name: 'Outros', value: 50000, color: '#8b5cf6' },
    ]
  }
};

export default function FinancialOverview() {
  const [filtroAtivo, setFiltroAtivo] = useState('Este Mês');
  const opcoesFiltro = ['Hoje', 'Esta Semana', 'Este Mês', 'Este Ano'];
  const dadosAtuais = allFinancialData[filtroAtivo];

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

      {/* --- Header com Tabs --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral Financeira</h1>
          <p className="text-gray-500 text-sm">Acompanhe a saúde financeira do seu negócio</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs com cursor pointer e sem seleção de texto */}
          <div className="bg-gray-200 p-1 rounded-lg flex select-none">
            {opcoesFiltro.map((opcao) => (
              <button
                key={opcao}
                onClick={() => setFiltroAtivo(opcao)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
                  filtroAtivo === opcao
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-300/50"
                }`}
              >
                {opcao}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">

        {/* Adicionado: cursor-pointer e select-none nos cards para melhor sensação de clique/hover */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer select-none hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} className="text-blue-600" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-500 text-sm font-medium mb-1">Saldo em Caixa</p>
            <h3 className="text-3xl font-bold text-gray-800">{formatCurrency(dadosAtuais.summary.balance)}</h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-medium bg-green-50 w-fit px-2 py-0.5 rounded-full">
               <TrendingUp size={14} /> {dadosAtuais.summary.balanceTrend}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer select-none hover:shadow-md transition-all">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm font-medium mb-1">Receitas (Entradas)</p>
               <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(dadosAtuais.summary.totalRevenue)}</h3>
             </div>
             <div className="p-2 bg-green-100 text-green-600 rounded-lg">
               <ArrowUpCircle size={24} />
             </div>
           </div>
           <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-green-500 rounded-full transition-all duration-500" 
               style={{ width: `${dadosAtuais.summary.revenueProgress}%` }}
             ></div>
           </div>
           <p className="text-xs text-gray-400 mt-2">{dadosAtuais.summary.revenueProgress}% da meta atingida</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer select-none hover:shadow-md transition-all">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm font-medium mb-1">Despesas (Saídas)</p>
               <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(dadosAtuais.summary.totalExpense)}</h3>
             </div>
             <div className="p-2 bg-red-100 text-red-600 rounded-lg">
               <ArrowDownCircle size={24} />
             </div>
           </div>
           <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-red-500 rounded-full transition-all duration-500" 
               style={{ width: `${dadosAtuais.summary.expenseProgress}%` }}
             ></div>
           </div>
           <p className="text-xs text-gray-400 mt-2">{dadosAtuais.summary.expenseProgress}% do orçamento utilizado</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer select-none hover:shadow-md transition-all">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm font-medium mb-1">Margem de Lucro</p>
               <h3 className="text-2xl font-bold text-gray-800">{dadosAtuais.summary.profitMargin}%</h3>
             </div>
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
               <AlertCircle size={24} />
             </div>
           </div>
           <p className="text-sm text-gray-600 mt-4">
             {dadosAtuais.summary.profitMargin > 70 ? "Excelente saúde financeira." : "Margem dentro do esperado."}
           </p>
        </div>
      </div>

      {/* --- GRÁFICOS PRINCIPAIS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Gráfico de Barras */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Balanço - {filtroAtivo}</h3>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer"><MoreHorizontal size={20} /></button>
          </div>

          <div className="h-[300px] w-full cursor-crosshair"> {/* Cursor crosshair para o gráfico */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                key={filtroAtivo} 
                data={dadosAtuais.monthlyBalance}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => value ? `R$${value/1000}k` : ''} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" />

                <Bar dataKey="receita" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={800} />
                <Bar dataKey="despesa" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Receitas por Categoria</h3>
          </div>

          <div className="h-[200px] w-full relative cursor-pointer">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key={filtroAtivo}>
                <Pie
                  data={dadosAtuais.revenueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={800}
                >
                  {dadosAtuais.revenueByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : 0)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-gray-400 text-xs uppercase">Total</span>
                <span className="text-gray-800 font-bold text-lg">100%</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
             {dadosAtuais.revenueByCategory.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
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

      {/* --- TABELA --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Detalhamento - {filtroAtivo}</h3>
            <button className="text-blue-600 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors cursor-pointer">Ver Relatório Completo</button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-4">Período</th>
                        <th className="px-6 py-4">Receitas</th>
                        <th className="px-6 py-4">Despesas</th>
                        <th className="px-6 py-4 text-right">Saldo Líquido</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {dadosAtuais.monthlyBalance.map((row: any, index: number) => {
                        const balance = row.receita - row.despesa;
                        return (
                            // Adicionado: cursor-pointer e hover mais evidente
                            <tr key={index} className="hover:bg-blue-50/50 transition-colors cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-700">{row.label}</td>
                                <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(row.receita)}</td>
                                <td className="px-6 py-4 text-red-500 font-medium">{formatCurrency(row.despesa)}</td>
                                <td className={`px-6 py-4 text-right font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                    {formatCurrency(balance)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot className="bg-gray-50 font-bold text-gray-800">
                    <tr>
                        <td className="px-6 py-4">TOTAL</td>
                        <td className="px-6 py-4 text-green-700">{formatCurrency(dadosAtuais.summary.totalRevenue)}</td>
                        <td className="px-6 py-4 text-red-700">{formatCurrency(dadosAtuais.summary.totalExpense)}</td>
                        <td className="px-6 py-4 text-right text-blue-700">{formatCurrency(dadosAtuais.summary.balance)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
      </div>

    </div>
  );
}