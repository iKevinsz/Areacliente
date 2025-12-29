"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, ThumbsUp, Search, MessageSquare, 
  Clock, CheckCircle2, X, Send, Check, ChevronRight 
} from "lucide-react";
import { criarSugestao, toggleLikeAction } from "@/app/actions/sugestoes"; 

interface Sugestao {
  id: number;
  data: string;
  descricao: string;
  sistema: string;
  classificacao: string;
  curtidas: number;
  status: "pendente" | "andamento" | "finalizada";
}

export default function SugestoesClient({ dadosIniciais }: { dadosIniciais: Sugestao[] }) {
  const [activeTab, setActiveTab] = useState<string>("pendente");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [isModalSucessoOpen, setIsModalSucessoOpen] = useState(false);
  const [votosRealizados, setVotosRealizados] = useState<number[]>([]);
  const [listaSugestoes, setListaSugestoes] = useState<Sugestao[]>(dadosIniciais);
  
  useEffect(() => {
    setListaSugestoes(dadosIniciais);
  }, [dadosIniciais]);

  useEffect(() => {
    const votosSalvos = localStorage.getItem("meus_votos_sugestoes");
    if (votosSalvos) setVotosRealizados(JSON.parse(votosSalvos));
  }, []);

  const sugestoesFiltradas = useMemo(() => {
    return listaSugestoes.filter((s) => {
      const bateStatus = s.status === activeTab;
      const bateTexto = s.descricao.toLowerCase().includes(buscaTexto.toLowerCase());
      return bateStatus && bateTexto;
    });
  }, [activeTab, buscaTexto, listaSugestoes]);

  const handleLike = async (id: number) => {
    const jaVotou = votosRealizados.includes(id);
    let novosVotos: number[];
    let incrementar = false;

    if (jaVotou) {
      setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas - 1 } : s));
      novosVotos = votosRealizados.filter(votoId => votoId !== id);
      incrementar = false;
    } else {
      setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas + 1 } : s));
      novosVotos = [...votosRealizados, id];
      incrementar = true;
    }

    setVotosRealizados(novosVotos);
    localStorage.setItem("meus_votos_sugestoes", JSON.stringify(novosVotos));
    await toggleLikeAction(id, incrementar);
  };

  const handleCadastrar = async (formData: FormData) => {
    const resultado = await criarSugestao(formData);
    if (resultado.success) {
      setIsModalCadastroOpen(false);
      setIsModalSucessoOpen(true);
      setTimeout(() => setIsModalSucessoOpen(false), 3000);
    } else {
      alert("Erro ao salvar sugestão.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
          Sugestões <span className="text-gray-400 font-medium hidden sm:inline">/ Melhorias</span>
        </h1>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* AÇÕES DE TOPO RESPONSIVAS */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-4">
            <button 
                onClick={() => setIsModalCadastroOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
                <Plus size={18} /> Sugerir Melhoria
            </button>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Pesquisar sugestão..." 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                />
            </div>
        </div>

        {/* ABAS COM SCROLL NO MOBILE */}
        <div className="border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 md:gap-8 min-w-max px-1">
            {[
              { id: "pendente", label: "Pendentes", icon: <Clock size={16} /> },
              { id: "andamento", label: "Em curso", icon: <MessageSquare size={16} /> },
              { id: "finalizada", label: "Concluídas", icon: <CheckCircle2 size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 text-xs md:text-sm font-black uppercase tracking-tighter transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTAGEM RESPONSIVA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* MOBILE VIEW (CARDS) */}
          <div className="md:hidden divide-y divide-gray-50">
            {sugestoesFiltradas.length > 0 ? (
              sugestoesFiltradas.map((s) => (
                <div key={s.id} className="p-4 space-y-3 active:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono text-gray-400">{s.data}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      s.classificacao === 'Erro' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {s.classificacao}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{s.descricao}</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{s.sistema}</span>
                    <button 
                        onClick={() => handleLike(s.id)}
                        disabled={s.status === "finalizada"}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${
                            votosRealizados.includes(s.id) ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        <ThumbsUp size={14} /> {s.curtidas}
                    </button>
                  </div>
                </div>
              ))
            ) : <div className="p-12 text-center text-gray-400 text-xs font-bold uppercase italic">Nada por aqui...</div>}
          </div>

          {/* DESKTOP VIEW (TABLE) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#414d5f] text-white text-[10px] uppercase font-black tracking-widest">
                  <tr>
                      <th className="px-6 py-4 text-center w-32">Data</th>
                      <th className="px-6 py-4">Sugestão / Melhoria</th>
                      <th className="px-6 py-4">Módulo</th>
                      <th className="px-6 py-4">Prioridade</th>
                      <th className="px-6 py-4 text-center w-32">Votos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {sugestoesFiltradas.map((s) => (
                  <tr key={s.id} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 text-gray-500 text-center font-mono text-xs">{s.data}</td>
                      <td className="px-6 py-5 font-bold text-gray-700">{s.descricao}</td>
                      <td className="px-6 py-5 text-gray-600 text-xs font-bold uppercase">{s.sistema}</td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                            s.classificacao === 'Erro' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {s.classificacao}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                            onClick={() => handleLike(s.id)}
                            disabled={s.status === "finalizada"}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all font-black text-xs uppercase ${
                                votosRealizados.includes(s.id)
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                : "text-blue-600 hover:bg-blue-50 border border-blue-100"
                            }`}
                        >
                            <ThumbsUp size={14} /> {s.curtidas}
                        </button>
                      </td>
                  </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL CADASTRO ADAPTÁVEL */}
      {isModalCadastroOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-2xl shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-300 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">Nova Sugestão</h3>
              <button onClick={() => setIsModalCadastroOpen(false)} className="p-2 bg-white rounded-full shadow-sm"><X size={18} /></button>
            </div>
            
            <form action={handleCadastrar} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Módulo</label>
                  <select name="sistema" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Datacaixa PDV</option>
                    <option>Datacaixa Gestão</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo</label>
                  <select name="classificacao" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Melhoria">Melhoria</option>
                    <option value="Erro">Bug / Erro</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sua sugestão</label>
                <textarea 
                  name="descricao"
                  required rows={4}
                  placeholder="Seja objetivo e claro..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95">
                <Send size={16} /> ENVIAR AGORA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FEEDBACK SUCESSO CENTRALIZADO */}
      {isModalSucessoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-90 max-w-xs border border-green-100">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
              <Check size={40} strokeWidth={3} />
            </div>
            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Recebido!</h4>
            <p className="text-sm text-gray-500 font-medium">Sua contribuição é muito importante para nós.</p>
            <button onClick={() => setIsModalSucessoOpen(false)} className="w-full py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">FECHAR</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}