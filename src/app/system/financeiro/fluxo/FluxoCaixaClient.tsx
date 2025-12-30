'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Filter, Calendar, ArrowUpCircle, ArrowDownCircle,
  FileText, Trash2, Edit3, X, Save, TrendingUp, TrendingDown, Wallet, AlertTriangle, CheckCircle2, ChevronRight, Loader2
} from 'lucide-react';
import { saveTransacao, deleteTransacao } from '@/app/actions/financeiro';

const HIGH_VALUE_THRESHOLD = 10000; 

// Interface compatível com o retorno da Server Action
interface Transacao {
  id: number | null; // ID pode ser null se for novo
  descricao: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  valor: number;
  data: string; // YYYY-MM-DD
  status: 'confirmado' | 'pendente';
}

interface FluxoCaixaClientProps {
  initialTransacoes: Transacao[];
}

export default function FluxoCaixaClient({ initialTransacoes }: FluxoCaixaClientProps) {
  const router = useRouter();
  
  // Agora usamos as props iniciais vindas do banco
  const [transacoes, setTransacoes] = useState<Transacao[]>(initialTransacoes);
  
  // Atualiza o estado local quando as props (dados do servidor) mudam após router.refresh()
  React.useEffect(() => {
    setTransacoes(initialTransacoes);
  }, [initialTransacoes]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
  const [isHighValueModalOpen, setIsHighValueModalOpen] = useState(false); 
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Transacao>({
    id: null, descricao: '', tipo: 'receita', valor: 0, data: '', categoria: '', status: 'confirmado'
  });

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

  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoAtual = totalReceitas - totalDespesas;

  const handleOpenModal = (transacao?: Transacao) => {
    if (transacao) {
      setEditingId(transacao.id);
      setFormData({ ...transacao });
    } else {
      setEditingId(null);
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ id: null, descricao: '', tipo: 'receita', valor: 0, data: hoje, categoria: '', status: 'confirmado' });
    }
    setIsModalOpen(true);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
    setFormData({ ...formData, valor: numericValue });
  };

  // --- ALTERAÇÃO PRINCIPAL: SALVAR NO BANCO ---
  const executeSave = async () => {
    setIsLoading(true);
    setIsHighValueModalOpen(false);

    try {
        const result = await saveTransacao(formData);

        if (result.success) {
           setIsModalOpen(false);
           setIsSuccessModalOpen(true);
           router.refresh(); // Sincroniza com o servidor
        } else {
           alert("Erro ao salvar. Tente novamente.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        setIsLoading(false);
    }
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

  const openDeleteModal = (id: number | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // --- ALTERAÇÃO PRINCIPAL: DELETAR NO BANCO ---
  const handleConfirmDelete = async () => {
    if (idToDelete) {
        setIsLoading(true);
        try {
            await deleteTransacao(idToDelete);
            // Atualização Otimista (opcional): Remove da lista visualmente antes do refresh
            setTransacoes(prev => prev.filter(t => t.id !== idToDelete));
            
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
            router.refresh();
        } catch (error) {
            alert("Erro ao excluir.");
        } finally {
            setIsLoading(false);
        }
    }
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => { if (!dateStr) return "-"; const [year, month, day] = dateStr.split('-'); return `${day}/${month}/${year}`; };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">Fluxo de Caixa</h1>
          <p className="text-gray-500 text-xs md:text-sm">Gerencie suas receitas e despesas.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm font-medium active:scale-95 cursor-pointer">
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 md:p-5 rounded-xl border border-green-100 bg-green-50/50 shadow-sm flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-green-700 opacity-80">Receitas</p>
            <h3 className="text-lg md:text-2xl font-black mt-1 text-green-700 truncate">{formatMoney(totalReceitas)}</h3>
          </div>
          <div className="p-2 md:p-3 rounded-full bg-white text-green-600 shadow-sm shrink-0"><TrendingUp size={24} /></div>
        </div>
        <div className="p-4 md:p-5 rounded-xl border border-red-100 bg-red-50/50 shadow-sm flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-red-700 opacity-80">Despesas</p>
            <h3 className="text-lg md:text-2xl font-black mt-1 text-red-700 truncate">{formatMoney(totalDespesas)}</h3>
          </div>
          <div className="p-2 md:p-3 rounded-full bg-white text-red-600 shadow-sm shrink-0"><TrendingDown size={24} /></div>
        </div>
        <div className={`p-4 md:p-5 rounded-xl border shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1 ${saldoAtual >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className="min-w-0">
            <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-80 ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo Atual</p>
            <h3 className={`text-lg md:text-2xl font-black mt-1 truncate ${saldoAtual >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{formatMoney(saldoAtual)}</h3>
          </div>
          <div className={`p-2 md:p-3 rounded-full bg-white shadow-sm shrink-0 ${saldoAtual >= 0 ? 'text-blue-600' : 'text-orange-600'}`}><Wallet size={24} /></div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col-reverse md:flex-row-reverse gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button onClick={() => setFilterTipo('todos')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${filterTipo === 'todos' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Todos</button>
            <button onClick={() => setFilterTipo('receita')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 whitespace-nowrap ${filterTipo === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><span className="w-2 h-2 rounded-full bg-green-500"></span> Receitas</button>
            <button onClick={() => setFilterTipo('despesa')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 whitespace-nowrap ${filterTipo === 'despesa' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}><span className="w-2 h-2 rounded-full bg-red-500"></span> Despesas</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1"><Calendar size={14}/> Período:</span>
            <div className="flex items-center gap-2 w-full">
              <input type="date" className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-600 text-xs rounded-lg px-2 py-1.5 outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="text-gray-400 text-xs font-bold">atê</span>
              <input type="date" className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-600 text-xs rounded-lg px-2 py-1.5 outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-xs text-red-500 font-bold ml-1">X</button>}
            </div>
        </div>
      </div>

      {/* TABELA / LISTA MOBILE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
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
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.tipo === 'receita' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
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
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => {e.stopPropagation(); handleOpenModal(item)}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><Edit3 size={16} /></button>
                        <button onClick={(e) => openDeleteModal(item.id, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : <NoData colSpan={7} isTable />}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredTransacoes.length > 0 ? (
            filteredTransacoes.map((item) => (
              <div key={item.id} className="p-4 active:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between" onClick={() => handleOpenModal(item)}>
                <div className="flex gap-3 min-w-0">
                  <div className={`p-2 rounded-lg h-fit ${item.tipo === 'receita' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{item.descricao}</div>
                    <div className="text-[10px] text-gray-500 mb-1">{item.categoria} • {formatDate(item.data)}</div>
                    <div className={`text-xs font-black ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.tipo === 'despesa' && "- "}{formatMoney(item.valor)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${item.status === 'confirmado' ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}>
                    {item.status}
                  </span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            ))
          ) : <NoData />}
        </div>
      </div>

      {/* MODAL PRINCIPAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 sm:zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Movimentação' : 'Novo Lançamento'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1 hover:bg-gray-200 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveCheck} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button type="button" onClick={() => setFormData({...formData, tipo: 'receita'})} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.tipo === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}><ArrowUpCircle size={16}/> Receita</button>
                <button type="button" onClick={() => setFormData({...formData, tipo: 'despesa'})} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${formData.tipo === 'despesa' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}><ArrowDownCircle size={16}/> Despesa</button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Descrição *</label>
                <input type="text" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Venda de Mercadoria" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Valor *</label>
                  <input type="text" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="R$ 0,00" value={formData.valor ? formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''} onChange={handleValorChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Data *</label>
                  <input type="date" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categoria</label>
                  <input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Vendas" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                    <option value="confirmado">Confirmado</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 font-black shadow-lg shadow-blue-100 disabled:opacity-70 active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'SALVAR LANÇAMENTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEEDBACK MODALS */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={32} /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Excluir Lançamento?</h3>
            <p className="text-sm text-gray-500 mb-6">Esta ação apagará o registro permanentemente do banco.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium cursor-pointer">Não</button>
              <button onClick={handleConfirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 flex items-center justify-center gap-2 cursor-pointer">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlertModalOpen && <FeedbackModal type="warning" title="Campos Obrigatórios" desc="Preencha Descrição, Valor e Data." btnText="OK" btnColor="bg-yellow-600" onClose={() => setIsAlertModalOpen(false)} />}
      {isSuccessModalOpen && <FeedbackModal type="success" title="Sucesso!" desc="Lançamento registrado." btnText="Entendido" btnColor="bg-blue-600" onClose={() => setIsSuccessModalOpen(false)} />}
      {isHighValueModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm animate-in zoom-in-95">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Valor Elevado</h3>
            <p className="text-sm text-gray-600 mb-6">Você está registrando {formatMoney(formData.valor)}. Confirma?</p>
            <div className="flex gap-2">
              <button onClick={() => setIsHighValueModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold cursor-pointer">Voltar</button>
              <button onClick={executeSave} className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg cursor-pointer">Sim, Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NoData = ({ colSpan, isTable = false }: { colSpan?: number, isTable?: boolean }) => {
  const content = (
    <div className="px-6 py-12 text-center text-gray-400 bg-gray-50/50 flex flex-col items-center justify-center gap-2 w-full">
      <Filter size={32} className="opacity-20" />
      <p className="text-sm font-medium">Nenhum registro encontrado.</p>
    </div>
  );
  return isTable ? <tr><td colSpan={colSpan}>{content}</td></tr> : content;
};

const FeedbackModal = ({ type, title, desc, btnText, btnColor, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
    <div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm animate-in zoom-in-95">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
        {type === 'success' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{desc}</p>
      <button onClick={onClose} className={`w-full ${btnColor} text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 cursor-pointer`}>{btnText}</button>
    </div>
  </div>
);