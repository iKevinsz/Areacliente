'use client';

import React, { useState } from 'react';
import { 
  Search, Calendar, User, Clock, 
  Eye, X, ArrowUpCircle, ArrowDownCircle, DollarSign
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
  tipo: 'entrada' | 'saida';
  categoria: 'Venda' | 'Suprimento' | 'Sangria' | 'Abertura';
  formaPagamento: string;
  valor: number;
}

// --- DADOS MOCKADOS ---
const MOCK_CAIXAS: Caixa[] = [
  { id: 'CX-001', operador: 'Kevin ', abertura: '26/12/2025 08:00', fechamento: '-', saldoInicial: 150.00, saldoAtual: 1450.00, status: 'aberto' },
  { id: 'CX-002', operador: 'Juylianne', abertura: '25/12/2025 14:00', fechamento: '25/12/2025 22:00', saldoInicial: 100.00, saldoAtual: 2100.50, status: 'fechado' },
  { id: 'CX-003', operador: 'João', abertura: '25/12/2025 08:00', fechamento: '25/12/2025 13:50', saldoInicial: 150.00, saldoAtual: 890.00, status: 'fechado' },
];

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
  const [selectedCaixa, setSelectedCaixa] = useState<Caixa | null>(null);

  const filteredCaixas = MOCK_CAIXAS.filter(caixa => {
    const matchUser = caixa.operador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = dataFiltro ? caixa.abertura.includes(dataFiltro.split('-').reverse().join('/')) : true; 
    return matchUser && matchDate;
  });

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const totalEntradas = MOCK_MOVIMENTACOES.filter(m => m.tipo === 'entrada').reduce((acc, curr) => acc + curr.valor, 0);
  const totalSaidas = MOCK_MOVIMENTACOES.filter(m => m.tipo === 'saida').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoCalculado = totalEntradas - totalSaidas;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          Consultar Caixa
        </h1>
        <p className="text-gray-500 text-sm">Histórico de abertura e fechamento de caixas.</p>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por operador..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400 shrink-0"/>
            <input 
                type="date" 
                className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
            />
        </div>
      </div>

      {/* TABELA PRINCIPAL (Desktop) / CARDS (Mobile) */}
      <div className="bg-white md:border border-gray-200 md:rounded-xl shadow-sm overflow-hidden">
        {/* View Mobile (Cards) */}
        <div className="md:hidden space-y-4">
          {filteredCaixas.map((caixa) => (
            <div key={caixa.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-500"><User size={16} /></div>
                  <div>
                    <p className="font-bold text-gray-800">{caixa.operador}</p>
                    <p className="text-xs text-gray-400">{caixa.id}</p>
                  </div>
                </div>
                {caixa.status === 'aberto' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-200">Aberto</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">Fechado</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Abertura</p>
                  <p className="text-gray-600">{caixa.abertura}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fechamento</p>
                  <p className="text-gray-600">{caixa.fechamento}</p>
                </div>
                <div>
                  <p className="text-gray-400">Saldo Atual</p>
                  <p className="font-bold text-gray-800">{formatMoney(caixa.saldoAtual)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCaixa(caixa)}
                className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Eye size={16} /> Ver Movimentações
              </button>
            </div>
          ))}
        </div>

        {/* View Desktop (Table) */}
        <div className="hidden md:block overflow-x-auto">
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
                        <div className="p-2 bg-gray-100 rounded-full text-gray-500"><User size={16} /></div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{caixa.operador}</p>
                            <p className="text-xs text-gray-400">{caixa.id}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2 truncate"><Clock size={14} className="text-green-600 shrink-0" /> {caixa.abertura}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                      {caixa.fechamento !== '-' ? (
                          <div className="flex items-center gap-2 truncate"><Clock size={14} className="text-red-600 shrink-0" /> {caixa.fechamento}</div>
                      ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatMoney(caixa.saldoInicial)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatMoney(caixa.saldoAtual)}</td>
                  <td className="px-6 py-4 text-center">
                      {caixa.status === 'aberto' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Aberto
                          </span>
                      ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">Fechado</span>
                      )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                      <button onClick={() => setSelectedCaixa(caixa)} className="hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RESPONSIVO */}
      {selectedCaixa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[95vh] md:h-auto md:max-h-[90vh]">
                
                {/* Header Modal */}
                <div className="bg-gray-50 px-4 md:px-6 py-4 border-b flex justify-between items-center shrink-0">
                    <div className="min-w-0">
                        <h2 className="text-base md:text-lg font-bold text-gray-800 truncate">
                            Caixa: <span className="text-blue-600">{selectedCaixa.id}</span>
                        </h2>
                        <p className="text-xs text-gray-500 truncate">{selectedCaixa.operador} • {selectedCaixa.abertura}</p>
                    </div>
                    <button onClick={() => setSelectedCaixa(null)} className="text-gray-400 hover:text-gray-600 p-2"><X size={24} /></button>
                </div>

                {/* Body Modal */}
                <div className="p-4 md:p-6 overflow-y-auto space-y-6">
                    
                    {/* Resumo Financeiro - Grid Adaptável */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase block">Início</span>
                            <div className="text-sm md:text-lg font-bold text-gray-800 mt-1 truncate">{formatMoney(selectedCaixa.saldoInicial)}</div>
                        </div>
                        <div className="p-3 md:p-4 bg-green-50 border border-green-100 rounded-lg">
                            <span className="text-[10px] md:text-xs font-semibold text-green-700 uppercase flex items-center gap-1"><ArrowUpCircle size={12}/> Entradas</span>
                            <div className="text-sm md:text-lg font-bold text-green-700 mt-1 truncate">{formatMoney(totalEntradas)}</div>
                        </div>
                        <div className="p-3 md:p-4 bg-red-50 border border-red-100 rounded-lg">
                            <span className="text-[10px] md:text-xs font-semibold text-red-700 uppercase flex items-center gap-1"><ArrowDownCircle size={12}/> Saídas</span>
                            <div className="text-sm md:text-lg font-bold text-red-700 mt-1 truncate">{formatMoney(totalSaidas)}</div>
                        </div>
                        <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <span className="text-[10px] md:text-xs font-semibold text-blue-700 uppercase flex items-center gap-1"><DollarSign size={12}/> Final</span>
                            <div className="text-sm md:text-lg font-bold text-blue-700 mt-1 truncate">{formatMoney(saldoCalculado)}</div>
                        </div>
                    </div>

                    {/* Tabela de Movimentações (Scrollable Interno) */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                          <Clock size={18} className="text-gray-400"/> Movimentações
                      </h3>
                      <div className="border border-gray-200 rounded-lg overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[500px]">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                  <tr>
                                      <th className="px-4 py-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                      <th className="px-4 py-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                                      <th className="px-4 py-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                      <th className="px-4 py-3 text-[10px] font-medium text-gray-500 uppercase tracking-wider text-right">Valor</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {MOCK_MOVIMENTACOES.map((mov) => (
                                      <tr key={mov.id} className="text-xs">
                                          <td className="px-4 py-3 text-gray-600 font-mono">{mov.hora}</td>
                                          <td className="px-4 py-3 text-gray-800 font-medium">{mov.descricao}</td>
                                          <td className="px-4 py-3">
                                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                  mov.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                              }`}>
                                                  {mov.categoria}
                                              </span>
                                          </td>
                                          <td className={`px-4 py-3 font-bold text-right ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                              {mov.tipo === 'saida' && "- "}{formatMoney(mov.valor)}
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="bg-gray-50 px-4 py-4 border-t flex justify-end shrink-0">
                    <button onClick={() => setSelectedCaixa(null)} className="w-full sm:w-auto px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}