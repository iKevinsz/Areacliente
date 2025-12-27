'use client';

import React, { useState } from 'react';
import { 
  Search, Calendar, ShoppingBag, Bike, Store, 
  Clock, CheckCircle, XCircle, Eye, Printer, Filter, X, 
  ChefHat, MapPin, Phone
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
  endereco?: string; // Opcional se for retirada
  data: string; // ISO String
  tipo: TipoEntrega;
  status: StatusPedido;
  itens: ItemPedido[];
  total: number;
  formaPagamento: string;
}

// --- DADOS MOCKADOS ---
const MOCK_VENDAS: Venda[] = [
  { 
    id: '#5023', 
    cliente: 'Kevin Rodrigo', 
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123 - Centro',
    data: '2025-12-26T19:30:00', 
    tipo: 'delivery', 
    status: 'pendente', 
    total: 85.90,
    formaPagamento: 'Pix',
    itens: [
      { qtd: 2, nome: 'X-Bacon Artesanal', preco: 28.00, obs: 'Sem cebola' },
      { qtd: 1, nome: 'Coca-Cola 2L', preco: 14.00 },
      { qtd: 1, nome: 'Batata Frita G', preco: 15.90 }
    ]
  },
  { 
    id: '#5022', 
    cliente: 'Ana Souza', 
    telefone: '(11) 98888-8888',
    data: '2025-12-26T19:15:00', 
    tipo: 'retirada', 
    status: 'preparando', 
    total: 45.00,
    formaPagamento: 'Cartão Crédito',
    itens: [
      { qtd: 1, nome: 'Pizza Calabresa M', preco: 45.00 }
    ]
  },
  { 
    id: '#5021', 
    cliente: 'Carlos Pereira', 
    telefone: '(11) 97777-7777',
    endereco: 'Av. Paulista, 1000 - Bela Vista',
    data: '2025-12-26T18:50:00', 
    tipo: 'delivery', 
    status: 'saiu_entrega', 
    total: 112.50,
    formaPagamento: 'Dinheiro (Troco para 150)',
    itens: [
      { qtd: 2, nome: 'Combo Família', preco: 50.00 },
      { qtd: 1, nome: 'Guaraná 2L', preco: 12.50 }
    ]
  },
  { 
    id: '#5020', 
    cliente: 'Fernanda Lima', 
    telefone: '(11) 96666-6666',
    data: '2025-12-26T18:00:00', 
    tipo: 'delivery', 
    status: 'entregue', 
    total: 32.00,
    formaPagamento: 'Pix',
    itens: [
      { qtd: 1, nome: 'Açaí 500ml', preco: 32.00, obs: 'Com leite ninho e morango' }
    ]
  },
];

