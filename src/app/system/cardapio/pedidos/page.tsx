'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingBag, Bike, Store, 
  Clock, CheckCircle, XCircle, Printer, X, 
  MapPin, Phone, AlertTriangle, Check, ChefHat
} from 'lucide-react';

// --- TIPAGEM ---
type StatusPedido = 'pendente' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
type TipoEntrega = 'delivery' | 'retirada';

interface ItemPedido {
  qtd: number;
  nome: string;
  preco: number;
  obs?: string;
}

interface Venda {
  id: string;
  cliente: string;
  telefone: string;
  endereco?: string;
  data: string;
  tipo: TipoEntrega;
  status: StatusPedido;
  itens: ItemPedido[];
  total: number;
  formaPagamento: string;
  motivoCancelamento?: string;
}

const MOCK_VENDAS: Venda[] = [
  { 
    id: '#5025', cliente: 'Kevin Rodrigo', telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123 - Centro', data: '2025-12-27T14:30:00', 
    tipo: 'delivery', status: 'pendente', total: 85.90, formaPagamento: 'Pix',
    itens: [{ qtd: 2, nome: 'X-Bacon Artesanal', preco: 28.0, obs: 'Sem cebola' }, { qtd: 1, nome: 'Batata Frita G', preco: 15.9 }]
  },
  { 
    id: '#5024', cliente: 'Ana Souza de Albuquerque Marques', telefone: '(11) 98888-8888',
    data: '2025-12-27T14:15:00', tipo: 'retirada', status: 'preparando', total: 45.00, formaPagamento: 'Cartão Crédito',
    itens: [{ qtd: 1, nome: 'Pizza Calabresa Média com Borda Recheada', preco: 45.0 }]
  },
  { 
    id: '#5023', cliente: 'Marcos Paulo', telefone: '(11) 97777-6666',
    endereco: 'Av. Brasil, 450 - Apt 12, Bloco C', data: '2025-12-27T13:45:00', 
    tipo: 'delivery', status: 'saiu_entrega', total: 62.50, formaPagamento: 'Dinheiro',
    itens: [{ qtd: 1, nome: 'Combo Burger + Refri', preco: 52.0 }, { qtd: 1, nome: 'Pudim', preco: 10.5 }]
  },
  { 
    id: '#5022', cliente: 'Juliana Leme', telefone: '(11) 95555-4444',
    data: '2025-12-27T13:30:00', tipo: 'retirada', status: 'entregue', total: 30.00, formaPagamento: 'Pix',
    itens: [{ qtd: 1, nome: 'Açaí 500ml', preco: 30.0, obs: 'Com granola' }]
  }
];

