'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, ShoppingBag, Bike, Store, 
  Clock, CheckCircle, XCircle, Eye, Printer, X, 
  ChefHat, MapPin, Phone, AlertTriangle
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
    id: '#5024', cliente: 'Ana Souza', telefone: '(11) 98888-8888',
    data: '2025-12-27T14:15:00', tipo: 'retirada', status: 'preparando', total: 45.00, formaPagamento: 'Cartão Crédito',
    itens: [{ qtd: 1, nome: 'Pizza Calabresa M', preco: 45.0 }]
  },
  { 
    id: '#5023', cliente: 'Marcos Paulo', telefone: '(11) 97777-6666',
    endereco: 'Av. Brasil, 450 - Apt 12', data: '2025-12-27T13:45:00', 
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
    const vendaDate = venda.data.split('T')[0];
    let matchDate = true;
    if (startDate) matchDate = matchDate && vendaDate >= startDate;
    if (endDate) matchDate = matchDate && vendaDate <= endDate;
    return matchSearch && matchStatus && matchDate;
  });

  const totalHoje = vendas.filter(v => v.status !== 'cancelado').reduce((acc, curr) => acc + curr.total, 0);
  const pendentes = vendas.filter(v => v.status === 'pendente').length;

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  
  const formatDate = (iso: string) => {
    if (!mounted) return ""; 
    const d = new Date(iso);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  };

  const getStatusBadge = (status: StatusPedido) => {
    const badges = {
      pendente: "bg-yellow-100 text-yellow-700",
      preparando: "bg-blue-100 text-blue-700",
      saiu_entrega: "bg-orange-100 text-orange-700",
      entregue: "bg-green-100 text-green-700",
      cancelado: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-bold flex items-center gap-1 shrink-0 ${badges[status]}`}>
        {status === 'saiu_entrega' ? 'Saiu p/ Entrega' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 space-y-4">
      {/* HEADER */}
      <div className="print:hidden">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-tighter">Cardápio Digital</h2>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Painel de Vendas</h1>
      </div>

      {/* KPIS (Total Hoje e Novos) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 print:hidden">
        <div className="bg-white p-3 md:p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-gray-400 truncate">Total Hoje</p>
              <h3 className="text-base md:text-2xl font-bold truncate">{formatCurrency(totalHoje)}</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-full hidden sm:block">
              <ShoppingBag size={20}/>
            </div>
        </div>
        <div className="bg-white p-3 md:p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400">Novos</p>
              <h3 className="text-base md:text-2xl font-bold text-yellow-600">{pendentes}</h3>
            </div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-full animate-pulse hidden sm:block">
              <Clock size={20}/>
            </div>
        </div>
      </div>

      {/* FILTROS - Busca à direita */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col-reverse md:flex-row-reverse gap-3 items-center justify-between">
          {/* Busca à Direita */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          {/* Tabs à Esquerda */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 border-b md:border-none pb-2 md:pb-0 w-full md:w-auto">
            {['todos', 'pendente', 'preparando', 'saiu_entrega', 'entregue'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setStatusFilter(tab)} 
                className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${statusFilter === tab ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent'}`}
              >
                {tab === 'saiu_entrega' ? 'SAIU P/ ENTREGA' : tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="space-y-3">
        {filteredVendas.map((venda) => (
          <div 
            key={venda.id} 
            onClick={() => setSelectedVenda(venda)} 
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-blue-600">{venda.id}</span>
              {getStatusBadge(venda.status)}
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{venda.cliente}</h4>
            <div className="flex justify-between items-center text-[11px] text-gray-500">
              <span className="truncate">{venda.tipo.toUpperCase()} • {formatCurrency(venda.total)}</span>
              <span>{venda.data.split('T')[1].substring(0,5)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CENTRALIZADO */}
      {selectedVenda && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg"><ShoppingBag size={20}/></div>
                <div className="min-w-0">
                  <h2 className="font-bold text-gray-800 text-sm md:text-base truncate">Pedido {selectedVenda.id}</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{selectedVenda.tipo}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVenda(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-800">{selectedVenda.cliente}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 font-medium"><Phone size={14}/> {selectedVenda.telefone}</p>
                {selectedVenda.endereco && <p className="text-sm text-gray-500 flex items-start gap-1"><MapPin size={14} className="mt-1 shrink-0"/> {selectedVenda.endereco}</p>}
              </div>

              <div className="border-t pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Resumo do Pedido</p>
                <div className="space-y-3">
                  {selectedVenda.itens.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm gap-2">
                      <div className="flex gap-2 min-w-0">
                        <span className="font-bold text-blue-600 shrink-0">{item.qtd}x</span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{item.nome}</p>
                          {item.obs && <p className="text-red-500 text-[11px] italic leading-tight">Obs: {item.obs}</p>}
                        </div>
                      </div>
                      <span className="font-bold text-gray-600 shrink-0">{formatCurrency(item.preco * item.qtd)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dashed pt-4 flex justify-between items-end gap-2 shrink-0">
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Pagamento</p>
                  <p className="text-sm font-bold text-gray-700 truncate uppercase">{selectedVenda.formaPagamento}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Total</p>
                  <p className="text-xl font-black text-gray-900 leading-none">{formatCurrency(selectedVenda.total)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t shrink-0 rounded-b-2xl">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex-1 py-3 border bg-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:bg-gray-100 transition-colors">
                        <Printer size={16}/> Imprimir
                    </button>
                    {selectedVenda.status === 'pendente' && (
                        <button onClick={() => atualizarStatus(selectedVenda.id, 'preparando')} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors">
                            Aceitar Pedido
                        </button>
                    )}
                    {selectedVenda.status === 'preparando' && (
                        <button onClick={() => atualizarStatus(selectedVenda.id, selectedVenda.tipo === 'delivery' ? 'saiu_entrega' : 'entregue')} className="flex-[2] py-3 bg-orange-600 text-white rounded-xl text-sm font-bold active:bg-orange-700 transition-colors">
                            Pronto / Despachar
                        </button>
                    )}
                    {selectedVenda.status === 'saiu_entrega' && (
                        <button onClick={() => atualizarStatus(selectedVenda.id, 'entregue')} className="flex-[2] py-3 bg-green-600 text-white rounded-xl text-sm font-bold active:bg-green-700 transition-colors">
                            Finalizar
                        </button>
                    )}
                </div>
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