export default function VendasCardapioPage() {
  const [vendas, setVendas] = useState<Venda[]>(MOCK_VENDAS);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredVendas = vendas.filter(venda => {
    // 1. Texto
    const matchSearch = venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        venda.id.includes(searchTerm);
    
    // 2. Status
    const matchStatus = statusFilter === 'todos' || venda.status === statusFilter;

    // 3. Data (Comparação simples de string ISO YYYY-MM-DD)
    let matchDate = true;
    const vendaDate = venda.data.split('T')[0]; // Pega YYYY-MM-DD
    if (startDate) matchDate = matchDate && vendaDate >= startDate;
    if (endDate) matchDate = matchDate && vendaDate <= endDate;

    return matchSearch && matchStatus && matchDate;
  });

  // --- KPIS ---
  const totalHoje = vendas.filter(v => v.data.startsWith(new Date().toISOString().split('T')[0])).reduce((acc, curr) => acc + curr.total, 0);
  const pendentes = vendas.filter(v => v.status === 'pendente').length;
  const emPreparo = vendas.filter(v => v.status === 'preparando').length;

  // --- HELPERS ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
  };

  const getStatusBadge = (status: StatusPedido) => {
    switch (status) {
      case 'pendente': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pendente</span>;
      case 'preparando': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1"><ChefHat size={12}/> Preparando</span>;
      case 'saiu_entrega': return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-bold flex items-center gap-1"><Bike size={12}/> Saiu p/ Entrega</span>;
      case 'entregue': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Entregue</span>;
      case 'cancelado': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-medium text-gray-400">Cardápio Digital</h2>
          <h1 className="text-2xl font-bold text-gray-800">Consulta de Vendas</h1>
        </div>
      </div>

      {/* KPIS DE OPERAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold uppercase text-gray-400">Vendas Hoje</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(totalHoje)}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-full"><ShoppingBag size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold uppercase text-gray-400">Novos Pedidos</p>
                <h3 className="text-2xl font-bold text-yellow-600">{pendentes}</h3>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full animate-pulse"><Clock size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold uppercase text-gray-400">Na Cozinha</p>
                <h3 className="text-2xl font-bold text-blue-600">{emPreparo}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><ChefHat size={24}/></div>
        </div>
      </div>

      {/* FILTROS E CONTROLES */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        
        {/* Linha Superior: Busca e Data */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between">
            <div className="relative w-full xl:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por cliente ou Nº pedido..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 w-full xl:w-auto bg-gray-50 p-2 rounded-lg border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                  <Calendar size={14}/> Período:
                </span>
                <input 
                  type="date" 
                  className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none focus:border-blue-500" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
                <span className="text-gray-400 text-xs">até</span>
                <input 
                  type="date" 
                  className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none focus:border-blue-500" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
                {(startDate || endDate) && (
                  <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-xs text-red-500 hover:text-red-700 underline ml-2">
                    Limpar
                  </button>
                )}
            </div>
        </div>

        {/* Linha Inferior: Abas de Status */}
        <div className="flex overflow-x-auto pb-1 gap-2 border-b border-gray-100">
            {[
                { id: 'todos', label: 'Todos' },
                { id: 'pendente', label: 'Pendentes' },
                { id: 'preparando', label: 'Em Preparo' },
                { id: 'saiu_entrega', label: 'Saiu p/ Entrega' },
                { id: 'entregue', label: 'Finalizados' },
                { id: 'cancelado', label: 'Cancelados' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap
                        ${statusFilter === tab.id 
                            ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'}
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* LISTA DE VENDAS */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Pedido / Cliente</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Data</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVendas.length > 0 ? (
                filteredVendas.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedVenda(venda)}>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">{venda.id}</span>
                            <span className="text-sm text-gray-600">{venda.cliente}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(venda.data)}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            {venda.tipo === 'delivery' 
                                ? <><div className="p-1 bg-orange-100 text-orange-600 rounded"><Bike size={14}/></div> Delivery</>
                                : <><div className="p-1 bg-purple-100 text-purple-600 rounded"><Store size={14}/></div> Retirada</>
                            }
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                        {formatCurrency(venda.total)}
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                        {getStatusBadge(venda.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button 
                            className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setSelectedVenda(venda); }}
                        >
                            <Eye size={18}/>
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Filter size={32} className="opacity-20"/>
                            <p>Nenhuma venda encontrada com os filtros atuais.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE DETALHES DO PEDIDO --- */}
      {selectedVenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header Modal */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Pedido {selectedVenda.id}
                        </h2>
                        <span className="text-xs text-gray-500">{formatDate(selectedVenda.data)}</span>
                    </div>
                    <button onClick={() => setSelectedVenda(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    
                    {/* Status e Tipo */}
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase text-gray-400">Status Atual</span>
                            <div className="mt-1">{getStatusBadge(selectedVenda.status)}</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold uppercase text-gray-400">Tipo</span>
                            <span className="text-sm font-medium text-gray-700 capitalize flex items-center gap-1 mt-1">
                                {selectedVenda.tipo === 'delivery' ? <Bike size={14}/> : <Store size={14}/>} {selectedVenda.tipo}
                            </span>
                        </div>
                    </div>

                    {/* Dados do Cliente */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-1">
                            <span className="bg-blue-100 text-blue-600 p-1 rounded"><ShoppingBag size={14}/></span> Dados do Cliente
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p className="flex justify-between"><span className="text-gray-400">Nome:</span> <span className="font-medium text-gray-800">{selectedVenda.cliente}</span></p>
                            <p className="flex justify-between"><span className="text-gray-400">Telefone:</span> <span className="font-medium text-gray-800 flex items-center gap-1"><Phone size={12}/> {selectedVenda.telefone}</span></p>
                            {selectedVenda.tipo === 'delivery' && (
                                <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded border border-yellow-100 flex gap-2 items-start">
                                    <MapPin size={16} className="shrink-0 mt-0.5"/>
                                    <span>{selectedVenda.endereco}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Itens do Pedido */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-1">
                            <span className="bg-orange-100 text-orange-600 p-1 rounded"><ChefHat size={14}/></span> Itens do Pedido
                        </h3>
                        <ul className="space-y-3">
                            {selectedVenda.itens.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-start text-sm">
                                    <div className="flex gap-3">
                                        <span className="font-bold text-gray-500">{item.qtd}x</span>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.nome}</p>
                                            {item.obs && <p className="text-xs text-red-500 italic mt-0.5">Obs: {item.obs}</p>}
                                        </div>
                                    </div>
                                    <span className="font-medium text-gray-600">{formatCurrency(item.preco * item.qtd)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Totais */}
                    <div className="border-t border-dashed border-gray-300 pt-4 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Forma de Pagamento:</span>
                            <span className="font-medium text-gray-800">{selectedVenda.formaPagamento}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                            <span>Total</span>
                            <span>{formatCurrency(selectedVenda.total)}</span>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Printer size={16}/> Imprimir Via
                    </button>
                    {/* Botão de ação sugerida baseado no status */}
                    {selectedVenda.status === 'pendente' && (
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Confirmar Pedido
                        </button>
                    )}
                    {selectedVenda.status === 'preparando' && (
                        <button className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                            Despachar Entrega
                        </button>
                    )}
                </div>

            </div>
        </div>
      )}

    </div>
  );
}