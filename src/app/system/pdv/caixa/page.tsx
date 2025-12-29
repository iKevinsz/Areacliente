'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, User, Clock, 
  CheckCircle2, XCircle, Eye, X, ArrowUpCircle, ArrowDownCircle, AlertCircle, DollarSign
} from 'lucide-react';

// --- TIPAGEM ---
interface Caixa {
  id: string;
  operador: string;
  abertura: string;
  fechamento: string;
  saldoInicial: number;
  saldoAtual: number;
  status: 'aberto' | 'fechado';
}

interface Movimentacao {
  id: string;
  hora: string;
  descricao: string;
  tipo: 'entrada' | 'saida'; // Venda/Suprimento vs Sangria/Estorno
  categoria: 'Venda' | 'Suprimento' | 'Sangria' | 'Abertura';
  formaPagamento: string;
  valor: number;
}

// --- DADOS MOCKADOS (CAIXAS) ---
const MOCK_CAIXAS: Caixa[] = [
  { id: 'CX-001', operador: 'Kevin ', abertura: '26/12/2025 08:00', fechamento: '-', saldoInicial: 150.00, saldoAtual: 1450.00, status: 'aberto' },
  { id: 'CX-002', operador: 'Juylianne', abertura: '25/12/2025 14:00', fechamento: '25/12/2025 22:00', saldoInicial: 100.00, saldoAtual: 2100.50, status: 'fechado' },
  { id: 'CX-003', operador: 'João', abertura: '25/12/2025 08:00', fechamento: '25/12/2025 13:50', saldoInicial: 150.00, saldoAtual: 890.00, status: 'fechado' },
];

// --- DADOS MOCKADOS (MOVIMENTAÇÕES) ---
// Em um app real, você buscaria isso do backend baseado no ID do caixa
const MOCK_MOVIMENTACOES: Movimentacao[] = [
  { id: '1', hora: '08:00', descricao: 'Abertura de Caixa', tipo: 'entrada', categoria: 'Abertura', formaPagamento: '-', valor: 150.00 },
  { id: '2', hora: '08:15', descricao: 'Venda #1020', tipo: 'entrada', categoria: 'Venda', formaPagamento: 'Dinheiro', valor: 45.90 },
  { id: '3', hora: '09:30', descricao: 'Venda #1021', tipo: 'entrada', categoria: 'Venda', formaPagamento: 'Pix', valor: 120.00 },
  { id: '4', hora: '10:00', descricao: 'Pagamento Fornecedor (Pão)', tipo: 'saida', categoria: 'Sangria', formaPagamento: 'Dinheiro', valor: 50.00 },
  { id: '5', hora: '11:45', descricao: 'Venda #1022', tipo: 'entrada', categoria: 'Venda', formaPagamento: 'Cartão Crédito', valor: 250.00 },
  { id: '6', hora: '13:00', descricao: 'Adicional de Troco', tipo: 'entrada', categoria: 'Suprimento', formaPagamento: 'Dinheiro', valor: 100.00 },
];

export default function ConsultarCaixaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');
  
  // Estado para controlar qual caixa está selecionado (Modal)
  const [selectedCaixa, setSelectedCaixa] = useState<Caixa | null>(null);

  // Lógica simples de filtro
  const filteredCaixas = MOCK_CAIXAS.filter(caixa => {
    const matchUser = caixa.operador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = dataFiltro ? caixa.abertura.includes(dataFiltro.split('-').reverse().join('/')) : true; 
    return matchUser && matchDate;
  });

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Cálculos do Modal
  const totalEntradas = MOCK_MOVIMENTACOES.filter(m => m.tipo === 'entrada').reduce((acc, curr) => acc + curr.valor, 0);
  const totalSaidas = MOCK_MOVIMENTACOES.filter(m => m.tipo === 'saida').reduce((acc, curr) => acc + curr.valor, 0);
  // O saldo final no modal é calculado com base nas movimentações mockadas para exemplo
  const saldoCalculado = totalEntradas - totalSaidas;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Consultar Caixa
          </h1>
          <p className="text-gray-500 text-sm">Histórico de abertura e fechamento de caixas.</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por operador..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-gray-600 flex items-center gap-1"><Calendar size={16}/> Data:</span>
            <input 
                type="date" 
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
            />
        </div>
      </div>

      {/* TABELA PRINCIPAL */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID / Operador</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Abertura</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Fechamento</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Saldo Inicial</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Saldo Final</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCaixas.map((caixa) => (
              <tr key={caixa.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{caixa.operador}</p>
                            <p className="text-xs text-gray-400">{caixa.id}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Clock size={14} className="text-green-600" /> {caixa.abertura}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    {caixa.fechamento !== '-' ? (
                        <div className="flex items-center gap-2"><Clock size={14} className="text-red-600" /> {caixa.fechamento}</div>
                    ) : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    {formatMoney(caixa.saldoInicial)}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {formatMoney(caixa.saldoAtual)}
                </td>
                <td className="px-6 py-4 text-center">
                    {caixa.status === 'aberto' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Aberto
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Fechado
                        </span>
                    )}
                </td>
                <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => setSelectedCaixa(caixa)}
                        className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors" 
                        title="Ver Movimentações"
                    >
                        <Eye size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL DE DETALHES DAS MOVIMENTAÇÕES --- */}
      {selectedCaixa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header Modal */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Detalhes do Caixa: <span className="text-blue-600">{selectedCaixa.id}</span>
                        </h2>
                        <p className="text-sm text-gray-500">Operador: {selectedCaixa.operador} • Aberto em: {selectedCaixa.abertura}</p>
                    </div>
                    <button onClick={() => setSelectedCaixa(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body Modal (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Resumo Financeiro (Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Saldo Inicial</span>
                            <div className="text-lg font-bold text-gray-800 mt-1">{formatMoney(selectedCaixa.saldoInicial)}</div>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                            <span className="text-xs font-semibold text-green-700 uppercase flex items-center gap-1"><ArrowUpCircle size={14}/> Entradas</span>
                            <div className="text-lg font-bold text-green-700 mt-1">{formatMoney(totalEntradas)}</div>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                            <span className="text-xs font-semibold text-red-700 uppercase flex items-center gap-1"><ArrowDownCircle size={14}/> Saídas</span>
                            <div className="text-lg font-bold text-red-700 mt-1">{formatMoney(totalSaidas)}</div>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <span className="text-xs font-semibold text-blue-700 uppercase flex items-center gap-1"><DollarSign size={14}/> Saldo Final</span>
                            <div className="text-lg font-bold text-blue-700 mt-1">{formatMoney(saldoCalculado)}</div>
                        </div>
                    </div>

                    {/* Tabela de Movimentações */}
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-gray-400"/> Histórico de Movimentações
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Hora</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Pagamento</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_MOVIMENTACOES.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">{mov.hora}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">{mov.descricao}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                                                mov.tipo === 'entrada' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                                {mov.categoria}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{mov.formaPagamento}</td>
                                        <td className={`px-4 py-3 text-sm font-bold text-right ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                            {mov.tipo === 'saida' && "- "}{formatMoney(mov.valor)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                
                {/* Footer Modal */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={() => setSelectedCaixa(null)} 
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}