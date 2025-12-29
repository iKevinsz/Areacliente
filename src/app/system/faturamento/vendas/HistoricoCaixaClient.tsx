'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, ChevronRight, Filter, DollarSign, 
  AlertTriangle, CheckCircle2, Wallet, X, ArrowUpCircle, ArrowDownCircle, CreditCard 
} from 'lucide-react';

// --- TIPAGENS ---
interface CaixaHistorico {
  id: number;
  operador: string;
  dataAbertura: string;
  dataFechamento: string;
  saldoInicial: number;
  total: number;
  quebra: number;
  qtdVendas: number;
}

interface Movimentacao {
  id: number;
  hora: string;
  descricao: string;
  tipo: 'VENDA' | 'SANGRIA' | 'SUPRIMENTO';
  formaPagamento: string;
  valor: number;
}

// --- MOCK DE DADOS INTELIGENTE ---
const simularBuscaMovimentos = (caixaId: number): Movimentacao[] => {
  switch (caixaId) {
    case 1: // CENÁRIO: Dia Normal de Muito Movimento
      return [
        { id: 1, hora: '08:00', descricao: 'Fundo de Troco', tipo: 'SUPRIMENTO', formaPagamento: 'Dinheiro', valor: 150.00 },
        { id: 2, hora: '09:30', descricao: 'Venda Balcão (Pães)', tipo: 'VENDA', formaPagamento: 'Dinheiro', valor: 85.00 },
        { id: 3, hora: '10:15', descricao: 'Encomenda: 2 Bolos', tipo: 'VENDA', formaPagamento: 'Crédito', valor: 250.00 },
        { id: 4, hora: '12:30', descricao: 'Almoço (Salgados)', tipo: 'VENDA', formaPagamento: 'Dinheiro', valor: 180.00 },
        { id: 5, hora: '14:00', descricao: 'Pgto Gás (Sangria)', tipo: 'SANGRIA', formaPagamento: 'Dinheiro', valor: -120.00 },
        { id: 6, hora: '17:00', descricao: 'Pico da Tarde', tipo: 'VENDA', formaPagamento: 'Dinheiro', valor: 450.00 },
        { id: 7, hora: '18:00', descricao: 'Fechamento (Diversos)', tipo: 'VENDA', formaPagamento: 'Débito', valor: 1455.00 },
      ]; // Total Calculado: 2450.00

    case 2: // CENÁRIO: Quebra de Caixa (Faltou R$ 15,00)
      return [
        { id: 10, hora: '08:00', descricao: 'Fundo de Troco', tipo: 'SUPRIMENTO', formaPagamento: 'Dinheiro', valor: 200.00 },
        { id: 11, hora: '10:00', descricao: 'Vendas Manhã', tipo: 'VENDA', formaPagamento: 'Dinheiro', valor: 500.00 },
        { id: 12, hora: '13:00', descricao: 'Vendas Tarde', tipo: 'VENDA', formaPagamento: 'Dinheiro', valor: 800.00 },
        { id: 13, hora: '16:00', descricao: 'Encomenda Grande', tipo: 'VENDA', formaPagamento: 'Pix', valor: 500.00 },
      ]; // Total Sistema: 2000.00 | Na gaveta só tem 1985.00

    case 3: // CENÁRIO: Sobra de Caixa (Passou R$ 10,00)
      return [
        { id: 20, hora: '13:00', descricao: 'Fundo de Troco Tarde', tipo: 'SUPRIMENTO', formaPagamento: 'Dinheiro', valor: 100.00 },
        { id: 21, hora: '15:00', descricao: 'Venda Atacado Bebidas', tipo: 'VENDA', formaPagamento: 'Crédito', valor: 2500.00 },
        { id: 22, hora: '19:00', descricao: 'Venda Balcão Noite', tipo: 'VENDA', formaPagamento: 'Débito', valor: 1000.00 },
        { id: 23, hora: '21:00', descricao: 'Venda Final', tipo: 'VENDA', formaPagamento: 'Dinheiro', valor: 1500.00 },
      ]; // Total Sistema: 5100.00 | Na gaveta tem 5110.00

    default: // CENÁRIO GENÉRICO (Para IDs novos)
      return [
        { id: 99, hora: '08:00', descricao: 'Abertura Padrão', tipo: 'SUPRIMENTO', formaPagamento: 'Dinheiro', valor: 100.00 },
        { id: 100, hora: '12:00', descricao: 'Vendas do Dia', tipo: 'VENDA', formaPagamento: 'Diversos', valor: 500.00 },
      ];
  }
};

// --- DADOS DA TABELA (PRINCIPAL) ---
// Coloque isso onde você renderiza o componente <HistoricoCaixaClient />
const dadosExemplo = [
  {
    id: 1,
    operador: 'Maria Silva',
    dataAbertura: '2025-12-28T08:00:00',
    dataFechamento: '2025-12-28T18:00:00',
    saldoInicial: 150.00,
    total: 2450.00, // Bate exato com a soma
    quebra: 0.00,
    qtdVendas: 7
  },
  {
    id: 2,
    operador: 'Joao Souza',
    dataAbertura: '2025-12-28T08:00:00',
    dataFechamento: '2025-12-28T18:30:00',
    saldoInicial: 200.00,
    total: 1985.00, // O sistema somou 2000, mas aqui tem 1985
    quebra: -15.00, // Ops! Faltou dinheiro
    qtdVendas: 4
  },
  {
    id: 3,
    operador: 'Ana Costa',
    dataAbertura: '2025-12-28T13:00:00',
    dataFechamento: '2025-12-28T22:00:00',
    saldoInicial: 100.00,
    total: 5110.00, // O sistema somou 5100, mas aqui tem 5110
    quebra: 10.00, // Oba! Sobrou dinheiro
    qtdVendas: 4
  }
];

