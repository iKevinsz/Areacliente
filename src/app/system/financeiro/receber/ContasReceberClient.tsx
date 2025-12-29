'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Filter, Calendar, AlertCircle, CheckCircle2, 
  FileText, Trash2, Edit3, TrendingUp, X, Save, Wallet, AlertTriangle 
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
  // --- ESTADO LOCAL ---
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

  // --- PERSISTÊNCIA NO NAVEGADOR (LocalStorage) ---
  useEffect(() => {
    const saved = localStorage.getItem('@Financeiro:contasReceber');
    if (saved) setContas(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('@Financeiro:contasReceber', JSON.stringify(contas));
  }, [contas]);

  // --- LÓGICA DE FILTRAGEM ---
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

  // --- CÁLCULOS KPI ---
  const totalPendente = contas.filter(c => c.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);
  const totalVencido = contas.filter(c => c.status === 'vencido').reduce((acc, curr) => acc + curr.valor, 0);
  const totalRecebido = contas.filter(c => c.status === 'recebido').reduce((acc, curr) => acc + curr.valor, 0);

  // --- HANDLERS ---
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

    // Simulação de processamento local
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
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Contas a Receber Local</h1>
          <p className="text-gray-500 text-sm">Gerenciamento offline (salvo no navegador).</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm font-medium cursor-pointer">
          <Plus size={18} /> Nova Receita
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="A Receber" value={totalPendente} icon={<Wallet className="text-blue-600" />} color="bg-blue-50 border-blue-100" textColor="text-blue-700"/>
        <KPICard title="Vencido" value={totalVencido} icon={<AlertCircle className="text-red-600" />} color="bg-red-50 border-red-100" textColor="text-red-700"/>
        <KPICard title="Recebido" value={totalRecebido} icon={<TrendingUp className="text-green-600" />} color="bg-green-50 border-green-100" textColor="text-green-700"/>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg self-start">
            {['todos', 'pendente', 'vencido', 'recebido'].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status as any)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all cursor-pointer ${filterStatus === status ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{status}</button>
            ))}
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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Descrição / Cliente</th>
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
                        {conta.status === 'recebido' ? <CheckCircle2 size={18}/> : <FileText size={18} />}
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
                  <td className="px-6 py-4 flex justify-center">
                    <StatusBadge status={conta.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal(conta); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit3 size={16} /></button>
                      <button onClick={(e) => openDeleteModal(conta.id, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center gap-2"><Filter size={32} className="opacity-20" /><p>Nenhuma conta encontrada.</p></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL SALVAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Receita' : 'Nova Receita'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveConta} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrição *</label>
                <input type="text" required className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Venda de Mercadoria" 
                  value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor (R$) *</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="R$ 0,00" 
                    value={formData.valor ? formData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData({...formData, valor: val ? parseFloat(val) / 100 : 0});
                    }} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vencimento *</label>
                  <input type="date" required className="w-full px-3 py-2 border rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500" 
                    value={formData.vencimento} onChange={e => setFormData({...formData, vencimento: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Nome do Cliente" 
                  value={formData.cliente} onChange={e => setFormData({...formData, cliente: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Vendas"
                    value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                    <option value="pendente">A Receber</option>
                    <option value="recebido">Recebido</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
                  {isLoading ? 'Salvando...' : <><Save size={16} /> Salvar Receita</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEEDBACKS */}
      {isDeleteModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={32} /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Excluir?</h3><p className="text-sm text-gray-500 mb-6">Remover esta receita da lista local?</p><div className="flex gap-3 justify-center"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">Cancelar</button><button onClick={handleConfirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer">Excluir</button></div></div></div>)}
      {isValidationModalOpen && (<div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm"><div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600"><AlertTriangle size={32} /></div><h3 className="text-xl font-bold mb-2">Campos Obrigatórios</h3><p className="text-sm text-gray-600 mb-4">Preencha Descrição, Valor e Vencimento.</p><button onClick={() => setIsValidationModalOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">Entendido</button></div></div>)}
      {showSuccessModal && (<div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white rounded-2xl shadow-xl p-6 text-center w-full max-w-sm"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle2 size={32} /></div><h3 className="text-xl font-bold mb-2">Sucesso!</h3><p className="text-sm text-gray-600 mb-4">Conta salva na memória local.</p><button onClick={() => setShowSuccessModal(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer">OK</button></div></div>)}
    </div>
  );
}

const KPICard = ({ title, value, icon, color, textColor }: any) => (
  <div className={`p-5 rounded-xl border shadow-sm flex items-center justify-between ${color}`}>
    <div>
      <p className={`text-xs font-bold uppercase tracking-wide opacity-80 ${textColor}`}>{title}</p>
      <h3 className={`text-2xl font-bold mt-1 ${textColor}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </h3>
    </div>
    <div className={`p-3 rounded-full bg-white bg-opacity-60 shadow-sm`}>{icon}</div>
  </div>
);