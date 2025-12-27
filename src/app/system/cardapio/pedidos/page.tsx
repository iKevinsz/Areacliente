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
  },
  { 
    id: '#5021', cliente: 'Ricardo Silva', telefone: '(11) 91111-2222',
    data: '2025-12-27T12:00:00', tipo: 'delivery', status: 'cancelado', total: 120.00, 
    formaPagamento: 'Cartão Débito', motivoCancelamento: 'Cliente desistiu da compra',
    itens: [{ qtd: 3, nome: 'Marmitex Executiva', preco: 40.0 }]
  },
  { 
    id: '#5020', cliente: 'Beatriz Costa', telefone: '(11) 92222-3333',
    endereco: 'Rua Augusta, 900', data: '2025-12-27T11:45:00', 
    tipo: 'delivery', status: 'pendente', total: 55.00, formaPagamento: 'Pix',
    itens: [{ qtd: 1, nome: 'Temaki Salmão G', preco: 35.0 }, { qtd: 1, nome: 'Hot Roll 10un', preco: 20.0 }]
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
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrint = () => { if (typeof window !== 'undefined') window.print(); };

  const atualizarStatus = (id: string, novoStatus: StatusPedido, motivo?: string) => {
    setVendas(prev => prev.map(v => v.id === id ? { ...v, status: novoStatus, motivoCancelamento: motivo } : v));
    setSelectedVenda(null);
    setIsCancelling(false);
    setCancelReason('');
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
    switch (status) {
      case 'pendente': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pendente</span>;
      case 'preparando': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1"><ChefHat size={12}/> Preparando</span>;
      case 'saiu_entrega': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold flex items-center gap-1"><Bike size={12}/> Em Entrega</span>;
      case 'entregue': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Entregue</span>;
      case 'cancelado': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Cancelado</span>;
      default: return null;
    }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50 p-6">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="print:hidden">
          <h2 className="text-sm font-medium text-gray-400">Cardápio Digital</h2>
          <h1 className="text-2xl font-bold text-gray-800">Painel de Vendas</h1>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div><p className="text-xs font-bold uppercase text-gray-400">Total Hoje</p><h3 className="text-2xl font-bold" suppressHydrationWarning>{formatCurrency(totalHoje)}</h3></div>
            <div className="p-3 bg-green-50 text-green-600 rounded-full"><ShoppingBag size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div><p className="text-xs font-bold uppercase text-gray-400">Novos Pedidos</p><h3 className="text-2xl font-bold text-yellow-600">{pendentes}</h3></div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full animate-pulse"><Clock size={24}/></div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Buscar cliente ou ID..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
                <Calendar size={14} className="text-gray-400"/>
                <input type="date" className="bg-white border text-xs rounded px-2 py-1.5 cursor-pointer outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span className="text-gray-400 text-xs">até</span>
                <input type="date" className="bg-white border text-xs rounded px-2 py-1.5 cursor-pointer outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
        </div>

        <div className="flex overflow-x-auto pb-1 gap-2 border-b">
            {['todos', 'pendente', 'preparando', 'saiu_entrega', 'entregue', 'cancelado'].map((tab) => (
                <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${statusFilter === tab ? 'text-blue-600 border-blue-600 bg-blue-50/50' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
                  {tab === 'todos' ? 'Todos' : tab === 'saiu_entrega' ? 'Em Entrega' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pedido / Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedVenda(venda)}>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800">{venda.id}</p>
                        <p className="text-sm text-gray-500">{venda.cliente}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500" suppressHydrationWarning>{formatDate(venda.data)}</td>
                      <td className="px-6 py-4 flex justify-center">{getStatusBadge(venda.status)}</td>
                      <td className="px-6 py-4 text-right"><Eye size={18} className="text-gray-400 inline"/></td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL / CUPOM DE IMPRESSÃO */}
      {selectedVenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:static print:bg-white">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 print:shadow-none print:max-w-full print:rounded-none">
                
                {/* Header Modal */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center print:hidden">
                    <div><h2 className="text-lg font-bold">Pedido {selectedVenda.id}</h2><p className="text-xs text-gray-400" suppressHydrationWarning>{formatDate(selectedVenda.data)}</p></div>
                    <button onClick={() => {setSelectedVenda(null); setIsCancelling(false);}} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={24} /></button>
                </div>

                {/* Conteúdo do Pedido */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] print:max-h-full print:p-0">
                    <div className="hidden print:block text-center border-b pb-4 mb-4">
                        <h2 className="text-xl font-bold uppercase">Cupom de Pedido</h2>
                        <p className="text-sm">Datacaixa Tecnologia</p>
                        <p className="text-xs" suppressHydrationWarning>{formatDate(selectedVenda.data)}</p>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border print:hidden">
                        <div><p className="text-[10px] font-bold text-gray-400 uppercase">Status</p><div>{getStatusBadge(selectedVenda.status)}</div></div>
                        <div className="text-right"><p className="text-[10px] font-bold text-gray-400 uppercase">Tipo</p><span className="text-sm font-bold flex items-center gap-1">{selectedVenda.tipo === 'delivery' ? <Bike size={14}/> : <Store size={14}/>} {selectedVenda.tipo.toUpperCase()}</span></div>
                    </div>

                    <div className="text-sm space-y-1">
                        <p className="font-bold text-gray-800 text-base">{selectedVenda.cliente}</p>
                        <p className="text-gray-600 flex items-center gap-1 font-medium"><Phone size={12}/> {selectedVenda.telefone}</p>
                        {selectedVenda.tipo === 'delivery' && <p className="text-gray-500 flex items-start gap-1"><MapPin size={12} className="mt-1 shrink-0"/> {selectedVenda.endereco}</p>}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Resumo do Pedido</p>
                        <ul className="space-y-3">
                            {selectedVenda.itens.map((item, i) => (
                                <li key={i} className="flex justify-between text-sm">
                                    <div className="flex gap-2">
                                      <span className="font-bold text-blue-600">{item.qtd}x</span>
                                      <div><p className="font-medium text-gray-800">{item.nome}</p>{item.obs && <span className="text-red-500 italic text-xs">Obs: {item.obs}</span>}</div>
                                    </div>
                                    <span className="font-bold text-gray-700" suppressHydrationWarning>{formatCurrency(item.preco * item.qtd)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t border-dashed pt-4 flex justify-between font-bold text-xl text-gray-900">
                      <span className="text-sm text-gray-400 font-normal self-end">Pagamento: {selectedVenda.formaPagamento}</span>
                      <div className="text-right"><p className="text-xs font-normal text-gray-400">Total</p><span suppressHydrationWarning>{formatCurrency(selectedVenda.total)}</span></div>
                    </div>

                    {selectedVenda.status === 'cancelado' && selectedVenda.motivoCancelamento && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex gap-2 print:border-black">
                        <AlertTriangle size={16} className="text-red-600 shrink-0 print:hidden"/>
                        <div><p className="text-xs font-bold text-red-600 uppercase">Motivo do Cancelamento</p><p className="text-sm text-red-700">{selectedVenda.motivoCancelamento}</p></div>
                      </div>
                    )}

                    {isCancelling && (
                      <div className="bg-gray-50 p-4 rounded-xl border-2 border-red-100 animate-in slide-in-from-top-2 print:hidden">
                        <label className="text-xs font-bold text-gray-600 block mb-2">JUSTIFICATIVA</label>
                        <textarea className="w-full p-3 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-red-200" rows={2} placeholder="Motivo..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => atualizarStatus(selectedVenda.id, 'cancelado', cancelReason)} disabled={!cancelReason} className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg cursor-pointer">Confirmar</button>
                          <button onClick={() => setIsCancelling(false)} className="px-4 py-2 text-xs font-bold text-gray-500 cursor-pointer">Desistir</button>
                        </div>
                      </div>
                    )}
                </div>

                {/* Ações Modal */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-2 print:hidden">
                    <button onClick={handlePrint} className="flex-1 min-w-[120px] py-2 border bg-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50"><Printer size={16}/> Imprimir</button>
                    {!isCancelling && selectedVenda.status !== 'cancelado' && selectedVenda.status !== 'entregue' && (
                      <button onClick={() => setIsCancelling(true)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold cursor-pointer transition-colors">Cancelar</button>
                    )}
                    {selectedVenda.status === 'pendente' && (
                        <button onClick={() => atualizarStatus(selectedVenda.id, 'preparando')} className="flex-[2] py-2 bg-blue-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">Aceitar Pedido</button>
                    )}
                    {selectedVenda.status === 'preparando' && selectedVenda.tipo === 'delivery' && (
                        <button onClick={() => atualizarStatus(selectedVenda.id, 'saiu_entrega')} className="flex-[2] py-2 bg-orange-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-orange-700">Despachar Entrega</button>
                    )}
                    {(selectedVenda.status === 'saiu_entrega' || (selectedVenda.status === 'preparando' && selectedVenda.tipo === 'retirada')) && (
                        <button onClick={() => atualizarStatus(selectedVenda.id, 'entregue')} className="flex-[2] py-2 bg-green-600 text-white rounded-lg text-sm font-bold cursor-pointer hover:bg-green-700">Finalizar Pedido</button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}