'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, CheckCircle2, XCircle, Clock, 
  ChevronRight, Calculator, FileText, FileSignature
} from 'lucide-react';

// --- TIPAGEM ---
type StatusOrcamento = 'pendente' | 'aprovado' | 'rejeitado';

interface Orcamento {
  id: string;
  cliente: string;
  emissao: string;
  validade: string;
  total: number;
  status: StatusOrcamento;
}

// Dados baseados na imagem fornecida
const MOCK_ORCAMENTOS: Orcamento[] = [
  { id: '#6', cliente: 'teste', emissao: '07/01/2026', validade: '14/01/2026', total: 0.00, status: 'pendente' },
  { id: '#1', cliente: 'Tech Solutions Ltda', emissao: '31/12/2025', validade: '15/01/2026', total: 4500.00, status: 'aprovado' },
  { id: '#2', cliente: 'João da Silva', emissao: '31/12/2025', validade: '07/01/2026', total: 3200.50, status: 'aprovado' },
  { id: '#3', cliente: 'Padaria Pão Dourado', emissao: '21/12/2025', validade: '28/12/2025', total: 850.00, status: 'rejeitado' },
  { id: '#4', cliente: 'Condomínio Jardins', emissao: '01/12/2025', validade: '16/12/2025', total: 12000.00, status: 'rejeitado' },
];

export default function OrcamentosPage() {
  const [mounted, setMounted] = useState(false);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(MOCK_ORCAMENTOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusConfig = (status: StatusOrcamento) => {
    const configs = {
      pendente: { color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", label: "Pendente", icon: <Clock size={14} /> },
      aprovado: { color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", label: "Aprovado", icon: <CheckCircle2 size={14} /> },
      rejeitado: { color: "text-rose-700", bg: "bg-rose-100", border: "border-rose-200", label: "Rejeitado", icon: <XCircle size={14} /> },
    };
    return configs[status];
  };

  const filteredOrcamentos = orcamentos.filter(orc => {
    const matchSearch = orc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        orc.id.includes(searchTerm);
    const matchStatus = statusFilter === 'todos' || orc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Cálculos para os KPIs
  const totalEmAberto = orcamentos.filter(o => o.status === 'pendente').reduce((acc, curr) => acc + curr.total, 0);
  const countPendentes = orcamentos.filter(o => o.status === 'pendente').length;
  const countAprovados = orcamentos.filter(o => o.status === 'aprovado').length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-x-hidden pb-20">
      
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        
        {/* HEADER & AÇÃO PRINCIPAL */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Orçamentos</h1>
            <p className="text-sm text-slate-500 mt-1">Gerencie cotações e propostas comerciais.</p>
          </div>
          
          <button 
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-200 active:scale-95 cursor-pointer"
          >
            <Plus size={18} /> Novo Orçamento
          </button>
        </div>

        {/* CARDS DE RESUMO (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 print:hidden">
          {/* KPI 1: Em Aberto */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-amber-600 mb-1">Em Aberto (R$)</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 truncate">{formatCurrency(totalEmAberto)}</h3>
            </div>
            <div className="relative z-10 p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
              <Calculator size={24} />
            </div>
          </div>
          
          {/* KPI 2: Propostas Pendentes */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-blue-600 mb-1">Propostas Pendentes</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 truncate">{countPendentes}</h3>
            </div>
            <div className="relative z-10 p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
              <FileSignature size={24} />
            </div>
          </div>

          {/* KPI 3: Aprovados Hoje */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-1">Aprovados Hoje</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 truncate">{countAprovados}</h3>
            </div>
            <div className="relative z-10 p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* BARRA DE CONTROLES (BUSCA E TABS) */}
        <div className="bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-3 items-center justify-between print:hidden">
          
          {/* Busca */}
          <div className="relative w-full lg:w-96 shrink-0 px-1 md:px-0">
            <Search className="absolute left-4 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente ou nº do orçamento..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 lg:border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 font-medium text-slate-700" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          {/* Tabs Responsivas */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 px-1 md:px-0">
            <div className="flex gap-2 w-max">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'pendente', label: 'Pendente' },
                { id: 'aprovado', label: 'Aprovado' },
                { id: 'rejeitado', label: 'Rejeitado' }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setStatusFilter(tab.id)} 
                  className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === tab.id 
                      ? 'bg-slate-800 text-white shadow-md' 
                      : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTAGEM DE ORÇAMENTOS */}
        <div className="bg-transparent md:bg-white md:rounded-3xl md:shadow-sm md:border md:border-slate-200 overflow-hidden">
          
          {/* CABEÇALHO DA TABELA (Visível apenas Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-1">Nº</div>
            <div className="col-span-4">Cliente</div>
            <div className="col-span-3">Emissão / Validade</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* CORPO DA LISTA */}
          <div className="flex flex-col gap-3 md:gap-0">
            {filteredOrcamentos.map((orcamento, index) => {
              const status = getStatusConfig(orcamento.status);
              
              return (
                <div 
                  key={orcamento.id} 
                  className={`bg-white md:bg-transparent p-4 md:p-6 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-slate-200 md:border-none flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center cursor-pointer group transition-all hover:bg-slate-50/80 ${index !== filteredOrcamentos.length - 1 ? 'md:border-b md:border-slate-100' : ''}`}
                >
                  
                  {/* Linha Superior (Mobile) / Coluna 1 e 2 (Desktop) */}
                  <div className="flex justify-between items-center md:contents mb-3 md:mb-0">
                    
                    <div className="md:col-span-5 flex items-center gap-3 min-w-0 flex-1">
                      {/* Número no mobile fica discreto, no desktop tem sua coluna */}
                      <span className="hidden md:block md:col-span-1 font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm border border-blue-100 shrink-0">
                        {orcamento.id}
                      </span>
                      
                      <div className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm text-white shadow-inner bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0">
                        {getInitials(orcamento.cliente)}
                      </div>
                      
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="md:hidden flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shrink-0">{orcamento.id}</span>
                        </div>
                        <p className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-blue-600 transition-colors">
                          {orcamento.cliente}
                        </p>
                      </div>
                    </div>
                    
                    {/* Badge visível no mobile no topo à direita */}
                    <div className="md:hidden shrink-0">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 border ${status.bg} ${status.color} ${status.border}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Informações Flex (Datas e Valor) */}
                  <div className="flex items-center justify-between md:contents pt-3 border-t border-slate-100 md:border-none md:pt-0">
                    
                    <div className="md:col-span-3 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 md:hidden mb-0.5">Emissão / Validade</span>
                      <span className="text-sm font-bold text-slate-700">
                        {orcamento.emissao}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        Até {orcamento.validade}
                      </span>
                    </div>
                    
                    <div className="md:col-span-2 flex flex-col items-end md:items-start md:justify-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 md:hidden mb-0.5">Total</span>
                      <span className="text-base md:text-lg font-black text-slate-800">
                        {formatCurrency(orcamento.total)}
                      </span>
                    </div>
                  </div>

                  {/* Status e Botão (Desktop) */}
                  <div className="hidden md:flex md:col-span-2 items-center justify-between">
                    <span className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border ${status.bg} ${status.color} ${status.border}`}>
                      {status.icon} <span className="uppercase tracking-wide">{status.label}</span>
                    </span>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              );
            })}

            {filteredOrcamentos.length === 0 && (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Nenhum orçamento encontrado</h3>
                <p className="text-sm text-slate-500">Altere o filtro ou o termo de busca para encontrar o que procura.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}