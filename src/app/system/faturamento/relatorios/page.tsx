"use client";

import React, { useState } from "react";
import { 
  Calendar, Filter, Download, Printer, 
  Search, TrendingUp, CreditCard, DollarSign, 
  AlertCircle, ChevronDown, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Dados Mockados para o Gráfico
const dadosGrafico = [
  { nome: '01/12', valor: 4000 },
  { nome: '05/12', valor: 3000 },
  { nome: '10/12', valor: 2000 },
  { nome: '15/12', valor: 2780 },
  { nome: '20/12', valor: 1890 },
  { nome: '25/12', valor: 2390 },
  { nome: '30/12', valor: 3490 },
];

// Dados Mockados para a Tabela
const transacoesIniciais = [
  { id: "#10234", data: "27/12/2025 14:30", cliente: "Consumidor Final", pagto: "Crédito", valor: 150.00, status: "Aprovado" },
  { id: "#10235", data: "27/12/2025 14:45", cliente: "João Silva", pagto: "PIX", valor: 320.50, status: "Aprovado" },
  { id: "#10236", data: "27/12/2025 15:10", cliente: "Maria Oliveira", pagto: "Débito", valor: 45.90, status: "Aprovado" },
  { id: "#10237", data: "27/12/2025 15:30", cliente: "Consumidor Final", pagto: "Dinheiro", valor: 12.00, status: "Cancelado" },
  { id: "#10238", data: "27/12/2025 16:00", cliente: "Empresa XYZ", pagto: "Boleto", valor: 1250.00, status: "Pendente" },
];

export default function RelatorioFaturamentoPage() {
  const [periodo, setPeriodo] = useState("Este Mês");
  const [isLoading, setIsLoading] = useState(false);

  // --- FUNÇÃO DE IMPRESSÃO ---
  const handlePrint = () => {
    window.print();
  };

  // --- FUNÇÃO DE EXPORTAR EXCEL (CSV) ---
  const handleExportExcel = () => {
    const headers = ["ID Venda;Data/Hora;Cliente;Pagamento;Valor;Status"];
    const rows = transacoesIniciais.map(t => {
      const valorFormatado = t.valor.toFixed(2).replace('.', ',');
      return `${t.id};${t.data};${t.cliente};${t.pagto};${valorFormatado};${t.status}`;
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "relatorio_faturamento.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFiltrar = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    // Adicionamos o ID 'printable-content' aqui para o CSS capturar
    <div id="printable-content" className="flex flex-col gap-6 animate-in fade-in duration-500 bg-gray-50 min-h-screen p-4 md:p-0">
      
      {/* ESTILOS DE IMPRESSÃO GLOBAIS */}
      <style jsx global>{`
        @media print {
          /* Esconde tudo na página por padrão */
          body * {
            visibility: hidden;
          }
          /* Torna visível apenas o conteúdo do relatório */
          #printable-content, #printable-content * {
            visibility: visible;
          }
          /* Posiciona o relatório no topo da página impressa */
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
            padding: 20px;
            margin: 0;
          }
          /* Remove sombras e bordas extras na impressão */
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          /* Garante que gráficos e tabelas não sejam cortados */
          .recharts-wrapper {
            margin: 0 auto;
          }
        }
      `}</style>

      {/* HEADER E AÇÕES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Relatórios de Faturamento
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Visão geral financeira e detalhamento de vendas.
          </p>
        </div>
        
        {/* Botões ocultos na impressão */}
        <div className="flex gap-2 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm active:scale-95 cursor-pointer"
          >
            <Printer size={16} /> Imprimir
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#00254d] transition-colors text-sm font-medium shadow-lg shadow-blue-100 active:scale-95 cursor-pointer"
          >
            <Download size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* BARRA DE FILTROS - oculta na impressão */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end md:items-center print:hidden">
        <div className="w-full md:w-auto flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Período</label>
            <div className="relative">
              <select 
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option>Hoje</option>
                <option>Ontem</option>
                <option>Esta Semana</option>
                <option>Este Mês</option>
                <option>Personalizado</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Pagamento</label>
            <div className="relative">
              <select className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer">
                <option>Todas as Formas</option>
                <option>Crédito</option>
                <option>Débito</option>
                <option>Dinheiro</option>
                <option>PIX</option>
              </select>
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
            <div className="relative">
              <select className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer">
                <option>Todos</option>
                <option>Aprovados</option>
                <option>Cancelados</option>
                <option>Pendentes</option>
              </select>
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <button 
            onClick={handleFiltrar}
            className="h-[38px] mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            {isLoading ? "Filtrando..." : <><Filter size={16} /> Filtrar</>}
          </button>
        </div>
      </div>

      {/* CARDS DE KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden print:shadow-none print:border-gray-300">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <DollarSign size={80} className="text-green-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Faturamento Total</p>
            <h3 className="text-3xl font-bold text-gray-800">R$ 48.250,00</h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full print:bg-transparent print:text-black">
              <ArrowUpRight size={12} /> +12.5% vs mês anterior
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden print:shadow-none print:border-gray-300">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <TrendingUp size={80} className="text-blue-600" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio</p>
            <h3 className="text-3xl font-bold text-gray-800">R$ 145,90</h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-full print:bg-transparent print:text-black">
              <ArrowUpRight size={12} /> +2.1% estabilidade
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden print:shadow-none print:border-gray-300">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <CreditCard size={80} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 mb-1">Qtd. Vendas</p>
            <h3 className="text-3xl font-bold text-gray-800">342</h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-bold text-red-500 bg-red-50 w-fit px-2 py-1 rounded-full print:bg-transparent print:text-black">
              <ArrowDownRight size={12} /> -0.5% vs mês anterior
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DO GRÁFICO */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" /> Evolução do Faturamento
        </h3>
        <div className="h-[300px] w-full print:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosGrafico}>
              <defs>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="nome" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number | undefined) => [`R$ ${value || 0}`, "Faturamento"]}
              />
              <Area 
                type="monotone" 
                dataKey="valor" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABELA DE TRANSAÇÕES */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none print:border-gray-200">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
          <h3 className="text-lg font-bold text-gray-800">Detalhamento de Transações</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por ID ou Cliente..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        
        {/* Adicionado 'print:overflow-visible' para a tabela não cortar na impressão */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider print:bg-gray-100">
              <tr>
                <th className="px-6 py-4">ID Venda</th>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transacoesIniciais.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/30 transition-colors text-sm cursor-default">
                  <td className="px-6 py-4 font-bold text-blue-600 print:text-black">{t.id}</td>
                  <td className="px-6 py-4 text-gray-600">{t.data}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{t.cliente}</td>
                  <td className="px-6 py-4 text-gray-600">{t.pagto}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                      ${t.status === 'Aprovado' ? 'bg-green-100 text-green-700' : ''}
                      ${t.status === 'Cancelado' ? 'bg-red-100 text-red-700' : ''}
                      ${t.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : ''}
                      print:bg-transparent print:text-black print:border print:border-gray-300
                    `}>
                      {t.status === 'Aprovado' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 print:hidden"></span>}
                      {t.status === 'Cancelado' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 print:hidden"></span>}
                      {t.status === 'Pendente' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 print:hidden"></span>}
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação oculta na impressão */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500 print:hidden">
          <span>Mostrando 5 de 142 registros</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600 font-bold border-blue-200 cursor-pointer">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 cursor-pointer">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 cursor-pointer">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 cursor-pointer">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}