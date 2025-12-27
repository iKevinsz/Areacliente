"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, ThumbsUp, Search, MessageSquare, 
  Clock, CheckCircle2, X, Send, Check 
} from "lucide-react";

interface Sugestao {
  id: number;
  data: string;
  descricao: string;
  sistema: string;
  classificacao: string;
  curtidas: number;
  status: "pendente" | "andamento" | "finalizada";
}

export default function SugestoesPage() {
  const [activeTab, setActiveTab] = useState<string>("pendente");
  const [filtroSistema, setFiltroSistema] = useState("Todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [isModalSucessoOpen, setIsModalSucessoOpen] = useState(false);
  
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoSistema, setNovoSistema] = useState("Datacaixa PDV");
  const [novaClassificacao, setNovaClassificacao] = useState("Melhoria");

  const [votosRealizados, setVotosRealizados] = useState<number[]>([]);

  const [listaSugestoes, setListaSugestoes] = useState<Sugestao[]>([
    { id: 1, data: "22/12/2025", descricao: "Filtro para escolher formas de pagamento no relatório de faturamento", sistema: "Datacaixa PDV", classificacao: "Melhoria", curtidas: 5, status: "pendente" },
    { id: 2, data: "22/12/2025", descricao: "Sincronização automática em nuvem", sistema: "Datacaixa PDV", classificacao: "Melhoria", curtidas: 12, status: "pendente" },
    { id: 3, data: "20/12/2025", descricao: "APP não fraciona produto UNID em Pedido", sistema: "Datacaixa Garçom", classificacao: "Erro", curtidas: 1, status: "pendente" },
    { id: 4, data: "18/12/2025", descricao: "Implementação de PIX dinâmico diretamente no terminal", sistema: "Datacaixa PDV", classificacao: "IMPORTANTE", curtidas: 24, status: "andamento" },
    { id: 5, data: "15/12/2025", descricao: "Novo dashboard de indicadores para Gestão Mobile", sistema: "Datacaixa Gestão", classificacao: "Melhoria", curtidas: 18, status: "andamento" },
    { id: 6, data: "10/12/2025", descricao: "Correção de lentidão ao abrir o mapa de mesas", sistema: "Datacaixa PDV", classificacao: "Erro", curtidas: 4, status: "finalizada" },
    { id: 7, data: "05/12/2025", descricao: "Integração com balanças de etiqueta via rede", sistema: "Datacaixa PDV", classificacao: "Melhoria", curtidas: 32, status: "finalizada" },
    { id: 8, data: "01/12/2025", descricao: "Exportação de relatórios fiscais em formato XML", sistema: "Datacaixa Gestão", classificacao: "IMPORTANTE", curtidas: 45, status: "finalizada" },
  ]);

  const sugestoesFiltradas = useMemo(() => {
    return listaSugestoes.filter((s) => {
      const bateStatus = s.status === activeTab;
      const bateSistema = filtroSistema === "Todos" || s.sistema === filtroSistema;
      const bateTexto = s.descricao.toLowerCase().includes(buscaTexto.toLowerCase());
      return bateStatus && bateSistema && bateTexto;
    });
  }, [activeTab, filtroSistema, buscaTexto, listaSugestoes]);

  const handleLike = (id: number) => {
    if (votosRealizados.includes(id)) return;
    setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas + 1 } : s));
    setVotosRealizados(prev => [...prev, id]);
  };

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    const novaSugestao: Sugestao = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      descricao: novaDescricao,
      sistema: novoSistema,
      classificacao: novaClassificacao,
      curtidas: 0,
      status: "pendente"
    };
    setListaSugestoes([novaSugestao, ...listaSugestoes]);
    setNovaDescricao("");
    setIsModalCadastroOpen(false);
    setIsModalSucessoOpen(true);
    setTimeout(() => setIsModalSucessoOpen(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
          Sistema / <span className="text-gray-900">Sugestões e Melhorias</span>
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-6">
        <button 
          onClick={() => setIsModalCadastroOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={18} /> Cadastrar Sugestão de Melhoria
        </button>

        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            {[
              { id: "pendente", label: "Pendente", icon: <Clock size={16} /> },
              { id: "andamento", label: "Em Andamento", icon: <MessageSquare size={16} /> },
              { id: "finalizada", label: "Finalizada", icon: <CheckCircle2 size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#414d5f] text-white text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-center w-32">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Sistema</th>
                <th className="px-6 py-4">Classificação</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sugestoesFiltradas.length > 0 ? (
                sugestoesFiltradas.map((s) => (
                  <tr key={s.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-center font-mono">{s.data}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{s.descricao}</td>
                    <td className="px-6 py-4 text-gray-600">{s.sistema}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                        s.classificacao === 'Erro' ? 'bg-red-50 text-red-600' : 
                        s.classificacao === 'IMPORTANTE' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {s.classificacao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleLike(s.id)}
                        disabled={votosRealizados.includes(s.id) || s.status === "finalizada"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold text-xs uppercase ${
                          votosRealizados.includes(s.id) || s.status === "finalizada"
                          ? "bg-gray-50 text-gray-400 cursor-default"
                          : "text-blue-600 hover:bg-blue-50 cursor-pointer active:scale-90"
                        }`}
                      >
                        {votosRealizados.includes(s.id) ? <Check size={14} /> : <ThumbsUp size={14} />}
                        {s.curtidas}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    Nenhum registo encontrado neste status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalCadastroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Nova Sugestão</h3>
              <X className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setIsModalCadastroOpen(false)} />
            </div>
            <form onSubmit={handleCadastrar} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Sistema</label>
                  <select 
                    value={novoSistema}
                    onChange={(e) => setNovoSistema(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option>Datacaixa PDV</option>
                    <option>Datacaixa Gestão</option>
                    <option>Datacaixa Garçom</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Classificação</label>
                  <select 
                    value={novaClassificacao}
                    onChange={(e) => setNovaClassificacao(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Melhoria">Melhoria</option>
                    <option value="Erro">Erro / Bug</option>
                    <option value="IMPORTANTE">IMPORTANTE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Descrição</label>
                <textarea 
                  required rows={4} value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Descreva sua sugestão..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Send size={16} /> Cadastrar Sugestão
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      {isModalSucessoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-90 duration-300 max-w-xs border border-green-50">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
              <Check size={32} strokeWidth={3} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Sucesso!</h4>
            <p className="text-sm text-gray-500">Sua sugestão foi enviada para análise.</p>
            <button onClick={() => setIsModalSucessoOpen(false)} className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}