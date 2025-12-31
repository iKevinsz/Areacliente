'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // Importante para refresh
// Importe as actions criadas no Passo 2
import { createOrcamento, updateOrcamentoStatus } from '@/app/actions/orcamento'; 
import { 
  Search, Plus, FileText, CheckCircle2, XCircle, Clock, 
  Printer, ChevronRight, Calculator, User, Calendar, Loader2, Trash2, Save, AlertTriangle, AlertCircle
} from 'lucide-react';

// --- TIPAGENS ---
// Mantemos compatibilidade com o que vem do banco
export interface ItemOrcamento {
  id: number; // No form de criação, usamos timestamp temporário, no banco é Int
  produto: string;
  qtd: number;
  valorUnit: number;
  total: number;
}

export interface OrcamentoDTO {
  id: number;
  cliente: string;
  documento?: string | null;
  dataEmissao: Date | string;
  validade: Date | string;
  total: number;
  status: string;
  observacao?: string | null;
  itens: ItemOrcamento[];
}

interface OrcamentosClientProps {
  initialOrcamentos: OrcamentoDTO[];
}

const INITIAL_NEW_ORCAMENTO = {
  cliente: '',
  documento: '',
  validade: '',
  observacao: '',
  itens: [] as ItemOrcamento[]
};

export default function OrcamentosClient({ initialOrcamentos }: OrcamentosClientProps) {
  // Recebe dados iniciais do Server Component (Banco de Dados)
  const [orcamentos, setOrcamentos] = useState<OrcamentoDTO[]>(initialOrcamentos);
  const router = useRouter(); // Hook para recarregar a página

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  
  // Estados de UI
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoDTO | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState(INITIAL_NEW_ORCAMENTO);

  // --- RECARREGAR DADOS ---
  // Atualiza a lista local quando o Next.js revalidar os dados
  React.useEffect(() => {
    setOrcamentos(initialOrcamentos);
  }, [initialOrcamentos]);

  // --- MÁSCARA CPF/CNPJ (Mantida igual) ---
  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.slice(0, 14);
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setFormData(prev => ({ ...prev, documento: value }));
  };

  // --- LÓGICA DE ITENS (Mantida igual) ---
  const handleAddItem = () => {
    const newItem: ItemOrcamento = {
      id: Date.now(), // ID temporário apenas para o frontend
      produto: '',
      qtd: 1,
      valorUnit: 0,
      total: 0
    };
    setFormData(prev => ({ ...prev, itens: [...prev.itens, newItem] }));
  };

  const handleRemoveItem = (id: number) => {
    setFormData(prev => ({ ...prev, itens: prev.itens.filter(i => i.id !== id) }));
  };

  const handleUpdateItem = (id: number, field: keyof ItemOrcamento, value: any) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'qtd' || field === 'valorUnit') {
            updatedItem.total = Number(updatedItem.qtd) * Number(updatedItem.valorUnit);
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateTotalOrcamento = () => {
    return formData.itens.reduce((acc, item) => acc + item.total, 0);
  };

  // --- SALVAR NO BANCO DE DADOS ---
  const handleSaveOrcamento = async () => {
    // Validações
    if (!formData.cliente.trim()) {
      setValidationError("Por favor, preencha o campo Nome do Cliente.");
      return;
    }
    if (formData.itens.length === 0) {
      setShowWarningModal(true);
      return;
    }

    setIsProcessing(true);

    // Preparar payload para a Server Action
    const payload = {
        cliente: formData.cliente,
        documento: formData.documento,
        validade: formData.validade || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        observacao: formData.observacao,
        total: calculateTotalOrcamento(),
        itens: formData.itens.map(i => ({
            produto: i.produto,
            qtd: i.qtd,
            valorUnit: i.valorUnit,
            total: i.total
        }))
    };

    // Chamada ao Backend
    const result = await createOrcamento(payload);

    if (result.success) {
        setIsCreating(false);
        setFormData(INITIAL_NEW_ORCAMENTO);
        router.refresh(); // Força o Next.js a buscar os dados novos no servidor
    } else {
        setValidationError("Erro ao salvar no banco de dados. Tente novamente.");
    }
    
    setIsProcessing(false);
  };

  // --- ATUALIZAR STATUS NO BANCO ---
  const handleStatusChange = async (novoStatus: 'aprovado' | 'rejeitado') => {
    if (!selectedOrcamento) return;
    setIsProcessing(true);

    const result = await updateOrcamentoStatus(selectedOrcamento.id, novoStatus);

    if (result.success) {
        // Atualiza localmente para feedback instantâneo e depois faz refresh
        setSelectedOrcamento(prev => prev ? { ...prev, status: novoStatus } : null);
        router.refresh(); 
    } else {
        alert("Erro ao atualizar status");
    }
    
    setIsProcessing(false);
  };

  // ... (RESTANTE DO CÓDIGO DE FORMATADORES E RENDERIZAÇÃO PERMANECE IGUAL) ...
  
  const filteredOrcamentos = useMemo(() => {
    return orcamentos.filter(orc => {
      const matchSearch = orc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          orc.id.toString().includes(searchTerm);
      const matchStatus = filterStatus === 'todos' || orc.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orcamentos, searchTerm, filterStatus]);

  const totalPendentes = orcamentos.filter(o => o.status === 'pendente').reduce((acc, curr) => acc + curr.total, 0);
  const countAprovados = orcamentos.filter(o => o.status === 'aprovado').length;
  const countPendentes = orcamentos.filter(o => o.status === 'pendente').length;

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string | Date) => {
    if(!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
      pendente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      aprovado: 'bg-green-50 text-green-700 border-green-200',
      rejeitado: 'bg-red-50 text-red-700 border-red-200',
      expirado: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    const icons: any = {
      pendente: <Clock size={12} />,
      aprovado: <CheckCircle2 size={12} />,
      rejeitado: <XCircle size={12} />,
      expirado: <FileText size={12} />
    };
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit uppercase tracking-wide ${styles[status]}`}>{icons[status]} {status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">Orçamentos</h1>
          <p className="text-gray-500 text-xs md:text-sm">Gerencie cotações e propostas comerciais.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm font-bold active:scale-95 cursor-pointer"
        >
          <Plus size={18} /> Novo Orçamento
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Em Aberto (R$)" value={formatMoney(totalPendentes)} icon={<Calculator size={20} />} color="bg-yellow-50 border-yellow-100" textColor="text-yellow-700" />
        <KPICard title="Propostas Pendentes" value={countPendentes} icon={<Clock size={20} />} color="bg-blue-50 border-blue-100" textColor="text-blue-700" />
        <KPICard title="Aprovados Hoje" value={countAprovados} icon={<CheckCircle2 size={20} />} color="bg-green-50 border-green-100" textColor="text-green-700" />
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente ou nº do orçamento..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar">
            {['todos', 'pendente', 'aprovado', 'rejeitado'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s as any)} className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all cursor-pointer ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* ... (Manter código da tabela igual ao anterior) ... */}
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nº</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Emissão / Validade</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrcamentos.map((orc) => (
                <tr 
                    key={orc.id} 
                    onClick={() => setSelectedOrcamento(orc)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">#{orc.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-full text-gray-500"><User size={14}/></div>
                        <span className="text-sm font-bold text-gray-800">{orc.cliente}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{formatDate(orc.dataEmissao)}</span>
                        <span className="mx-1 text-gray-300">|</span> 
                        Até {formatDate(orc.validade)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatMoney(orc.total)}</td>
                  <td className="px-6 py-4 flex justify-center"><StatusBadge status={orc.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={20} className="ml-auto text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredOrcamentos.map((orc) => (
            <div 
                key={orc.id} 
                onClick={() => setSelectedOrcamento(orc)} 
                className="p-4 active:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center group"
            >
              <div className="flex gap-3">
                <div className={`p-2.5 rounded-xl h-fit ${orc.status === 'aprovado' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-blue-600">#{orc.id}</span>
                    <span className="text-xs text-gray-400">• {formatDate(orc.dataEmissao)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 mb-0.5">{orc.cliente}</h4>
                  <p className="text-xs font-medium text-gray-500 mb-2">{formatMoney(orc.total)}</p>
                  <StatusBadge status={orc.status} />
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DETALHES (Renderizado como antes) */}
      {selectedOrcamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Orçamento #{selectedOrcamento.id}</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={10}/> Emitido em {formatDate(selectedOrcamento.dataEmissao)}</p>
              </div>
              <button onClick={() => setSelectedOrcamento(null)} className="text-gray-400 hover:bg-gray-200 p-1 rounded-full cursor-pointer"><XCircle size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Header Status + Cliente */}
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cliente</span>
                      <div className="font-bold text-gray-800 text-lg">{selectedOrcamento.cliente}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">{selectedOrcamento.documento || "Documento não informado"}</div>
                  </div>
                  <div className="w-full md:w-48 p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-center items-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Situação</span>
                      <StatusBadge status={selectedOrcamento.status} />
                  </div>
              </div>

              {/* Itens */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><FileText size={14}/> Itens do Orçamento</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="px-4 py-3">Produto</th>
                        <th className="px-4 py-3 text-center">Qtd</th>
                        <th className="px-4 py-3 text-right">Unit.</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrcamento.itens.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700 font-medium">{item.produto}</td>
                          <td className="px-4 py-3 text-center text-gray-500">{item.qtd}</td>
                          <td className="px-4 py-3 text-right text-gray-500">{formatMoney(item.valorUnit)}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-800">{formatMoney(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-blue-50/50 px-6 py-4 flex justify-between items-center border-t border-blue-100">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-widest">Valor Total</span>
                    <span className="text-xl font-black text-blue-700">{formatMoney(selectedOrcamento.total)}</span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {selectedOrcamento.observacao && (
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                      <span className="font-bold block mb-1 text-xs uppercase opacity-70">Observações:</span>
                      {selectedOrcamento.observacao}
                  </div>
              )}

              {/* Ações */}
              <div className="pt-2 border-t border-gray-100 flex flex-col md:flex-row gap-3 justify-end">
                <button className="py-3 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Printer size={18} /> Imprimir / PDF
                </button>

                {selectedOrcamento.status === 'pendente' && (
                    <>
                        <button 
                            onClick={() => handleStatusChange('rejeitado')}
                            disabled={isProcessing}
                            className="py-3 px-6 bg-red-50 text-red-700 border border-red-100 rounded-xl font-bold hover:bg-red-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <XCircle size={18} />} Rejeitar
                        </button>
                        <button 
                            onClick={() => handleStatusChange('aprovado')}
                            disabled={isProcessing}
                            className="py-3 px-6 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18} />} Aprovar & Converter
                        </button>
                    </>
                )}
                
                {selectedOrcamento.status === 'aprovado' && (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-xl border border-green-100 font-bold text-sm">
                        <CheckCircle2 size={18}/> Orçamento já aprovado
                    </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL DE NOVO ORÇAMENTO (Usando formData e handleSaveOrcamento atualizados) */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5">
                
                {/* Modal Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2"><Plus size={20}/> Novo Orçamento</h2>
                        <p className="text-xs text-blue-100 opacity-80">Preencha os dados para gerar a proposta.</p>
                    </div>
                    <button onClick={() => setIsCreating(false)} className="text-white/80 hover:bg-white/20 p-1.5 rounded-full cursor-pointer"><XCircle size={24} /></button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    
                    {/* Dados do Cliente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome do Cliente <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: João Silva ou Empresa XYZ"
                                value={formData.cliente}
                                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Documento (CPF / CNPJ)</label>
                            <input 
                                type="text" 
                                maxLength={18}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="CPF ou CNPJ"
                                value={formData.documento}
                                onChange={handleDocumentoChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Validade da Proposta</label>
                            <input 
                                type="date" 
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.validade}
                                onChange={(e) => setFormData({...formData, validade: e.target.value})}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100"/>

                    {/* Itens */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><FileText size={16}/> Itens / Serviços</h3>
                            <button 
                                onClick={handleAddItem}
                                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
                            >
                                <Plus size={14}/> Adicionar Item
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/30">
                            {formData.itens.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 text-gray-500 text-[10px] uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-2 w-[40%]">Descrição</th>
                                            <th className="px-4 py-2 w-[15%] text-center">Qtd</th>
                                            <th className="px-4 py-2 w-[20%] text-right">Valor Unit.</th>
                                            <th className="px-4 py-2 w-[20%] text-right">Total</th>
                                            <th className="px-4 py-2 w-[5%]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {formData.itens.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Nome do produto ou serviço"
                                                        className="w-full p-1.5 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
                                                        value={item.produto}
                                                        onChange={(e) => handleUpdateItem(item.id, 'produto', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        className="w-full p-1.5 border border-gray-200 rounded text-sm text-center focus:border-blue-500 outline-none"
                                                        value={item.qtd}
                                                        onChange={(e) => handleUpdateItem(item.id, 'qtd', Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full p-1.5 border border-gray-200 rounded text-sm text-right focus:border-blue-500 outline-none"
                                                        value={item.valorUnit}
                                                        onChange={(e) => handleUpdateItem(item.id, 'valorUnit', Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-bold text-gray-700">
                                                    {formatMoney(item.total)}
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <button 
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                                                    >
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            
                            {/* Total Footer */}
                            <div className="bg-gray-100 px-6 py-3 flex justify-end items-center gap-4 border-t border-gray-200">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Estimado</span>
                                <span className="text-xl font-black text-blue-700">{formatMoney(calculateTotalOrcamento())}</span>
                            </div>
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Observações Internas</label>
                        <textarea 
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Ex: Entrega prevista para semana que vem..."
                            value={formData.observacao}
                            onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                        />
                    </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveOrcamento}
                        disabled={isProcessing}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} 
                        Salvar Orçamento
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAIS DE ERRO E AVISO --- */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">Atenção!</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Você não pode salvar um orçamento vazio.<br/>
                    Por favor, adicione pelo menos um item ou serviço antes de continuar.
                </p>
                <button 
                    onClick={() => setShowWarningModal(false)}
                    className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                    Entendi, vou adicionar
                </button>
            </div>
        </div>
      )}

      {validationError && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">Campo Obrigatório</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {validationError}
                </p>
                <button 
                    onClick={() => setValidationError(null)}
                    className="w-full py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                    OK, Entendi
                </button>
            </div>
        </div>
      )}

    </div>
  );
}

const KPICard = ({ title, value, icon, color, textColor }: any) => (
  <div className={`p-4 rounded-xl border shadow-sm flex items-center justify-between ${color}`}>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wide opacity-80 ${textColor}`}>{title}</p>
      <h3 className={`text-2xl font-black mt-1 ${textColor}`}>{value}</h3>
    </div>
    <div className="p-3 bg-white/60 rounded-full shadow-sm">{icon}</div>
  </div>
);