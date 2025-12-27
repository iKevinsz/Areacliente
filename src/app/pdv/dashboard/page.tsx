'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, DollarSign, TrendingUp, Settings, 
  CreditCard, Smartphone, Banknote, Calendar, ArrowUpRight, ArrowDownRight, Filter, X
} from 'lucide-react';

// --- DADOS ESTÁTICOS ---
const PAYMENT_METHODS = [
  { name: 'Pix', value: 'R$ 6.425,00', percent: 50, color: 'bg-green-500', icon: <Smartphone size={16}/> },
  { name: 'Crédito', value: 'R$ 3.855,00', percent: 30, color: 'bg-blue-500', icon: <CreditCard size={16}/> },
  { name: 'Dinheiro', value: 'R$ 1.927,50', percent: 15, color: 'bg-green-700', icon: <Banknote size={16}/> },
  { name: 'Débito', value: 'R$ 642,50', percent: 5, color: 'bg-orange-500', icon: <CreditCard size={16}/> },
];

const MONTHLY_DATA = [
  { month: 'Jan', value: 12000 }, { month: 'Fev', value: 15000 },
  { month: 'Mar', value: 11000 }, { month: 'Abr', value: 18000 },
  { month: 'Mai', value: 22000 }, { month: 'Jun', value: 25000 },
  { month: 'Jul', value: 24000 }, { month: 'Ago', value: 21000 },
  { month: 'Set', value: 26000 }, { month: 'Out', value: 28000 },
  { month: 'Nov', value: 32000 }, { month: 'Dez', value: 15000 },
];