// --- COMPONENTE MODAL ---
function ModalMovimentacoes({ caixa, onClose }: { caixa: CaixaHistorico, onClose: () => void }) {
  const movimentos = useMemo(() => simularBuscaMovimentos(caixa.id), [caixa.id]);
  
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Detalhamento do Caixa #{caixa.id}</h2>
            <p className="text-sm text-gray-500">Operador: {caixa.operador} | {new Date(caixa.dataFechamento).toLocaleDateString('pt-BR')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-0 flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Hora</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Pagamento</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movimentos.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-600 font-mono">{mov.hora}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {mov.tipo === 'VENDA' && <ArrowUpCircle size={16} className="text-green-500" />}
                      {mov.tipo === 'SUPRIMENTO' && <Wallet size={16} className="text-blue-500" />}
                      {mov.tipo === 'SANGRIA' && <ArrowDownCircle size={16} className="text-red-500" />}
                      <span className="text-sm font-medium text-gray-700">{mov.descricao}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 flex items-center gap-1">
                    <CreditCard size={14} /> {mov.formaPagamento}
                  </td>
                  <td className={`px-5 py-3 text-sm font-bold text-right ${mov.valor < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatMoney(mov.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Total de {movimentos.length} movimentações registradas.
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase font-bold mr-2">Saldo Final Calculado:</span>
            <span className="text-lg font-bold text-blue-700">{formatMoney(caixa.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL ---
export default function HistoricoCaixaClient({ dadosIniciais = [] }: { dadosIniciais: CaixaHistorico[] }) {
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroData, setFiltroData] = useState('');
  
  // Estado para controlar qual caixa está sendo visualizado no modal
  const [caixaSelecionado, setCaixaSelecionado] = useState<CaixaHistorico | null>(null);

  // --- LÓGICA DE FILTRO ---
  const caixasFiltrados = useMemo(() => {
    return dadosIniciais.filter((caixa) => {
      const matchNome = caixa.operador.toLowerCase().includes(filtroNome.toLowerCase());
      const dataCaixa = caixa.dataFechamento ? caixa.dataFechamento.split('T')[0] : '';
      const matchData = filtroData ? dataCaixa === filtroData : true;
      return matchNome && matchData;
    });
  }, [dadosIniciais, filtroNome, filtroData]);

  // --- KPIs ---
  const totalMovimentado = caixasFiltrados.reduce((acc, curr) => acc + curr.total, 0);
  const totalQuebras = caixasFiltrados.reduce((acc, curr) => acc + curr.quebra, 0);
  const mediaCaixa = caixasFiltrados.length > 0 ? totalMovimentado / caixasFiltrados.length : 0;

  // --- FORMATADORES ---
  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Histórico de Caixas</h1>
          <p className="text-gray-500 text-sm">Visualize o fechamento e conferência de turnos anteriores.</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-blue-700 opacity-80">Total Fechado (Período)</p><h3 className="text-2xl font-bold mt-1 text-blue-700">{formatMoney(totalMovimentado)}</h3></div>
          <div className="p-3 rounded-full bg-white text-blue-600 shadow-sm"><Wallet size={24} /></div>
        </div>
        <div className="p-5 rounded-xl border border-red-100 bg-red-50/50 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-red-700 opacity-80">Quebras/Diferenças</p><h3 className="text-2xl font-bold mt-1 text-red-700">{formatMoney(totalQuebras)}</h3></div>
          <div className="p-3 rounded-full bg-white text-red-600 shadow-sm"><AlertTriangle size={24} /></div>
        </div>
        <div className="p-5 rounded-xl border border-green-100 bg-green-50/50 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-wide text-green-700 opacity-80">Média por Fechamento</p><h3 className="text-2xl font-bold mt-1 text-green-700">{formatMoney(mediaCaixa)}</h3></div>
          <div className="p-3 rounded-full bg-white text-green-600 shadow-sm"><DollarSign size={24} /></div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por operador..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            value={filtroNome} 
            onChange={(e) => setFiltroNome(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto bg-gray-50 p-2 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Calendar size={14}/> Data:</span>
            <input 
              type="date" 
              className="bg-white border border-gray-200 text-gray-600 text-xs rounded px-2 py-1.5 outline-none cursor-pointer" 
              value={filtroData} 
              onChange={(e) => setFiltroData(e.target.value)} 
            />
            {filtroData && <button onClick={() => setFiltroData('')} className="text-xs text-red-500 hover:text-red-700 underline ml-1 cursor-pointer">Limpar</button>}
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID / Operador</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Abertura</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Fechamento</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Vendas</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Saldo Final</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Quebra</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {caixasFiltrados.length > 0 ? (
              caixasFiltrados.map((caixa) => (
                <tr key={caixa.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">#{caixa.id}</div>
                        <div className="text-xs text-gray-500">{caixa.operador}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                    {formatDateTime(caixa.dataAbertura)}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                    {formatDateTime(caixa.dataFechamento)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                      {caixa.qtdVendas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800">
                    {formatMoney(caixa.total)}
                  </td>
                  <td className={`px-6 py-4 text-right text-xs font-bold ${caixa.quebra < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {caixa.quebra !== 0 ? formatMoney(caixa.quebra) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Botão que abre o modal */}
                    <button 
                      onClick={() => setCaixaSelecionado(caixa)}
                      className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-sm"
                    >
                      Ver Vendas <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter size={32} className="opacity-20" />
                    <p>Nenhum caixa encontrado com estes filtros.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DO MODAL */}
      {caixaSelecionado && (
        <ModalMovimentacoes 
          caixa={caixaSelecionado} 
          onClose={() => setCaixaSelecionado(null)} 
        />
      )}

    </div>
  );
}