"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, ThumbsUp, Search, MessageSquare, 
  Clock, CheckCircle2, X, Send, Check 
} from "lucide-react";

// Removido as imports de actions para não depender do banco
// import { criarSugestao, toggleLikeAction } from "@/app/actions/sugestoes"; 

interface Sugestao {
  id: number;
  data: string;
  descricao: string;
  sistema: string;
  classificacao: string;
  curtidas: number;
  status: "pendente" | "andamento" | "finalizada";
}

export default function SugestoesClient() {
  const [activeTab, setActiveTab] = useState<string>("pendente");
  const [filtroSistema, setFiltroSistema] = useState("Todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  
  // Modais
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [isModalSucessoOpen, setIsModalSucessoOpen] = useState(false);
  
  // Persistência local de votos e sugestões
  const [votosRealizados, setVotosRealizados] = useState<number[]>([]);
  const [listaSugestoes, setListaSugestoes] = useState<Sugestao[]>([]);

  // Carrega dados do LocalStorage ao iniciar
  useEffect(() => {
    const sugestoesSalvas = localStorage.getItem("minhas_sugestoes_locais");
    const votosSalvos = localStorage.getItem("meus_votos_sugestoes");
    
    if (sugestoesSalvas) setListaSugestoes(JSON.parse(sugestoesSalvas));
    if (votosSalvos) setVotosRealizados(JSON.parse(votosSalvos));
  }, []);

  // Salva no LocalStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem("minhas_sugestoes_locais", JSON.stringify(listaSugestoes));
  }, [listaSugestoes]);

  // Filtros protegidos contra undefined
  const sugestoesFiltradas = useMemo(() => {
    return (listaSugestoes || []).filter((s) => {
      const bateStatus = s.status === activeTab;
      const bateSistema = filtroSistema === "Todos" || s.sistema === filtroSistema;
      const bateTexto = s.descricao.toLowerCase().includes(buscaTexto.toLowerCase());
      return bateStatus && bateSistema && bateTexto;
    });
  }, [activeTab, filtroSistema, buscaTexto, listaSugestoes]);

  // --- LÓGICA DE LIKE LOCAL ---
  const handleLike = (id: number) => {
    const jaVotou = votosRealizados.includes(id);
    let novosVotos: number[];

    if (jaVotou) {
      setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas - 1 } : s));
      novosVotos = votosRealizados.filter(votoId => votoId !== id);
    } else {
      setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas + 1 } : s));
      novosVotos = [...votosRealizados, id];
    }

    setVotosRealizados(novosVotos);
    localStorage.setItem("meus_votos_sugestoes", JSON.stringify(novosVotos));
  };

  // --- CADASTRO LOCAL ---
  const handleCadastrarLocal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const novaSugestao: Sugestao = {
      id: Date.now(), // ID único baseado no tempo
      data: new Date().toLocaleDateString('pt-BR'),
      descricao: formData.get("descricao") as string,
      sistema: formData.get("sistema") as string,
      classificacao: formData.get("classificacao") as string,
      curtidas: 0,
      status: "pendente"
    };

    setListaSugestoes(prev => [novaSugestao, ...prev]);
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button 
                onClick={() => setIsModalCadastroOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
                <Plus size={18} /> Cadastrar Sugestão de Melhoria
            </button>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por descrição..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                />
            </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { id: "pendente", label: "Pendente", icon: <Clock size={16} /> },
              { id: "andamento", label: "Em Andamento", icon: <MessageSquare size={16} /> },
              { id: "finalizada", label: "Finalizada", icon: <CheckCircle2 size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 text-sm font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#414d5f] text-white text-[10px] uppercase font-bold tracking-wider">
                <tr>
                    <th className="px-6 py-4 text-center w-32">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Sistema</th>
                    <th className="px-6 py-4">Classificação</th>
                    <th className="px-6 py-4 text-center w-32">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {sugestoesFiltradas.length > 0 ? (
                    sugestoesFiltradas.map((s) => (
                    <tr key={s.id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-500 text-center font-mono whitespace-nowrap">{s.data}</td>
                        <td className="px-6 py-4 font-medium text-gray-700">{s.descricao}</td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{s.sistema}</td>
                        <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase whitespace-nowrap ${
                            s.classificacao === 'Erro' ? 'bg-red-50 text-red-600' : 
                            s.classificacao === 'IMPORTANTE' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {s.classificacao}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => handleLike(s.id)}
                            disabled={s.status === "finalizada"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold text-xs uppercase ${
                                s.status === "finalizada" 
                                ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50" 
                                : votosRealizados.includes(s.id)
                                    ? "bg-blue-100 text-blue-700 hover:bg-red-50 hover:text-red-600 cursor-pointer ring-1 ring-blue-200"
                                    : "text-blue-600 hover:bg-blue-50 cursor-pointer active:scale-95 border border-blue-100"
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
                        Nenhum registro encontrado localmente.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL CADASTRO LOCAL */}
      {isModalCadastroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Nova Sugestão (Local)</h3>
              <X className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setIsModalCadastroOpen(false)} />
            </div>
            
            <form onSubmit={handleCadastrarLocal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Sistema</label>
                  <select name="sistema" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer">
                    <option>Datacaixa PDV</option>
                    <option>Datacaixa Gestão</option>
                    <option>Datacaixa Garçom</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Classificação</label>
                  <select name="classificacao" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer">
                    <option value="Melhoria">Melhoria</option>
                    <option value="Erro">Erro / Bug</option>
                    <option value="IMPORTANTE">IMPORTANTE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Descrição Detalhada</label>
                <textarea 
                  name="descricao"
                  required rows={4}
                  placeholder="Descreva sua sugestão de forma clara..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100 active:scale-95 cursor-pointer">
                <Send size={16} /> Cadastrar Sugestão
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUCESSO */}
      {isModalSucessoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-90 duration-300 max-w-xs border border-green-50">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
              <Check size={32} strokeWidth={3} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Salvo Localmente!</h4>
            <p className="text-sm text-gray-500">Sua sugestão foi salva no navegador.</p>
            <button onClick={() => setIsModalSucessoOpen(false)} className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors cursor-pointer">Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}