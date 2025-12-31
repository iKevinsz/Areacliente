'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, Calendar, FileText, CheckCircle2, AlertTriangle, 
  X, Printer, Download, RefreshCw, ChevronRight, FileX, Loader2
} from 'lucide-react';

// --- TIPAGEM (Compatível com seu Prisma futuramente) ---
export interface PedidoNfeDTO {
  id: number;
  clienteNome: string;
  clienteDoc: string; // CPF ou CNPJ
  data: string;
  total: number;
  status: 'pendente' | 'autorizada' | 'erro' | 'cancelada';
  nfeChave?: string;
  itens: { produto: string; qtd: number; valor: number }[];
}

interface PedidosNfeClientProps {
  initialPedidos: PedidoNfeDTO[];
}

export default function PedidosNfeClient({ initialPedidos }: PedidosNfeClientProps) {
  const [pedidos, setPedidos] = useState<PedidoNfeDTO[]>(initialPedidos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'autorizada' | 'erro'>('todos');
  
  const [selectedPedido, setSelectedPedido] = useState<PedidoNfeDTO | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // NOVO ESTADO: Controle de atualização global Sefaz
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Filtros
  const filteredPedidos = useMemo(() => {
    return pedidos.filter(p => {
      const matchSearch = p.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toString().includes(searchTerm) ||
                          p.clienteDoc.includes(searchTerm);
      const matchStatus = filterStatus === 'todos' || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [pedidos, searchTerm, filterStatus]);

  // KPIs
  const totalPendentes = pedidos.filter(p => p.status === 'pendente').length;
  const totalAutorizadas = pedidos.filter(p => p.status === 'autorizada').length;
  const totalErros = pedidos.filter(p => p.status === 'erro').length;

  // --- NOVA FUNÇÃO: Simulação de Atualização Sefaz ---
  const handleUpdateSefaz = () => {
    if (isUpdating) return;
    setIsUpdating(true);

    // Simula delay de rede (Conexão API Sefaz)
    setTimeout(() => {
        setIsUpdating(false);
        setFeedback({ 
            type: 'success', 
            msg: 'Sincronização com Sefaz concluída! Status das notas atualizados.' 
        });
        // Aqui você poderia recarregar os dados do servidor se fosse real
        // router.refresh(); 
    }, 2500);
  };

  // Simulação de Emissão de NFe Individual
  const handleEmitirNfe = async () => {
    if (!selectedPedido) return;
    setIsGenerating(true);

    // AQUI ENTRARIA A CHAMADA PARA A SERVER ACTION REAL
    // await emitirNfeAction(selectedPedido.id);
    
    setTimeout(() => {
      setIsGenerating(false);
      // Atualiza estado localmente para simular sucesso
      setPedidos(prev => prev.map(p => p.id === selectedPedido.id ? { ...p, status: 'autorizada', nfeChave: '352309...' } : p));
      setSelectedPedido(null);
      setFeedback({ type: 'success', msg: `NFe do pedido #${selectedPedido.id} emitida com sucesso!` });
    }, 2000);
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR');

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      pendente: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      autorizada: 'bg-green-50 text-green-700 border-green-200',
      erro: 'bg-red-50 text-red-700 border-red-200',
      cancelada: 'bg-gray-100 text-gray-500 border-gray-200',
    };
    const icons = {
      pendente: <AlertTriangle size={12} />,
      autorizada: <CheckCircle2 size={12} />,
      erro: <FileX size={12} />,
      cancelada: <X size={12} />
    };
    // @ts-ignore
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit ${styles[status]}`}>{icons[status]} {status.toUpperCase()}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">Emissão de NFe</h1>
          <p className="text-gray-500 text-xs md:text-sm">Gerencie e emita notas fiscais dos seus pedidos.</p>
        </div>
        
        {/* BOTÃO ATUALIZADO COM A LÓGICA DE SIMULAÇÃO */}
        <button 
            onClick={handleUpdateSefaz}
            disabled={isUpdating}
            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isUpdating ? "animate-spin text-blue-600" : ""} /> 
          {isUpdating ? 'Sincronizando...' : 'Atualizar Sefaz'}
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Pendentes" value={totalPendentes} icon={<FileText size={20} />} color="bg-yellow-50 border-yellow-100" textColor="text-yellow-700" />
        <KPICard title="Autorizadas Hoje" value={totalAutorizadas} icon={<CheckCircle2 size={20} />} color="bg-green-50 border-green-100" textColor="text-green-700" />
        <KPICard title="Com Erro" value={totalErros} icon={<AlertTriangle size={20} />} color="bg-red-50 border-red-100" textColor="text-red-700" />
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, CPF/CNPJ ou ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar">
            {['todos', 'pendente', 'autorizada', 'erro'].map((s) => (
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pedido</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status Sefaz</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPedidos.map((pedido) => (
                <tr 
                    key={pedido.id} 
                    onClick={() => setSelectedPedido(pedido)}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold group-hover:text-blue-700">#{pedido.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{pedido.clienteNome}</div>
                    <div className="text-xs text-gray-400 font-mono">{pedido.clienteDoc}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{formatDate(pedido.data)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatMoney(pedido.total)}</td>
                  <td className="px-6 py-4 flex justify-center"><StatusBadge status={pedido.status} /></td>
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
          {filteredPedidos.map((pedido) => (
            <div 
                key={pedido.id} 
                onClick={() => setSelectedPedido(pedido)} 
                className="p-4 active:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center group"
            >
              <div className="flex gap-3">
                <div className={`p-2.5 rounded-xl h-fit ${pedido.status === 'autorizada' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-blue-600">#{pedido.id}</span>
                    <span className="text-xs text-gray-400">• {formatDate(pedido.data)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 mb-0.5">{pedido.clienteNome}</h4>
                  <p className="text-xs font-medium text-gray-500 mb-2">{formatMoney(pedido.total)}</p>
                  <StatusBadge status={pedido.status} />
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE DETALHES/EMISSÃO */}
      {selectedPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Detalhes da NFe</h2>
                <p className="text-xs text-gray-500">Pedido #{selectedPedido.id}</p>
              </div>
              <button onClick={() => setSelectedPedido(null)} className="text-gray-400 hover:bg-gray-200 p-1 rounded-full cursor-pointer"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Status Header */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase">Status Atual</span>
                <StatusBadge status={selectedPedido.status} />
              </div>

              {/* Dados do Cliente */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Destinatário</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Nome / Razão Social</span>
                    <span className="text-sm font-bold text-gray-800">{selectedPedido.clienteNome}</span>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">CPF / CNPJ</span>
                    <span className="text-sm font-bold text-gray-800">{selectedPedido.clienteDoc}</span>
                  </div>
                </div>
              </div>

              {/* Itens */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Itens da Nota</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="px-4 py-2">Produto</th>
                        <th className="px-4 py-2 text-center">Qtd</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPedido.itens.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-gray-700">{item.produto}</td>
                          <td className="px-4 py-2 text-center text-gray-500">{item.qtd}</td>
                          <td className="px-4 py-2 text-right font-bold text-gray-800">{formatMoney(item.valor * item.qtd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase">Valor Total</span>
                    <span className="text-lg font-black text-blue-700">{formatMoney(selectedPedido.total)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="pt-2">
                {selectedPedido.status === 'pendente' || selectedPedido.status === 'erro' ? (
                  <button 
                    onClick={handleEmitirNfe} 
                    disabled={isGenerating}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Printer size={18} />}
                    {isGenerating ? 'Transmitindo para Sefaz...' : 'Transmitir NFe Agora'}
                  </button>
                ) : selectedPedido.status === 'autorizada' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer">
                      <Download size={18} /> Baixar XML
                    </button>
                    <button className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 flex items-center justify-center gap-2 cursor-pointer">
                      <Printer size={18} /> Imprimir DANFE
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500 italic">Nota fiscal cancelada.</div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK TOAST */}
      {feedback && (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-bold ${feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {feedback.type === 'success' ? <CheckCircle2 /> : <AlertTriangle />}
            {feedback.msg}
            <button onClick={() => setFeedback(null)} className="ml-2 text-white/80 hover:text-white cursor-pointer"><X size={16} /></button>
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