export default function VendasCardapioPage() {
  const [mounted, setMounted] = useState(false);
  const [vendas, setVendas] = useState<Venda[]>(MOCK_VENDAS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => { if (typeof window !== 'undefined') window.print(); };

  const atualizarStatus = (id: string, novoStatus: StatusPedido, motivo?: string) => {
    setVendas(prev => prev.map(v => v.id === id ? { ...v, status: novoStatus, motivoCancelamento: motivo } : v));
    setSelectedVenda(null);
  };

  const filteredVendas = vendas.filter(venda => {
    const matchSearch = venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || venda.id.includes(searchTerm);
    const matchStatus = statusFilter === 'todos' || venda.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalHoje = vendas.filter(v => v.status !== 'cancelado').reduce((acc, curr) => acc + curr.total, 0);
  const pendentes = vendas.filter(v => v.status === 'pendente').length;

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  
  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusConfig = (status: StatusPedido) => {
    const configs = {
      pendente: { color: "text-amber-700", bg: "bg-amber-100", label: "Pendente", icon: <Clock size={10} className="md:w-3 md:h-3" /> },
      preparando: { color: "text-blue-700", bg: "bg-blue-100", label: "Preparando", icon: <ChefHat size={10} className="md:w-3 md:h-3" /> },
      saiu_entrega: { color: "text-orange-700", bg: "bg-orange-100", label: "Saiu p/ Entrega", icon: <Bike size={10} className="md:w-3 md:h-3" /> },
      entregue: { color: "text-emerald-700", bg: "bg-emerald-100", label: "Entregue", icon: <Check size={10} className="md:w-3 md:h-3" /> },
      cancelado: { color: "text-red-700", bg: "bg-red-100", label: "Cancelado", icon: <XCircle size={10} className="md:w-3 md:h-3" /> },
    };
    return configs[status] || configs.pendente;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
      
      <div className="w-full max-w-7xl mx-auto p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        
        {/* HEADER & KPIS */}
        <div className="space-y-3 md:space-y-6 print:hidden">
          <div>
              <h2 className="text-[10px] md:text-sm font-semibold text-blue-600 tracking-wider uppercase mb-0.5 md:mb-1">Cardápio Digital</h2>
              <h1 className="text-xl md:text-3xl font-extrabold text-slate-900">Painel de Vendas</h1>
          </div>

          {/* Cards de KPI mais compactos no mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4">
            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 md:w-24 md:h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 mb-0.5 md:mb-1">Total Hoje</p>
                  <h3 className="text-xl md:text-3xl font-black text-slate-800 truncate">{formatCurrency(totalHoje)}</h3>
                </div>
                <div className="relative z-10 p-2 md:p-3 bg-emerald-100 text-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag size={18} className="md:w-6 md:h-6"/>
                </div>
            </div>
            
            <div className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 md:w-24 md:h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 mb-0.5 md:mb-1">Novos Pedidos</p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <h3 className="text-xl md:text-3xl font-black text-amber-600 truncate">{pendentes}</h3>
                    {pendentes > 0 && <span className="relative flex h-2 w-2 md:h-3 md:w-3 mb-1.5 md:mb-3 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-full w-full bg-amber-500"></span></span>}
                  </div>
                </div>
                <div className="relative z-10 p-2 md:p-3 bg-amber-100 text-amber-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={18} className="md:w-6 md:h-6"/>
                </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE CONTROLES (BUSCA E TABS) */}
        <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-2.5 md:gap-3 print:hidden">
          
          <div className="flex-1 min-w-0">
            <div className="overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              <div className="flex gap-1.5 md:gap-2 w-max px-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'pendente', label: 'Pendentes' },
                  { id: 'preparando', label: 'Preparando' },
                  { id: 'saiu_entrega', label: 'Saiu p/ Entrega' },
                  { id: 'entregue', label: 'Entregues' }
                ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setStatusFilter(tab.id)} 
                    className={`px-3 md:px-4 py-1.5 md:py-2 text-[11px] md:text-sm font-semibold rounded-lg md:rounded-xl transition-all whitespace-nowrap shrink-0 ${
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

          <div className="w-full lg:w-80 shrink-0 relative px-1 lg:px-0">
            <Search className="absolute left-3.5 lg:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente ou pedido..." 
              className="w-full pl-9 pr-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 lg:border-none rounded-lg md:rounded-xl text-xs md:text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 font-medium text-slate-700" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {/* LISTAGEM DE PEDIDOS (CARDS COMPACTOS) */}
        <div className="flex flex-col gap-2.5 md:gap-4 pb-20">
          {filteredVendas.map((venda) => {
            const status = getStatusConfig(venda.status);
            
            return (
              <div 
                key={venda.id} 
                onClick={() => setSelectedVenda(venda)} 
                /* Card mais enxuto no mobile (p-3 e rounded-xl) */
                className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 w-full"
              >
                
                {/* LADO ESQUERDO: Avatar + Textos */}
                <div className="flex items-center gap-2.5 md:gap-4 flex-1 min-w-0">
                  {/* Avatar menor no mobile (w-8 h-8) */}
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[10px] md:text-sm text-white shadow-inner bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0">
                    {getInitials(venda.cliente)}
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                      <span className="text-[9px] md:text-xs font-black text-slate-600 bg-slate-100 px-1.5 md:px-2 py-0.5 rounded md:rounded-md shrink-0">{venda.id}</span>
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0 truncate">
                        {venda.tipo === 'delivery' ? <Bike size={10} className="md:w-3 md:h-3"/> : <Store size={10} className="md:w-3 md:h-3"/>} 
                        {venda.tipo}
                      </span>
                    </div>
                    {/* Nome do cliente ligeiramente menor no mobile */}
                    <h4 className="font-bold text-slate-800 text-[13px] md:text-lg truncate pr-2">
                      {venda.cliente}
                    </h4>
                  </div>
                </div>

                {/* LADO DIREITO (Status e Preço) */}
                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto shrink-0 border-t border-slate-100 md:border-none pt-2.5 md:pt-0">
                  
                  <span className={`px-2 py-1 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold flex items-center gap-1 md:gap-1.5 shrink-0 ${status.bg} ${status.color}`}>
                    {status.icon} {status.label}
                  </span>

                  <div className="text-right flex flex-col justify-center shrink-0">
                    <span className="font-black text-slate-800 text-sm md:text-xl leading-none">
                      {formatCurrency(venda.total)}
                    </span>
                    <span className="flex items-center justify-end gap-1 mt-1 text-slate-400 text-[9px] md:text-xs font-medium leading-none">
                      <Clock size={10} className="md:w-3 md:h-3" /> {venda.data.split('T')[1].substring(0,5)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}

          {filteredVendas.length === 0 && (
            <div className="text-center py-12 md:py-16 bg-white rounded-2xl md:rounded-3xl border border-dashed border-slate-300">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Search className="text-slate-400 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-slate-700 mb-1">Nenhum pedido encontrado</h3>
              <p className="text-[11px] md:text-xs text-slate-500 px-4">Tente ajustar seus filtros ou termo de busca.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL RESPONSIVO (Também otimizado para não gastar muito espaço no mobile) */}
      {selectedVenda && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
            
            <div className="p-3 md:p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-blue-600 md:w-5 md:h-5"/>
                </div>
                <div className="min-w-0">
                  <h2 className="font-extrabold text-slate-800 text-sm md:text-lg truncate">Pedido {selectedVenda.id}</h2>
                  <p className="text-[9px] md:text-[11px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                    {selectedVenda.tipo === 'delivery' ? <Bike size={10} className="md:w-3 md:h-3" /> : <Store size={10} className="md:w-3 md:h-3" />}
                    {selectedVenda.tipo}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedVenda(null)} className="p-1.5 md:p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors shrink-0">
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            <div className="p-3.5 md:p-6 overflow-y-auto space-y-4 md:space-y-6 flex-1 bg-slate-50/50">
              <div className="bg-white p-3.5 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 space-y-2">
                <div className="flex items-center gap-2.5 md:gap-3 mb-2.5 md:mb-3 pb-2.5 md:pb-3 border-b border-slate-50">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-[11px] md:text-sm text-white bg-gradient-to-br from-blue-500 to-indigo-600">
                    {getInitials(selectedVenda.cliente)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-[13px] md:text-base truncate">{selectedVenda.cliente}</h3>
                    <p className="text-[11px] md:text-xs text-slate-500 font-medium truncate">{selectedVenda.telefone}</p>
                  </div>
                </div>
                {selectedVenda.endereco && (
                  <div className="flex items-start gap-1.5 md:gap-2 text-slate-600 text-[11px] md:text-sm bg-slate-50 p-2.5 md:p-3 rounded-lg md:rounded-xl">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-blue-500 md:w-4 md:h-4"/> 
                    <span className="leading-snug font-medium break-words">{selectedVenda.endereco}</span>
                  </div>
                )}
              </div>

              <div className="bg-white p-3.5 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mb-3 md:mb-4 tracking-widest flex items-center gap-1.5">
                  <ChefHat size={12} className="md:w-3.5 md:h-3.5"/> Resumo do Pedido
                </p>
                <div className="space-y-3 md:space-y-4">
                  {selectedVenda.itens.map((item, i) => (
                    <div key={i} className="flex justify-between items-start text-xs md:text-sm gap-2.5 md:gap-3">
                      <div className="flex gap-2.5 md:gap-3 min-w-0 flex-1">
                        <span className="font-black text-blue-600 shrink-0 bg-blue-50 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-md md:rounded-lg text-[10px] md:text-xs border border-blue-100">
                          {item.qtd}x
                        </span>
                        <div className="min-w-0 flex flex-col pt-0.5 flex-1">
                          <p className="font-bold text-slate-800 break-words leading-tight">{item.nome}</p>
                          {item.obs && <p className="text-amber-600 text-[10px] md:text-[11px] font-medium leading-tight mt-1 bg-amber-50 p-1 md:p-1.5 rounded-md border border-amber-100 flex items-start gap-1"><AlertTriangle size={10} className="shrink-0 mt-0.5 md:w-3 md:h-3"/> {item.obs}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 pt-0.5">
                        {formatCurrency(item.preco * item.qtd)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 shrink-0 bg-slate-800 text-white p-3.5 md:p-5 rounded-xl md:rounded-2xl shadow-lg">
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] text-slate-300 uppercase font-bold mb-0.5 md:mb-1 opacity-80">Pagamento</p>
                  <p className="text-xs md:text-sm font-bold truncate uppercase">{selectedVenda.formaPagamento}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] md:text-[10px] text-slate-300 uppercase font-bold mb-0.5 md:mb-1 opacity-80">Valor Total</p>
                  <p className="text-lg md:text-2xl font-black text-emerald-400 leading-none">
                    {formatCurrency(selectedVenda.total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 md:p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="flex flex-col-reverse sm:flex-row gap-2.5 md:gap-3">
                <button 
                  onClick={handlePrint} 
                  className="w-full sm:w-auto py-3 md:py-3.5 border-2 border-slate-200 bg-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 text-slate-700"
                >
                  <Printer size={16} className="md:w-[18px] md:h-[18px]"/> Imprimir
                </button>
                
                {selectedVenda.status === 'pendente' && (
                  <button onClick={() => atualizarStatus(selectedVenda.id, 'preparando')} className="w-full flex-1 py-3 md:py-3.5 bg-blue-600 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    <CheckCircle size={16} className="md:w-[18px] md:h-[18px]"/> Aceitar Pedido
                  </button>
                )}
                
                {selectedVenda.status === 'preparando' && (
                  <button onClick={() => atualizarStatus(selectedVenda.id, selectedVenda.tipo === 'delivery' ? 'saiu_entrega' : 'entregue')} className="w-full flex-1 py-3 md:py-3.5 bg-orange-500 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                    {selectedVenda.tipo === 'delivery' ? <Bike size={16} className="md:w-[18px] md:h-[18px]"/> : <Store size={16} className="md:w-[18px] md:h-[18px]"/>} Despachar
                  </button>
                )}
                
                {selectedVenda.status === 'saiu_entrega' && (
                  <button onClick={() => atualizarStatus(selectedVenda.id, 'entregue')} className="w-full flex-1 py-3 md:py-3.5 bg-emerald-500 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                    <Check size={16} className="md:w-[18px] md:h-[18px]"/> Finalizar
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
} 