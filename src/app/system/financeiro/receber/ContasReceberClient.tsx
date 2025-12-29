'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, Calendar, AlertCircle, CheckCircle2, 
  FileText, Trash2, Edit3, TrendingUp, X, Save, Wallet, AlertTriangle, ChevronRight 
} from 'lucide-react';

interface ContaReceber {
  id: number | string;
  descricao: string;
  cliente: string; 
  valor: number;
  vencimento: string;
  status: 'pendente' | 'recebido' | 'vencido';
  categoria: string;
}

export default function ContasReceberClient() {
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'recebido' | 'vencido'>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ContaReceber>({
    id: '', descricao: '', cliente: '', valor: 0, vencimento: '', categoria: '', status: 'pendente'
  });

  useEffect(() => {
    const saved = localStorage.getItem('@Financeiro:contasReceber');
    if (saved) setContas(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('@Financeiro:contasReceber', JSON.stringify(contas));
  }, [contas]);

  const filteredContas = useMemo(() => {
    return contas.filter(conta => {
      const matchesSearch = (conta.descricao?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                            (conta.cliente?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'todos' || conta.status === filterStatus;
      let matchesDate = true;
      if (startDate) matchesDate = matchesDate && conta.vencimento >= startDate;
      if (endDate) matchesDate = matchesDate && conta.vencimento <= endDate;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [contas, searchTerm, filterStatus, startDate, endDate]);

  const totalPendente = contas.filter(c => c.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);
  const totalVencido = contas.filter(c => c.status === 'vencido').reduce((acc, curr) => acc + curr.valor, 0);
  const totalRecebido = contas.filter(c => c.status === 'recebido').reduce((acc, curr) => acc + curr.valor, 0);

  const handleOpenModal = (conta?: ContaReceber) => {
    if (conta) {
      setEditingId(conta.id);
      setFormData({ ...conta });
    } else {
      setEditingId(null);
      const hoje = new Date().toISOString().split('T')[0];
      setFormData({ id: '', descricao: '', cliente: '', valor: 0, vencimento: hoje, categoria: '', status: 'pendente' });
    }
    setIsModalOpen(true);
  };

  const handleSaveConta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor || !formData.vencimento) {
      setIsValidationModalOpen(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      if (editingId) {
        setContas(prev => prev.map(c => c.id === editingId ? { ...formData } : c));
      } else {
        const novaConta = { ...formData, id: Date.now().toString() };
        setContas(prev => [novaConta, ...prev]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
      setShowSuccessModal(true);
    }, 400);
  };

  const handleConfirmDelete = () => {
    setContas(prev => prev.filter(c => c.id !== idToDelete));
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
  };

  const openDeleteModal = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => { 
    if (!dateStr) return "-"; 
    const [year, month, day] = dateStr.split('-'); 
    return `${day}/${month}/${year}`; 
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      recebido: 'bg-green-100 text-green-700 border-green-200',
      pendente: 'bg-blue-50 text-blue-700 border-blue-200',
      vencido: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = { recebido: 'Recebido', pendente: 'A Receber', vencido: 'Vencido' };
    return <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">Contas a Receber</h1>
          <p className="text-gray-500 text-xs md:text-sm">Gerenciamento offline das suas receitas.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm font-medium active:scale-95">
          <Plus size={18} /> Nova Receita
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="A Receber" value={totalPendente} icon={<Wallet className="text-blue-600" />} color="bg-blue-50 border-blue-100" textColor="text-blue-700"/>
        <KPICard title="Vencido" value={totalVencido} icon={<AlertCircle className="text-red-600" />} color="bg-red-50 border-red-100" textColor="text-red-700"/>
        <KPICard title="Recebido" value={totalRecebido} icon={<TrendingUp className="text-green-600" />} color="bg-green-50 border-green-100" textColor="text-green-700"/>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
            {['todos', 'pendente', 'recebido', 'vencido'].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status as any)} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap ${filterStatus === status ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{status === 'pendente' ? 'a receber' : status}</button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1"><Calendar size={14}/> Período:</span>
            <div className="flex items-center gap-2 w-full">
              <input type="date" className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-600 text-xs rounded-lg px-2 py-1.5 outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="text-gray-400 text-xs">atê</span>
              <input type="date" className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-600 text-xs rounded-lg px-2 py-1.5 outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('')}} className="text-xs text-red-500 font-bold ml-1">X</button>}
            </div>
        </div>
      </div>

      {/* TABELA / LISTA MOBILE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* VIEW DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Vencimento</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContas.length > 0 ? (
                filteredContas.map((conta) => (
                  <tr key={conta.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => handleOpenModal(conta)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${conta.status === 'recebido' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                          {conta.status === 'recebido' ? <TrendingUp size={18}/> : <FileText size={18} />}
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${conta.status === 'recebido' ? 'text-gray-500' : 'text-gray-800'}`}>{conta.descricao}</div>
                          <div className="text-xs text-gray-500">{conta.cliente}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">{conta.categoria}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatDate(conta.vencimento)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatMoney(conta.valor)}</td>
                    <td className="px-6 py-4 text-center"><StatusBadge status={conta.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(conta); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                        <button onClick={(e) => openDeleteModal(conta.id, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <NoData colSpan={6} isTable />
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW MOBILE */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredContas.length > 0 ? (
            filteredContas.map((conta) => (
              <div key={conta.id} className="p-4 active:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between" onClick={() => handleOpenModal(conta)}>
                <div className="flex gap-3 min-w-0">
                  <div className={`p-2 rounded-lg h-fit ${conta.status === 'recebido' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {conta.status === 'recebido' ? <TrendingUp size={18}/> : <FileText size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-bold truncate ${conta.status === 'recebido' ? 'text-gray-500' : 'text-gray-800'}`}>{conta.descricao}</div>
                    <div className="text-[10px] text-gray-500 mb-1">{conta.cliente}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">{formatMoney(conta.valor)}</span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-[10px] text-gray-500 font-medium">{formatDate(conta.vencimento)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                  <StatusBadge status={conta.status} />
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
      </div>

      {/* MODAL PRINCIPAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 sm:zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Receita' : 'Nova Receita'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveConta} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Descrição *</label>
                <input type="text" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Venda de Mercadoria" 
                  value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Valor *</label>
                  <input type="text" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="R$ 0,00" 
                    value={formData.valor ? formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData({...formData, valor: val ? parseFloat(val) / 100 : 0});
                    }} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Vencimento *</label>
                  <input type="date" required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                    value={formData.vencimento} onChange={e => setFormData({...formData, vencimento: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Cliente</label>
                  <input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do cliente" 
                    value={formData.cliente} onChange={e => setFormData({...formData, cliente: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Categoria</label>
                  <input type="text" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Venda"
                    value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Status</label>
                <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                  <option value="pendente">A Receber</option>
                  <option value="recebido">Recebido</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-70 active:scale-95 transition-all">
                  {isLoading ? 'Salvando...' : <><Save size={16} /> Salvar Receita</>}
                </button>
              </div>
              {editingId && (
                <button type="button" onClick={(e) => openDeleteModal(editingId, e as any)} className="w-full text-xs text-red-500 font-bold py-2 mt-2 hover:bg-red-50 rounded-lg transition-colors">
                  Excluir Receita
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Excluir?</h3>
            <p className="text-sm text-gray-500 mb-6">Remover esta receita permanentemente?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">Não</button>
              <button onClick={handleConfirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACKS */}
      {isValidationModalOpen && <FeedbackModal type="warning" title="Campos Obrigatórios" desc="Preencha Descrição, Valor e Vencimento." btnText="Entendido" btnColor="bg-yellow-600" onClose={() => setIsValidationModalOpen(false)} />}
      {showSuccessModal && <FeedbackModal type="success" title="Sucesso!" desc="Dados salvos localmente." btnText="OK" btnColor="bg-blue-600" onClose={() => setShowSuccessModal(false)} />}
    </div>
  );
}

const KPICard = ({ title, value, icon, color, textColor }: any) => (
  <div className={`p-4 md:p-5 rounded-xl border shadow-sm flex items-center justify-between ${color}`}>
    <div className="min-w-0">
      <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-80 ${textColor}`}>{title}</p>
      <h3 className={`text-lg md:text-2xl font-black mt-1 truncate ${textColor}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </h3>
    </div>
    <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-60 shadow-sm shrink-0 ml-2">{icon}</div>
  </div>
);

const NoData = ({ colSpan, isTable = false }: { colSpan?: number, isTable?: boolean }) => {
  const content = (
    <div className="px-6 py-12 text-center text-gray-400 bg-gray-50/50 flex flex-col items-center justify-center gap-2 w-full">
      <Filter size={32} className="opacity-20" />
      <p className="text-sm">Nenhuma conta encontrada.</p>
    </div>
  );

  if (isTable) {
    return (
      <tr>
        <td colSpan={colSpan}>{content}</td>
      </tr>
    );
  }

  return content;
};

const FeedbackModal = ({ type, title, desc, btnText, btnColor, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
    <div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm animate-in zoom-in-95">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
        {type === 'success' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{desc}</p>
      <button onClick={onClose} className={`w-full ${btnColor} text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95`}>{btnText}</button>
    </div>
  </div>
);