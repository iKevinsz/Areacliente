'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, FileText, CheckCircle2, XCircle, Clock, 
  Printer, ChevronRight, Calculator, User, Calendar, Loader2, ArrowRight
} from 'lucide-react';

// --- TIPAGEM ---
export interface ItemOrcamento {
  id: number;
  produto: string;
  qtd: number;
  valorUnit: number;
  total: number;
}

export interface OrcamentoDTO {
  id: number;
  cliente: string;
  documento?: string; // CPF/CNPJ
  dataEmissao: string;
  validade: string;
  total: number;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';
  observacao?: string;
  itens: ItemOrcamento[];
}

interface OrcamentosClientProps {
  initialOrcamentos: OrcamentoDTO[];
}

export default function OrcamentosClient({ initialOrcamentos }: OrcamentosClientProps) {
  const [orcamentos, setOrcamentos] = useState<OrcamentoDTO[]>(initialOrcamentos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoDTO | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtros
  const filteredOrcamentos = useMemo(() => {
    return orcamentos.filter(orc => {
      const matchSearch = orc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          orc.id.toString().includes(searchTerm);
      const matchStatus = filterStatus === 'todos' || orc.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orcamentos, searchTerm, filterStatus]);

  // KPIs
  const totalPendentes = orcamentos.filter(o => o.status === 'pendente').reduce((acc, curr) => acc + curr.total, 0);
  const countAprovados = orcamentos.filter(o => o.status === 'aprovado').length;
  const countPendentes = orcamentos.filter(o => o.status === 'pendente').length;

  // Ações Simuladas
  const handleStatusChange = (novoStatus: 'aprovado' | 'rejeitado') => {
    if (!selectedOrcamento) return;
    setIsProcessing(true);

    // AQUI ENTRARIA A SERVER ACTION: await updateOrcamentoStatus(selectedOrcamento.id, novoStatus);

    setTimeout(() => {
      setOrcamentos(prev => prev.map(o => o.id === selectedOrcamento.id ? { ...o, status: novoStatus } : o));
      setIsProcessing(false);
      setSelectedOrcamento(prev => prev ? { ...prev, status: novoStatus } : null);
    }, 1000);
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      pendente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      aprovado: 'bg-green-50 text-green-700 border-green-200',
      rejeitado: 'bg-red-50 text-red-700 border-red-200',
      expirado: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    const icons = {
      pendente: <Clock size={12} />,
      aprovado: <CheckCircle2 size={12} />,
      rejeitado: <XCircle size={12} />,
      expirado: <FileText size={12} />
    };
    // @ts-ignore
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
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm font-bold active:scale-95 cursor-pointer">
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

      {/* MODAL DE DETALHES */}
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