// --- COMPONENTE DE CARD DE MÉTRICA (Responsivo) ---
const MetricCard = ({ title, value, icon, trend, isPositive, colorClass, iconColorClass }: any) => (
  <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-10 -mt-10 transition-transform group-hover:scale-110 ${colorClass}`}></div>
    
    <div className="flex justify-between items-start mb-4 z-10">
      <div className={`p-2 md:p-3 rounded-xl ${colorClass} ${iconColorClass}`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center text-[10px] md:text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isPositive ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
          {trend}
        </span>
      )}
    </div>
    <div className="z-10">
      <p className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide mb-1 truncate">{title}</p>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </h3>
    </div>
  </div>
);

export default function PdvDashboardPage() {
  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const thirtyDaysAgo = lastMonth.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [chartData, setChartData] = useState<{day: string, value: number}[]>([]);
  const [kpiTotalPeriodo, setKpiTotalPeriodo] = useState(0);

  useEffect(() => {
    generateMockDataForPeriod(startDate, endDate);
  }, [startDate, endDate]);

  const generateMockDataForPeriod = (start: string, end: string) => {
    const dataArr = [];
    let totalSum = 0;
    const dtStart = new Date(start);
    const dtEnd = new Date(end);

    for (let d = new Date(dtStart); d <= dtEnd; d.setDate(d.getDate() + 1)) {
      const randomValue = Math.floor(Math.random() * 2500) + 500;
      dataArr.push({
        day: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: randomValue
      });
      totalSum += randomValue;
    }
    setChartData(dataArr);
    setKpiTotalPeriodo(totalSum);
  };

  const handleClearFilter = () => {
    setStartDate(thirtyDaysAgo);
    setEndDate(today);
  };

  const maxChartValue = Math.max(...chartData.map(d => d.value), 3000); 

  return (
    // AJUSTE: Padding menor no mobile (p-4) e maior no desktop (md:p-6)
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      
      {/* HEADER E FILTROS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs md:text-sm font-medium text-gray-400">Ponto de Venda</h2>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        
        {/* Filtro Responsivo: flex-wrap permite quebrar linha em telas muito pequenas */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full md:w-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1 pl-2">
              <Calendar size={14}/> <span className="hidden sm:inline">Período:</span>
            </span>
            <input 
              type="date" 
              className="flex-1 md:flex-none text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500 min-w-[100px]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-xs text-gray-400">até</span>
            <input 
              type="date" 
              className="flex-1 md:flex-none text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500 min-w-[100px]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            
            {(startDate !== thirtyDaysAgo || endDate !== today) && (
                <button onClick={handleClearFilter} className="ml-auto md:ml-1 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Limpar Filtro">
                    <X size={14} />
                </button>
            )}
        </div>
      </div>

      {/* --- GRID PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* COLUNA DA ESQUERDA (Métricas) */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 h-full">
                <MetricCard 
                    title="Faturamento Período" 
                    value={kpiTotalPeriodo} 
                    trend={'+12.5%'} isPositive={true}
                    icon={<Filter size={24} />} 
                    colorClass="bg-blue-50" iconColorClass="text-blue-600"
                />
                <MetricCard 
                    title="Mês Atual (Projeção)" 
                    value={12850.00} 
                    trend={'+5.2%'} isPositive={true}
                    icon={<DollarSign size={24} />} 
                    colorClass="bg-green-50" iconColorClass="text-green-600"
                />
            </div>

            <div className="h-full">
                <MetricCard 
                    title="Faturamento Anual (2025)" 
                    value={158400.00} 
                    trend={'-2.1%'} isPositive={false}
                    icon={<TrendingUp size={24} />} 
                    colorClass="bg-purple-50" iconColorClass="text-purple-600"
                />
            </div>
        </div>

        {/* COLUNA DA DIREITA (Formas de Pagamento) */}
        <div className="lg:col-span-1 bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Formas de Pagamento</h3>
                <button className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"><Settings size={16}/></button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-4 md:gap-6">
              {PAYMENT_METHODS.map((method, index) => (
                <div key={index}>
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700">
                      <span className={`p-1.5 rounded-md ${method.color} bg-opacity-10 text-${method.color.split('-')[1]}-600`}>
                        {method.icon}
                      </span>
                      {method.name}
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-bold text-gray-800">{method.value}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
                    <div className={`h-1.5 md:h-2 rounded-full ${method.color}`} style={{ width: `${method.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* --- GRÁFICO 1: RECEBIMENTO DIÁRIO --- */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">Recebimento Diário</h3>
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                Exibindo {chartData.length} dias
            </span>
        </div>
        
        {/* AJUSTE: overflow-x-auto permite rolar se houver muitos dias no mobile */}
        <div className="overflow-x-auto pb-2 scrollbar-hide">
            {/* min-w define uma largura mínima para o gráfico não esmagar */}
            <div className="h-48 flex items-end justify-between gap-1 mt-4 min-w-[600px] md:min-w-0">
                {chartData.length > 0 ? (
                    chartData.map((data, i) => {
                    const heightPercent = (data.value / maxChartValue) * 100;
                    return (
                        <div key={i} className="flex flex-col justify-end items-center flex-1 h-full group relative min-w-[12px]">
                            {/* Tooltip melhorado para mobile (hidden on touch, maybe) */}
                            <div className="hidden md:block absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                                {data.day}: R$ {data.value}
                            </div>
                            <div 
                                style={{ height: `${heightPercent}%` }} 
                                className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 ${i === chartData.length - 1 ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-400'}`}
                            ></div>
                        </div>
                    )
                    })
                ) : (
                    <div className="w-full text-center text-gray-400 text-sm">Selecione um período válido.</div>
                )}
            </div>
        </div>
        
        {/* Eixo X Otimizado */}
        <div className="border-t border-gray-100 mt-1 pt-2 flex justify-between text-[10px] text-gray-400 px-1">
            {chartData.length > 0 && (
                <>
                    <span>{chartData[0].day}</span>
                    <span className="hidden sm:inline">{chartData[Math.floor(chartData.length / 2)].day}</span>
                    <span>{chartData[chartData.length - 1].day}</span>
                </>
            )}
        </div>
      </div>

      {/* --- GRÁFICO 2: RECEBIMENTO MENSAL --- */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">Histórico Mensal (2025)</h3>
        </div>
        
        {/* AJUSTE CRÍTICO: overflow-x-auto para não quebrar no mobile */}
        <div className="overflow-x-auto pb-2">
            {/* min-w-[500px] força o gráfico a ter um tamanho decente, habilitando o scroll no mobile */}
            <div className="h-48 flex items-end justify-between gap-3 md:gap-4 mt-4 min-w-[500px] md:min-w-full">
                {MONTHLY_DATA.map((data, i) => {
                const heightPercent = (data.value / 35000) * 100;
                return (
                    <div key={i} className="flex flex-col justify-end items-center flex-1 h-full group relative">
                        <div className="hidden md:block absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                            R$ {new Intl.NumberFormat('pt-BR').format(data.value)}
                        </div>
                        <div 
                        style={{ height: `${heightPercent}%` }} 
                        className="w-full max-w-[30px] bg-indigo-100 group-hover:bg-indigo-500 rounded-t-md transition-all duration-300 relative"
                        ></div>
                        <span className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium">{data.month}</span>
                    </div>
                )
                })}
            </div>
        </div>
      </div>

    </div>
  );
}