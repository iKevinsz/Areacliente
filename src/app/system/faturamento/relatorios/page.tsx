"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar, Filter, Download, Printer, 
  Search, TrendingUp, CreditCard, DollarSign, 
  AlertCircle, ArrowUpRight, ArrowDownRight, ChevronRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// --- DADOS MOCKADOS ---
const dadosGrafico = [
  { nome: '01/12', valor: 4000 },
  { nome: '05/12', valor: 3000 },
  { nome: '10/12', valor: 2000 },
  { nome: '15/12', valor: 2780 },
  { nome: '20/12', valor: 1890 },
  { nome: '25/12', valor: 2390 },
  { nome: '30/12', valor: 3490 },
];

const transacoesIniciais = [
  { id: "#10234", data: "27/12/2025 14:30", cliente: "Consumidor Final", pagto: "Crédito", valor: 150.00, status: "Aprovado" },
  { id: "#10235", data: "27/12/2025 14:45", cliente: "João Silva", pagto: "PIX", valor: 320.50, status: "Aprovado" },
  { id: "#10236", data: "27/12/2025 15:10", cliente: "Maria Oliveira", pagto: "Débito", valor: 45.90, status: "Aprovado" },
  { id: "#10237", data: "27/12/2025 15:30", cliente: "Consumidor Final", pagto: "Dinheiro", valor: 12.00, status: "Cancelado" },
  { id: "#10238", data: "27/12/2025 16:00", cliente: "Empresa XYZ", pagto: "Boleto", valor: 1250.00, status: "Pendente" },
  { id: "#10239", data: "27/12/2025 16:15", cliente: "Carlos Souza", pagto: "Crédito", valor: 200.00, status: "Pendente" },
  { id: "#10240", data: "27/12/2025 16:30", cliente: "Ana Clara", pagto: "PIX", valor: 50.00, status: "Aprovado" },
];

export default function RelatorioFaturamentoPage() {
  const [inputPeriodo, setInputPeriodo] = useState("Este Mês");
  const [inputPagamento, setInputPagamento] = useState("Todas as Formas");
  const [inputStatus, setInputStatus] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    periodo: "Este Mês",
    pagamento: "Todas as Formas",
    status: "Todos"
  });

  const transacoesFiltradas = useMemo(() => {
    return transacoesIniciais.filter((t) => {
      const termoBusca = busca.toLowerCase();
      const matchBusca = t.id.toLowerCase().includes(termoBusca) || t.cliente.toLowerCase().includes(termoBusca);
      const matchPagto = filtrosAtivos.pagamento === "Todas as Formas" ? true : t.pagto === filtrosAtivos.pagamento;
      const matchStatus = filtrosAtivos.status === "Todos" ? true : t.status === filtrosAtivos.status;
      return matchBusca && matchPagto && matchStatus;
    });
  }, [busca, filtrosAtivos]);

  const handleFiltrar = () => {
    setIsLoading(true);
    setTimeout(() => {
      setFiltrosAtivos({ periodo: inputPeriodo, pagamento: inputPagamento, status: inputStatus });
      setIsLoading(false);
    }, 600);
  };

  const handlePrint = () => window.print();

  const formatMoney = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div id="printable-content" className="flex flex-col gap-6 animate-in fade-in duration-500 bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8">
      
      {/* HEADER E AÇÕES */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">
            Relatórios de Faturamento
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase font-bold tracking-tighter">
            Visão geral financeira e detalhamento de vendas
          </p>
        </div>
        
        <div className="flex gap-2 print:hidden w-full lg:w-auto">
          <button onClick={handlePrint} className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm active:scale-95">
            <Printer size={16} /> Imprimir
          </button>
          <button onClick={() => {}} className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-[#003366] text-white rounded-xl hover:bg-[#00254d] transition-colors text-sm font-bold shadow-lg shadow-blue-100 active:scale-95">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Período</label>
            <div className="relative"><select value={inputPeriodo} onChange={(e) => setInputPeriodo(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer"><option>Hoje</option><option>Este Mês</option></select><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /></div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pagamento</label>
            <div className="relative"><select value={inputPagamento} onChange={(e) => setInputPagamento(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer"><option>Todas as Formas</option><option>Crédito</option><option>PIX</option></select><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /></div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
            <div className="relative"><select value={inputStatus} onChange={(e) => setInputStatus(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer"><option>Todos</option><option>Aprovado</option><option>Cancelado</option></select><AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /></div>
          </div>
          <button onClick={handleFiltrar} disabled={isLoading} className="mt-auto h-[42px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
            {isLoading ? "..." : <><Filter size={16} /> FILTRAR</>}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Faturamento Total" value={48250.0} icon={<DollarSign size={24}/>} trend="+12.5%" color="text-green-600" bgColor="bg-green-50" />
        <KPICard title="Ticket Médio" value={145.90} icon={<TrendingUp size={24}/>} trend="+2.1%" color="text-blue-600" bgColor="bg-blue-50" />
        <KPICard title="Qtd. Vendas" value={transacoesFiltradas.length} icon={<CreditCard size={24}/>} trend="-0.5%" color="text-orange-600" bgColor="bg-orange-50" isMoney={false} />
      </div>

      {/* ÁREA DO GRÁFICO */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm print:shadow-none">
        <h3 className="text-sm md:text-base font-black text-gray-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" /> Evolução do Faturamento
        </h3>
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosGrafico}>
              <defs><linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
              <YAxis hide={true} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABELA / CARDS TRANSAÇÕES */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-tighter">Detalhamento</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none" />
          </div>
        </div>
        
        {/* LISTA MOBILE (CARDS) */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {transacoesFiltradas.map((t) => (
            <div key={t.id} className="p-4 active:bg-gray-50 transition-colors flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-blue-600">{t.id}</span>
                  <StatusBadge status={t.status} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm truncate">{t.cliente}</h4>
                <p className="text-[10px] text-gray-400 uppercase font-medium">{t.data} • {t.pagto}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-gray-800">{formatMoney(t.valor)}</p>
                <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>

        {/* TABELA DESKTOP */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b">
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
              {transacoesFiltradas.map((t) => (
                <tr key={t.id} className="hover:bg-blue-50/30 transition-colors text-sm">
                  <td className="px-6 py-4 font-bold text-blue-600">{t.id}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{t.data}</td>
                  <td className="px-6 py-4 font-bold text-gray-700">{t.cliente}</td>
                  <td className="px-6 py-4 text-gray-500">{t.pagto}</td>
                  <td className="px-6 py-4 font-black">{formatMoney(t.valor)}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTE KPI ---
const KPICard = ({ title, value, icon, trend, color, bgColor, isMoney = true }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex items-center justify-between">
    <div className="min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-xl md:text-2xl font-black text-gray-800 truncate">
        {isMoney ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value}
      </h3>
      <div className={`flex items-center gap-1 mt-1 text-[10px] font-black ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {trend} <span className="text-gray-300 font-medium tracking-tighter italic">vs anterior</span>
      </div>
    </div>
    <div className={`p-3 rounded-xl ${bgColor} ${color} shrink-0`}>{icon}</div>
  </div>
);

// --- SUBCOMPONENTE STATUS ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Aprovado: "bg-green-100 text-green-700",
    Cancelado: "bg-red-100 text-red-700",
    Pendente: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
};