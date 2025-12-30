'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Calendar, ChevronRight, Filter, DollarSign, 
  AlertTriangle, CheckCircle2, Wallet, X, ArrowUpCircle, ArrowDownCircle, CreditCard 
} from 'lucide-react';
import { getMovimentacoesCaixa } from '@/app/actions/caixa'; 

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

// --- FUNÇÕES UTILITÁRIAS SEGURAS ---
const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

// Esta função garante que a data seja formatada de forma consistente
const formatDateSafe = (dateStr: string) => {
    if (!dateStr) return "-";
    // Criamos a data e garantimos que o formato seja consistente
    // O segredo é evitar depender do locale do servidor vs cliente se possível, 
    // mas aqui vamos usar uma abordagem de formatação padrão.
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + 
               date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateStr;
    }
};

// --- COMPONENTE MODAL DE MOVIMENTAÇÕES ---
function ModalMovimentacoes({ caixa, onClose }: { caixa: CaixaHistorico, onClose: () => void }) {
  const [movimentos, setMovimentos] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dados = await getMovimentacoesCaixa(caixa.id);
        setMovimentos(dados);
      } catch (err) {
        console.error("Falha ao carregar movimentações");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [caixa.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* HEADER */}
        <div className="bg-gray-50 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-bold text-gray-800 truncate">Caixa #{caixa.id}</h2>
            {/* suppressHydrationWarning é a chave para evitar o erro em datas simples */}
            <p className="text-xs text-gray-500 truncate" suppressHydrationWarning>
                {caixa.operador} | {new Date(caixa.dataFechamento).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0 cursor-pointer">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="overflow-y-auto flex-1 no-scrollbar relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-3">
               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-sm text-gray-400 font-medium">Carregando detalhes...</p>
            </div>
          ) : movimentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
               <Filter size={32} className="opacity-20 mb-2"/>
               <p className="text-sm">Nenhuma movimentação registrada.</p>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW */}
              <div className="block md:hidden space-y-2 p-4">
                 {movimentos.map((mov) => (
                    <div key={mov.id} className="p-3 border rounded-xl bg-gray-50 flex justify-between items-center">
                       <div className="min-w-0">
                          <p className="text-[10px] font-mono text-gray-400">{mov.hora}</p>
                          <p className="text-sm font-bold text-gray-700 truncate">{mov.descricao}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{mov.formaPagamento}</p>
                       </div>
                       <p className={`text-sm font-black whitespace-nowrap ${mov.valor < 0 || mov.tipo === 'SANGRIA' ? 'text-red-600' : 'text-green-600'}`}>
                          {formatMoney(mov.valor)}
                       </p>
                    </div>
                 ))}
              </div>

              {/* DESKTOP TABLE */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead className="bg-gray-50/50 sticky top-0 z-10 font-bold text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Hora</th>
                    <th className="px-5 py-3">Descrição</th>
                    <th className="px-5 py-3">Pagamento</th>
                    <th className="px-5 py-3 text-right">Valor</th>
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
                      <td className={`px-5 py-3 text-sm font-bold text-right ${mov.valor < 0 || mov.tipo === 'SANGRIA' ? 'text-red-600' : 'text-green-600'}`}>
                        {formatMoney(mov.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">Total Líquido:</span>
            <span className="text-lg md:text-xl font-black text-blue-700">{formatMoney(caixa.total)}</span>
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
  const [caixaSelecionado, setCaixaSelecionado] = useState<CaixaHistorico | null>(null);
  
  // State para controlar se o componente montou no cliente (evita hydration error)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const caixasFiltrados = useMemo(() => {
    return dadosIniciais.filter((caixa) => {
      const matchNome = caixa.operador.toLowerCase().includes(filtroNome.toLowerCase());
      const dataCaixa = caixa.dataFechamento ? caixa.dataFechamento.split('T')[0] : '';
      const matchData = filtroData ? dataCaixa === filtroData : true;
      return matchNome && matchData;
    });
  }, [dadosIniciais, filtroNome, filtroData]);

  const totalMovimentado = caixasFiltrados.reduce((acc, curr) => acc + curr.total, 0);
  const totalQuebras = caixasFiltrados.reduce((acc, curr) => acc + curr.quebra, 0);
  const mediaCaixa = caixasFiltrados.length > 0 ? totalMovimentado / caixasFiltrados.length : 0;

  // Se não montou, retorna null ou um esqueleto básico para evitar mismatch
  if (!isMounted) return <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6"></div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-black text-gray-800">Histórico de Caixas</h1>
        <p className="text-gray-500 text-xs md:text-sm">Visualize o fechamento de turnos anteriores.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Total Fechado" value={totalMovimentado} icon={<Wallet size={20} />} color="bg-blue-50 border-blue-100" textColor="text-blue-700"/>
        <KPICard title="Quebras" value={totalQuebras} icon={<AlertTriangle size={20} />} color="bg-red-50 border-red-100" textColor="text-red-700"/>
        <KPICard title="Média" value={mediaCaixa} icon={<DollarSign size={20} />} color="bg-green-50 border-green-100" textColor="text-green-700" className="sm:col-span-2 lg:col-span-1"/>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por operador..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            value={filtroNome} 
            onChange={(e) => setFiltroNome(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100 shrink-0">
            <Calendar size={16} className="text-gray-400 ml-1"/>
            <input 
              type="date" 
              className="bg-transparent text-xs outline-none cursor-pointer p-1" 
              value={filtroData} 
              onChange={(e) => setFiltroData(e.target.value)} 
            />
            {filtroData && <button onClick={() => setFiltroData('')} className="text-[10px] text-red-500 font-bold px-1 cursor-pointer">LIMPAR</button>}
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* MOBILE LIST */}
        <div className="md:hidden divide-y divide-gray-100">
           {caixasFiltrados.length > 0 ? (
             caixasFiltrados.map((caixa) => (
                <div key={caixa.id} onClick={() => setCaixaSelecionado(caixa)} className="p-4 active:bg-gray-50 transition-colors flex items-center justify-between gap-3 cursor-pointer">
                   <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-blue-600">#{caixa.id}</span>
                        <h4 className="font-bold text-gray-800 text-sm truncate">{caixa.operador}</h4>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase font-medium">{formatDateSafe(caixa.dataFechamento)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-black text-gray-800">{formatMoney(caixa.total)}</span>
                        {caixa.quebra !== 0 && (
                          <span className={`text-[10px] font-bold ${caixa.quebra < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ({caixa.quebra > 0 ? '+' : ''}{formatMoney(caixa.quebra)})
                          </span>
                        )}
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-gray-300 shrink-0" />
                </div>
             ))
           ) : <NoData />}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">ID / Operador</th>
                <th className="px-6 py-4">Abertura / Fechamento</th>
                <th className="px-6 py-4 text-center">Vendas</th>
                <th className="px-6 py-4 text-right">Saldo Final</th>
                <th className="px-6 py-4 text-right">Quebra</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {caixasFiltrados.map((caixa) => (
                <tr key={caixa.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><CheckCircle2 size={18} /></div>
                      <div className="min-w-0"><p className="text-sm font-bold text-gray-800">#{caixa.id}</p><p className="text-xs text-gray-500 truncate">{caixa.operador}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {/* suppressHydrationWarning evita erro se o servidor e cliente tiverem fusos diferentes */}
                    <p className="text-[11px] text-gray-600 font-medium" suppressHydrationWarning>A: {formatDateSafe(caixa.dataAbertura)}</p>
                    <p className="text-[11px] text-gray-600 font-medium" suppressHydrationWarning>F: {formatDateSafe(caixa.dataFechamento)}</p>
                  </td>
                  <td className="px-6 py-4 text-center"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{caixa.qtdVendas}</span></td>
                  <td className="px-6 py-4 text-right font-bold text-gray-800 text-sm">{formatMoney(caixa.total)}</td>
                  <td className={`px-6 py-4 text-right text-xs font-bold ${caixa.quebra < 0 ? 'text-red-600' : 'text-green-600'}`}>{caixa.quebra !== 0 ? formatMoney(caixa.quebra) : '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setCaixaSelecionado(caixa)} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {caixaSelecionado && <ModalMovimentacoes caixa={caixaSelecionado} onClose={() => setCaixaSelecionado(null)} />}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const KPICard = ({ title, value, icon, color, textColor, className }: any) => (
  <div className={`p-4 md:p-5 rounded-xl border shadow-sm flex items-center justify-between ${color} ${className}`}>
    <div className="min-w-0">
      <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wide opacity-80 ${textColor}`}>{title}</p>
      <h3 className={`text-lg md:text-2xl font-black mt-1 truncate ${textColor}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </h3>
    </div>
    <div className="p-2 md:p-3 rounded-full bg-white bg-opacity-60 shadow-sm shrink-0 ml-2">{icon}</div>
  </div>
);

const NoData = () => (
  <div className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2 w-full">
    <Filter size={32} className="opacity-20" />
    <p className="text-sm font-medium">Nenhum registro encontrado.</p>
  </div>
);