'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Calendar, ArrowUpCircle, ArrowDownCircle,
  FileText, Trash2, Edit3, DollarSign, X, Save, TrendingUp, TrendingDown, Wallet
} from 'lucide-react';

// --- TIPAGEM ---
interface Transacao {
  id: string;
  descricao: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string; // YYYY-MM-DD
  status: 'confirmado' | 'pendente';
}

// --- DADOS MOCKADOS ---
const MOCK_TRANSACOES: Transacao[] = [
  { id: '1', descricao: 'Venda de Produtos #1023', tipo: 'receita', categoria: 'Vendas', valor: 3500.00, data: '2025-10-25', status: 'confirmado' },
  { id: '2', descricao: 'Aluguel Loja', tipo: 'despesa', categoria: 'Infraestrutura', valor: 2500.00, data: '2025-10-05', status: 'confirmado' },
  { id: '3', descricao: 'Serviço de Consultoria', tipo: 'receita', categoria: 'Serviços', valor: 1200.00, data: '2025-10-06', status: 'pendente' },
  { id: '4', descricao: 'Compra de Material', tipo: 'despesa', categoria: 'Insumos', valor: 850.50, data: '2025-10-10', status: 'confirmado' },
  { id: '5', descricao: 'Conta de Energia', tipo: 'despesa', categoria: 'Infraestrutura', valor: 320.00, data: '2025-10-15', status: 'pendente' },
];

export default function FluxoCaixaPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(MOCK_TRANSACOES);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // Formulário
  const [formData, setFormData] = useState<Partial<Transacao>>({
    descricao: '', tipo: 'receita', valor: 0, data: '', categoria: '', status: 'confirmado'
  });

  // --- LÓGICA DE FILTRAGEM ---
  const filteredTransacoes = transacoes.filter(item => {
    const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'todos' || item.tipo === filterTipo;
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && item.data >= startDate;
    if (endDate) matchesDate = matchesDate && item.data <= endDate;

    return matchesSearch && matchesTipo && matchesDate;
  });

  // --- CÁLCULOS KPI ---
  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoAtual = totalReceitas - totalDespesas;

  // --- HANDLERS ---
  const handleOpenModal = (transacao?: Transacao) => {
    if (transacao) {
      setEditingId(transacao.id);
      setFormData({ ...transacao });
    } else {
      setEditingId(null);
      // Pega a data de hoje como padrão
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ descricao: '', tipo: 'receita', valor: 0, data: hoje, categoria: '', status: 'confirmado' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor || !formData.data) return alert("Preencha os campos obrigatórios");

    if (editingId) {
      setTransacoes(prev => prev.map(t => t.id === editingId ? { ...formData, id: editingId } as Transacao : t));
    } else {
      const { id, ...dataWithoutId } = formData;
      const nova: Transacao = {
        id: Math.random().toString(36).substring(2, 11),
        ...dataWithoutId as Omit<Transacao, 'id'>
      };
      setTransacoes([nova, ...transacoes]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      setTransacoes(prev => prev.filter(t => t.id !== idToDelete));
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  // --- HELPERS VISUAIS ---
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => { if (!dateStr) return "-"; const [year, month, day] = dateStr.split('-'); return `${day}/${month}/${year}`; };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Fluxo de Caixa</h1>
          <p className="text-gray-500 text-sm">Acompanhe as entradas e saídas financeiras.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm font-medium">
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receitas */}
        <div className="p-5 rounded-xl border border-green-100 bg-green-50/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700 opacity-80">Total Receitas</p>
            <h3 className="text-2xl font-bold mt-1 text-green-700">{formatMoney(totalReceitas)}</h3>
          </div>
          <div className="p-3 rounded-full bg-white text-green-600 shadow-sm"><TrendingUp size={24} /></div>
        </div>

        {/* Despesas */}
        <div className="p-5 rounded-xl border border-red-100 bg-red-50/50 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-red-700 opacity-80">Total Despesas</p>
            <h3 className="text-2xl font-bold mt-1 text-red-700">{formatMoney(totalDespesas)}</h3>
          </div>
          <div className="p-3 rounded-full bg-white text-red-600 shadow-sm"><TrendingDown size={24} /></div>
        </div>

        {/* Saldo (Dinâmico) */}
        <div className={`p-5 rounded-xl border shadow-sm flex items-center justify-between ${saldoAtual >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide opacity-80 ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo Atual</p>
            <h3 className={`text-2xl font-bold mt-1 ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{formatMoney(saldoAtual)}</h3>
          </div>
          <div className={`p-3 rounded-full bg-white shadow-sm ${saldoAtual >= 0 ? 'text-blue-600' : 'text-orange-600'}`}><Wallet size={24} /></div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar lançamento..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          {/* Filtro de Tipo (Abas) */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-start">
            <button onClick={() => setFilterTipo('todos')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filterTipo === 'todos' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Todos</button>
            <button onClick={() => setFilterTipo('receita')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${filterTipo === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-green-600'}`}><span className="w-2 h-2 rounded-full bg-green-500"></span> Receitas</button>
            <button onClick={() => setFilterTipo('despesa')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${filterTipo === 'despesa' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-600'}`}><span className="w-2 h-2 rounded-full bg-red-500"></span> Despesas</button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Calendar size={14}/> Período:</span>
            <input type="date" className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="text-gray-400 text-xs">até</span>
            <input type="date" className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-xs text-red-500 hover:text-red-700 underline ml-1">Limpar</button>}
        </div>
      </div>

      {/* TABELA DE TRANSAÇÕES */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Data</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Valor</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransacoes.length > 0 ? (
              filteredTransacoes.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => handleOpenModal(item)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.tipo === 'receita' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-bold text-gray-800">{item.descricao}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">{item.categoria}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatDate(item.data)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${item.tipo === 'receita' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                        {item.tipo === 'receita' ? <ArrowUpCircle size={12}/> : <ArrowDownCircle size={12}/>}
                        {item.tipo === 'receita' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.tipo === 'despesa' && "- "}{formatMoney(item.valor)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'confirmado' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
                        {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => {e.stopPropagation(); handleOpenModal(item)}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                      <button onClick={(e) => {e.stopPropagation(); setIsDeleteModalOpen(true); setIdToDelete(item.id)}} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center gap-2"><Filter size={32} className="opacity-20" /><p>Nenhum lançamento encontrado.</p></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (NOVO/EDITAR) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              {/* Seletor de Tipo */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    type="button"
                    onClick={() => setFormData({...formData, tipo: 'receita'})}
                    className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.tipo === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                >
                    <ArrowUpCircle size={16}/> Receita (Entrada)
                </button>
                <button 
                    type="button"
                    onClick={() => setFormData({...formData, tipo: 'despesa'})}
                    className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${formData.tipo === 'despesa' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                >
                    <ArrowDownCircle size={16}/> Despesa (Saída)
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrição *</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Venda de Mercadoria" 
                  value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor (R$) *</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0,00" 
                    value={formData.valor} onChange={e => setFormData({...formData, valor: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data *</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} >
                    <option value="">Selecione...</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Impostos">Impostos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                    <option value="confirmado">Confirmado (Realizado)</option>
                    <option value="pendente">Pendente (Previsto)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save size={16} /> Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CONFIRMAR EXCLUSÃO --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Excluir Lançamento?</h3>
            <p className="text-gray-500 text-sm mb-6">Essa ação não poderá ser desfeita e afetará o saldo atual.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-600/20 transition-colors">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}