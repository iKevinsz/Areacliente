'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, Calendar, ArrowUpCircle, ArrowDownCircle,
  FileText, Trash2, Edit3, X, Save, TrendingUp, TrendingDown, Wallet, AlertTriangle, CheckCircle2
} from 'lucide-react';

const HIGH_VALUE_THRESHOLD = 10000; 

interface Transacao {
  id: number | string;
  descricao: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string; // YYYY-MM-DD
  status: 'confirmado' | 'pendente';
}

export default function FluxoCaixaClient() {
  // --- ESTADO LOCAL (Substitui o Banco de Dados) ---
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modais de Estado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
  const [isHighValueModalOpen, setIsHighValueModalOpen] = useState(false); 
  
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Formulário
  const [formData, setFormData] = useState<Transacao>({
    id: '', descricao: '', tipo: 'receita', valor: 0, data: '', categoria: '', status: 'confirmado'
  });

  // --- PERSISTÊNCIA OPCIONAL (LocalStorage) ---
  useEffect(() => {
    const saved = localStorage.getItem('@FluxoCaixa:transacoes');
    if (saved) setTransacoes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('@FluxoCaixa:transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredTransacoes = useMemo(() => {
    return transacoes.filter(item => {
      const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.categoria || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = filterTipo === 'todos' || item.tipo === filterTipo;
      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && item.data >= startDate;
      if (endDate) matchesDate = matchesDate && item.data <= endDate;
      return matchesSearch && matchesTipo && matchesDate;
    });
  }, [transacoes, searchTerm, filterTipo, startDate, endDate]);

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
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ id: '', descricao: '', tipo: 'receita', valor: 0, data: hoje, categoria: '', status: 'confirmado' });
    }
    setIsModalOpen(true);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
    setFormData({ ...formData, valor: numericValue });
  };

  const executeSave = () => {
    setIsLoading(true);
    setIsHighValueModalOpen(false);

    if (editingId) {
      // EDITAR
      setTransacoes(prev => prev.map(t => t.id === editingId ? { ...formData } : t));
    } else {
      // CRIAR NOVO
      const novoLancamento = { ...formData, id: Date.now().toString() };
      setTransacoes(prev => [novoLancamento, ...prev]);
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    }, 500);
  };

  const handleSaveCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor || !formData.data) {
        setIsAlertModalOpen(true);
        return;
    }
    if (formData.valor > HIGH_VALUE_THRESHOLD) {
        setIsHighValueModalOpen(true); 
        return;
    }
    executeSave();
  };

  const openDeleteModal = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setTransacoes(prev => prev.filter(t => t.id !== idToDelete));
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => { if (!dateStr) return "-"; const [year, month, day] = dateStr.split('-'); return `${day}/${month}/${year}`; };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Fluxo de Caixa Local</h1>
          <p className="text-gray-500 text-sm">Gerenciamento offline (salvo no navegador).</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm font-medium cursor-pointer">
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-green-100 bg-green-50/50 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-green-700 opacity-80">Total Receitas</p><h3 className="text-2xl font-bold mt-1 text-green-700">{formatMoney(totalReceitas)}</h3></div>
          <div className="p-3 rounded-full bg-white text-green-600 shadow-sm"><TrendingUp size={24} /></div>
        </div>
        <div className="p-5 rounded-xl border border-red-100 bg-red-50/50 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-red-700 opacity-80">Total Despesas</p><h3 className="text-2xl font-bold mt-1 text-red-700">{formatMoney(totalDespesas)}</h3></div>
          <div className="p-3 rounded-full bg-white text-red-600 shadow-sm"><TrendingDown size={24} /></div>
        </div>
        <div className={`p-5 rounded-xl border shadow-sm flex items-center justify-between ${saldoAtual >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div><p className={`text-xs font-bold uppercase tracking-wide opacity-80 ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo Atual</p><h3 className={`text-2xl font-bold mt-1 ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{formatMoney(saldoAtual)}</h3></div>
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
          <div className="flex bg-gray-100 p-1 rounded-lg self-start">
            <button onClick={() => setFilterTipo('todos')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${filterTipo === 'todos' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Todos</button>
            <button onClick={() => setFilterTipo('receita')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${filterTipo === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-green-600'}`}><span className="w-2 h-2 rounded-full bg-green-500"></span> Receitas</button>
            <button onClick={() => setFilterTipo('despesa')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${filterTipo === 'despesa' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-600'}`}><span className="w-2 h-2 rounded-full bg-red-500"></span> Despesas</button>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full xl:w-auto bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Calendar size={14}/> Período:</span>
            <input type="date" className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none cursor-pointer" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="text-gray-400 text-xs">até</span>
            <input type="date" className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none cursor-pointer" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-xs text-red-500 hover:text-red-700 underline ml-1 cursor-pointer">Limpar</button>}
        </div>
      </div>

      {/* TABELA */}
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
                      <button onClick={(e) => {e.stopPropagation(); handleOpenModal(item)}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit3 size={16} /></button>
                      <button onClick={(e) => openDeleteModal(item.id!, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center gap-2"><Filter size={32} className="opacity-20" /><p>Nenhum registro encontrado.</p></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (NOVO/EDITAR) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveCheck} className="p-6 space-y-5">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button type="button" onClick={() => setFormData({...formData, tipo: 'receita'})} className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.tipo === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><ArrowUpCircle size={16}/> Receita</button>
                <button type="button" onClick={() => setFormData({...formData, tipo: 'despesa'})} className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.tipo === 'despesa' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}><ArrowDownCircle size={16}/> Despesa</button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrição *</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Venda de Mercadoria" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor (R$) *</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="R$ 0,00" value={formData.valor ? formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''} onChange={handleValorChange} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data *</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Vendas" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                    <option value="confirmado">Confirmado</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
                  {isLoading ? 'Processando...' : <><Save size={16} /> Salvar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAIS DE FEEDBACK (Sem alteração visual, apenas lógica local) */}
      {isDeleteModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={32} /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Excluir?</h3><p className="text-sm text-gray-500 mb-6">Esta ação removerá o registro localmente.</p><div className="flex gap-3 justify-center"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">Cancelar</button><button onClick={handleConfirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer">Excluir</button></div></div></div>)}
      {isAlertModalOpen && (<div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm"><div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600"><AlertTriangle size={32} /></div><h3 className="text-xl font-bold mb-2">Atenção!</h3><p className="text-sm text-gray-600 mb-4">Preencha os campos obrigatórios.</p><button onClick={() => setIsAlertModalOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">OK</button></div></div>)}
      {isHighValueModalOpen && (<div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm"><div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600"><AlertTriangle size={32} /></div><h3 className="text-xl font-bold mb-2">Valor Alto</h3><p className="text-sm text-gray-600 mb-4">Confirma o valor de {formatMoney(formData.valor || 0)}?</p><div className="flex gap-2 justify-center"><button onClick={() => setIsHighValueModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer">Voltar</button><button onClick={executeSave} className="px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer">Confirmar</button></div></div></div>)}
      {isSuccessModalOpen && (<div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle2 size={32} /></div><h3 className="text-xl font-bold mb-2">Sucesso!</h3><p className="text-sm text-gray-600 mb-4">Registro processado com sucesso.</p><button onClick={() => setIsSuccessModalOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">OK</button></div></div>)}
    </div>
  );
}