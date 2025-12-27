'use client';

import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Calendar, AlertCircle, CheckCircle2, 
  FileText, Trash2, Edit3, DollarSign, X, Save
} from 'lucide-react';

// --- TIPAGEM ---
interface Conta {
  id: string;
  descricao: string;
  fornecedor: string;
  valor: number;
  vencimento: string;
  status: 'pendente' | 'pago' | 'vencido';
  categoria: string;
}

// --- DADOS MOCKADOS ---
const MOCK_CONTAS: Conta[] = [
  { id: '1', descricao: 'Aluguel Loja', fornecedor: 'Imobiliária Silva', valor: 2500.00, vencimento: '2025-10-05', status: 'vencido', categoria: 'Infraestrutura' },
  { id: '2', descricao: 'Fornecedor de Carnes', fornecedor: 'Frigorífico Boi Gordo', valor: 1250.00, vencimento: '2025-10-15', status: 'pendente', categoria: 'Matéria Prima' },
  { id: '3', descricao: 'Internet Fibra', fornecedor: 'Vivo', valor: 150.00, vencimento: '2025-10-10', status: 'pago', categoria: 'Infraestrutura' },
  { id: '4', descricao: 'Manutenção Freezer', fornecedor: 'Técnico José', valor: 300.00, vencimento: '2025-10-20', status: 'pendente', categoria: 'Manutenção' },
];

export default function ContasPagarPage() {
  const [contas, setContas] = useState<Conta[]>(MOCK_CONTAS);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'pago' | 'vencido'>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Conta>>({
    descricao: '', fornecedor: '', valor: 0, vencimento: '', categoria: '', status: 'pendente'
  });

  // --- LÓGICA DE FILTRAGEM ---
  const filteredContas = contas.filter(conta => {
    const matchesSearch = conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || conta.status === filterStatus;
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && conta.vencimento >= startDate;
    if (endDate) matchesDate = matchesDate && conta.vencimento <= endDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // --- CÁLCULOS KPI ---
  const totalPendente = contas.filter(c => c.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);
  const totalVencido = contas.filter(c => c.status === 'vencido').reduce((acc, curr) => acc + curr.valor, 0);
  const totalPago = contas.filter(c => c.status === 'pago').reduce((acc, curr) => acc + curr.valor, 0);

  // --- HANDLERS ---
  const handleOpenModal = (conta?: Conta) => {
    if (conta) {
      setEditingId(conta.id);
      setFormData({ ...conta });
    } else {
      setEditingId(null);
      setFormData({ descricao: '', fornecedor: '', valor: 0, vencimento: '', categoria: '', status: 'pendente' });
    }
    setIsModalOpen(true);
  };

  const handleSaveConta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor || !formData.vencimento) return alert("Preencha os campos obrigatórios");

    if (editingId) {
      setContas(prev => prev.map(c => c.id === editingId ? { ...formData, id: editingId } as Conta : c));
    } else {
      const { id, ...dataWithoutId } = formData;
      const novaConta: Conta = {
        id: Math.random().toString(36).substring(2, 11),
        ...dataWithoutId as Omit<Conta, 'id'>
      };
      setContas([novaConta, ...contas]);
    }
    setIsModalOpen(false);
  };

  const deleteConta = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique na lixeira abra o modal de edição
    if(confirm("Deseja excluir esta conta?")) {
      setContas(contas.filter(c => c.id !== id));
    }
  };

  // --- HELPERS ---
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => { if (!dateStr) return "-"; const [year, month, day] = dateStr.split('-'); return `${day}/${month}/${year}`; };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      pago: 'bg-green-100 text-green-700 border-green-200',
      pendente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      vencido: 'bg-red-100 text-red-700 border-red-200',
    };
    const labels = { pago: 'Pago', pendente: 'A Vencer', vencido: 'Vencido' };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Contas a Pagar</h1>
          <p className="text-gray-500 text-sm">Gerencie suas despesas e vencimentos.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm font-medium">
          <Plus size={18} /> Nova Conta
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="A Pagar (Aberto)" value={totalPendente} icon={<DollarSign className="text-yellow-600" />} color="bg-yellow-50 border-yellow-100" textColor="text-yellow-700"/>
        <KPICard title="Vencido (Urgente)" value={totalVencido} icon={<AlertCircle className="text-red-600" />} color="bg-red-50 border-red-100" textColor="text-red-700"/>
        <KPICard title="Pago (Este Mês)" value={totalPago} icon={<CheckCircle2 className="text-green-600" />} color="bg-green-50 border-green-100" textColor="text-green-700"/>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar fornecedor ou descrição..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg self-start">
            {['todos', 'pendente', 'vencido', 'pago'].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status as any)} className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${filterStatus === status ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{status}</button>
            ))}
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

      {/* TABELA */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Descrição / Fornecedor</th>
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
                      <div className={`p-2 rounded-lg ${conta.status === 'pago' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {conta.status === 'pago' ? <CheckCircle2 size={18}/> : <FileText size={18} />}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${conta.status === 'pago' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{conta.descricao}</div>
                        <div className="text-xs text-gray-500">{conta.fornecedor}</div>
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
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal(conta); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar"><Edit3 size={16} /></button>
                      <button onClick={(e) => deleteConta(conta.id, e)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center gap-2"><Filter size={32} className="opacity-20" /><p>Nenhum registro encontrado.</p></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (CRIAR/EDITAR) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Detalhes da Conta' : 'Nova Conta a Pagar'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveConta} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrição *</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Aluguel" 
                  value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor (R$) *</label>
                  <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0,00" 
                    value={formData.valor} onChange={e => setFormData({...formData, valor: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vencimento *</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.vencimento} onChange={e => setFormData({...formData, vencimento: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fornecedor</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Imobiliária" 
                  value={formData.fornecedor} onChange={e => setFormData({...formData, fornecedor: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} >
                    <option value="">Selecione...</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Matéria Prima">Matéria Prima</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Pessoal">Pessoal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Situação (Status)</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                  <Save size={16} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// --- Card KPI Component (Reutilizável) ---
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