'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, RefreshCw, FileText, CheckCircle2, 
  AlertCircle, ChevronRight, Clock, AlertTriangle, Check
} from 'lucide-react';

// --- TIPAGEM ---
type StatusSefaz = 'pendente' | 'autorizada' | 'erro';

interface PedidoNFe {
  id: string;
  cliente: string;
  documento: string;
  data: string;
  valor: number;
  status: StatusSefaz;
}

// Dados baseados na sua imagem
const MOCK_PEDIDOS: PedidoNFe[] = [
  { id: '#1020', cliente: 'Mercado Silva LTDA', documento: '12.345.678/0001-90', data: '27/12/2023', valor: 1450.00, status: 'pendente' },
  { id: '#1019', cliente: 'João da Silva', documento: '123.456.789-00', data: '26/12/2023', valor: 89.90, status: 'autorizada' },
  { id: '#1018', cliente: 'Padaria Central', documento: '98.765.432/0001-10', data: '25/12/2023', valor: 5000.00, status: 'erro' },
];

export default function EmissaoNfeList() {
  const [mounted, setMounted] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoNFe[]>(MOCK_PEDIDOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleUpdateSefaz = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 1500); // Simula atualização
  };

  const getStatusConfig = (status: StatusSefaz) => {
    const configs = {
      pendente: { color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", label: "Pendente", icon: <Clock size={14} /> },
      autorizada: { color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", label: "Autorizada", icon: <Check size={14} /> },
      erro: { color: "text-rose-700", bg: "bg-rose-100", border: "border-rose-200", label: "Erro", icon: <AlertTriangle size={14} /> },
    };
    return configs[status];
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const matchSearch = pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        pedido.documento.includes(searchTerm) || 
                        pedido.id.includes(searchTerm);
    const matchStatus = statusFilter === 'todos' || pedido.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // KPIs
  const countPendentes = pedidos.filter(p => p.status === 'pendente').length;
  const countAutorizadas = pedidos.filter(p => p.status === 'autorizada').length;
  const countErros = pedidos.filter(p => p.status === 'erro').length;

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-x-hidden pb-20">
      
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        
        {/* HEADER & AÇÃO PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Emissão de NFe</h1>
            <p className="text-sm text-slate-500 mt-1">Gerencie e emita notas fiscais dos seus pedidos.</p>
          </div>
          
          <button 
            onClick={handleUpdateSefaz}
            disabled={isUpdating}
            className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <RefreshCw size={16} className={`${isUpdating ? 'animate-spin text-blue-600' : 'text-slate-500'}`} /> 
            {isUpdating ? 'Atualizando...' : 'Atualizar Sefaz'}
          </button>
        </div>

        {/* CARDS DE RESUMO (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 print:hidden">
          {/* Card Pendentes */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-wider text-amber-600 mb-1">Pendentes</p>
              <h3 className="text-3xl font-black text-slate-800">{countPendentes}</h3>
            </div>
            <div className="relative z-10 p-3 bg-amber-100 text-amber-600 rounded-xl">
              <FileText size={24} />
            </div>
          </div>
          
          {/* Card Autorizadas */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-1">Autorizadas Hoje</p>
              <h3 className="text-3xl font-black text-slate-800">{countAutorizadas}</h3>
            </div>
            <div className="relative z-10 p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
          </div>

          {/* Card Com Erro */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-600 mb-1">Com Erro</p>
              <h3 className="text-3xl font-black text-slate-800">{countErros}</h3>
            </div>
            <div className="relative z-10 p-3 bg-rose-100 text-rose-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        {/* BARRA DE CONTROLES (BUSCA E TABS) */}
        <div className="bg-white p-2 md:p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between print:hidden">
          
          {/* Busca (Input esticado na esquerda) */}
          <div className="relative w-full md:w-96 shrink-0 px-1 md:px-0">
            <Search className="absolute left-4 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, CPF/CNPJ ou ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 md:border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 font-medium text-slate-700" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          {/* Tabs responsivas (Direita) */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 px-1 md:px-0">
            <div className="flex gap-2 w-max">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'pendente', label: 'Pendente' },
                { id: 'autorizada', label: 'Autorizada' },
                { id: 'erro', label: 'Erro' }
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

        {/* LISTAGEM DE PEDIDOS */}
        <div className="bg-transparent md:bg-white md:rounded-3xl md:shadow-sm md:border md:border-slate-200 overflow-hidden">
          
          {/* CABEÇALHO DA TABELA (Visível apenas em Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-2">Pedido</div>
            <div className="col-span-4">Cliente</div>
            <div className="col-span-2">Data</div>
            <div className="col-span-2">Valor</div>
            <div className="col-span-2 text-center">Status / Ação</div>
          </div>

          {/* CORPO DA LISTA */}
          <div className="flex flex-col gap-3 md:gap-0">
            {filteredPedidos.map((pedido, index) => {
              const status = getStatusConfig(pedido.status);
              
              return (
                <div 
                  key={pedido.id} 
                  className={`bg-white md:bg-transparent p-4 md:p-6 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-slate-200 md:border-none flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center cursor-pointer group transition-all hover:bg-slate-50/80 ${index !== filteredPedidos.length - 1 ? 'md:border-b md:border-slate-100' : ''}`}
                >
                  
                  {/* Linha Superior (Mobile) / Coluna 1 e 2 (Desktop) */}
                  <div className="flex justify-between items-start md:contents mb-3 md:mb-0">
                    <div className="md:col-span-2">
                      <span className="font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs md:text-sm border border-blue-100">
                        {pedido.id}
                      </span>
                    </div>
                    
                    {/* Badge visível no mobile no topo à direita */}
                    <div className="md:hidden">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 border ${status.bg} ${status.color} ${status.border}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Info do Cliente */}
                  <div className="md:col-span-4 flex flex-col min-w-0 mb-3 md:mb-0">
                    <p className="font-bold text-slate-800 text-sm md:text-base truncate group-hover:text-blue-600 transition-colors">
                      {pedido.cliente}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {pedido.documento}
                    </p>
                  </div>

                  {/* Informações Flex (Data e Valor) - Lado a lado no mobile */}
                  <div className="flex items-center justify-between md:contents pt-3 border-t border-slate-100 md:border-none md:pt-0">
                    <div className="md:col-span-2 flex flex-col md:block">
                      <span className="text-[10px] uppercase font-bold text-slate-400 md:hidden mb-0.5">Data</span>
                      <span className="text-sm font-medium text-slate-600">
                        {pedido.data}
                      </span>
                    </div>
                    
                    <div className="md:col-span-2 flex flex-col items-end md:items-start md:block">
                      <span className="text-[10px] uppercase font-bold text-slate-400 md:hidden mb-0.5">Valor</span>
                      <span className="text-sm md:text-base font-black text-slate-800">
                        {formatCurrency(pedido.valor)}
                      </span>
                    </div>
                  </div>

                  {/* Status Sefaz e Botão (Visível no final no Desktop) */}
                  <div className="hidden md:flex md:col-span-2 items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border ${status.bg} ${status.color} ${status.border}`}>
                      {status.icon} <span className="uppercase tracking-wide">{status.label}</span>
                    </span>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              );
            })}

            {filteredPedidos.length === 0 && (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Nenhuma nota encontrada</h3>
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