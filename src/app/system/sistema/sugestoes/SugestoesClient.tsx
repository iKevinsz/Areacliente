"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, ThumbsUp, Search, MessageSquare, 
  Clock, CheckCircle2, X, Send, Check, ChevronDown, 
  AlertCircle, Calendar, Lightbulb, Sparkles, Loader2
} from "lucide-react";
import { criarSugestao, toggleLikeAction } from "@/app/actions/sugestoes";

interface Sugestao {
  id: number;
  data: string;
  descricao: string;   
  observacoes: string; 
  sistema: string;
  classificacao: string;
  curtidas: number;
  status: "pendente" | "andamento" | "finalizada";
}

export default function SugestoesClient({ dadosIniciais = [] }: { dadosIniciais: Sugestao[] }) {
  const [activeTab, setActiveTab] = useState<string>("pendente");
  const [buscaTexto, setBuscaTexto] = useState("");
  
  // Modais
  const [isModalCadastroOpen, setIsModalCadastroOpen] = useState(false);
  const [isModalSucessoOpen, setIsModalSucessoOpen] = useState(false);
  const [sugestaoSelecionada, setSugestaoSelecionada] = useState<Sugestao | null>(null);

  // Estados de Dados
  const [formErrors, setFormErrors] = useState({ descricao: false, observacoes: false });
  const [votosRealizados, setVotosRealizados] = useState<number[]>([]);
  
  // Inicializa com dados do servidor
  const [listaSugestoes, setListaSugestoes] = useState<Sugestao[]>(dadosIniciais);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Controle de Montagem 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Ler localStorage apenas no cliente, após a montagem
    if (typeof window !== "undefined") {
      try {
        const votosSalvos = localStorage.getItem("meus_votos_sugestoes");
        if (votosSalvos) setVotosRealizados(JSON.parse(votosSalvos));
      } catch (e) {
        console.error("Erro ao ler votos", e);
      }
    }
  }, []);

  // Atualiza lista se o servidor mandar novos dados (revalidate)
  useEffect(() => {
    setListaSugestoes(dadosIniciais || []);
  }, [dadosIniciais]);

  // Função segura para checar votos 
  const isVoted = (id: number) => isMounted && votosRealizados.includes(id);

  const sugestoesFiltradas = useMemo(() => {
    if (!listaSugestoes) return [];
    return listaSugestoes.filter((s) => {
      const bateStatus = s.status === activeTab;
      const termo = buscaTexto.toLowerCase();
      const bateTexto = s.descricao.toLowerCase().includes(termo) || 
                        (s.observacoes && s.observacoes.toLowerCase().includes(termo));
      return bateStatus && bateTexto;
    });
  }, [activeTab, buscaTexto, listaSugestoes]);

  const handleLike = async (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    const jaVotou = votosRealizados.includes(id);
    let incrementar = false;

    // Atualização Otimista
    if (jaVotou) {
      setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas - 1 } : s));
      setVotosRealizados(prev => prev.filter(v => v !== id));
      incrementar = false;
    } else {
      setListaSugestoes(prev => prev.map(s => s.id === id ? { ...s, curtidas: s.curtidas + 1 } : s));
      setVotosRealizados(prev => [...prev, id]);
      incrementar = true;
    }

    // Persistência LocalStorage
    const novosVotos = jaVotou ? votosRealizados.filter(v => v !== id) : [...votosRealizados, id];
    localStorage.setItem("meus_votos_sugestoes", JSON.stringify(novosVotos));

    // Persistência Banco de Dados
    try {
        await toggleLikeAction(id, incrementar);
    } catch (error) {
        console.error("Erro ao salvar like", error);
    }
  };

  const handleCadastrarDB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const descricao = formData.get("descricao") as string;
    const observacoes = formData.get("observacoes") as string;

    const errors = {
      descricao: !descricao.trim(),
      observacoes: !observacoes.trim()
    };
    setFormErrors(errors);

    if (errors.descricao || errors.observacoes) return;

    setIsSubmitting(true);
    
    try {
        const result = await criarSugestao(formData);
        if (result.success) {
            setIsModalCadastroOpen(false);
            setIsModalSucessoOpen(true);
            setTimeout(() => setIsModalSucessoOpen(false), 3000);
        } else {
            alert("Erro: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#F3F6F9] min-h-screen font-sans text-slate-800 pb-20 md:pb-8">
      
      
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* HEADER */}
      <div className="mb-8 md:mb-10 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-3 mb-2">
                    <Lightbulb size={28} strokeWidth={2.5} />
                    Sistema / <span className="font-black">Sugestões</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">
                    CENTRAL DE MELHORIAS E FEEDBACK
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* BARRA DE AÇÕES */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button 
                onClick={() => { setFormErrors({descricao:false, observacoes: false}); setIsModalCadastroOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer group"
            >
                <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors"><Plus size={16} /></div>
                Cadastrar Nova Ideia
            </button>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <input 
                    type="text" 
                    placeholder="Pesquisar sugestões..." 
                    className="w-full pl-12 pr-4 py-3.5 border-0 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all placeholder:text-slate-400"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                />
            </div>
        </div>

        {/* ABAS */}
        <div className="border-b border-slate-200 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-8 min-w-max">
            {[
              { id: "pendente", label: "Em Votação", icon: <Sparkles size={16} /> },
              { id: "andamento", label: "Em Desenvolvimento", icon: <MessageSquare size={16} /> },
              { id: "finalizada", label: "Concluídas", icon: <CheckCircle2 size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 text-sm font-bold transition-all border-b-[3px] cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTAGEM */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[200px]">
          
          {/* MOBILE VIEW */}
          <div className="md:hidden divide-y divide-slate-100">
            {sugestoesFiltradas.length > 0 ? (
                sugestoesFiltradas.map((s) => (
                    <div 
                        key={s.id} 
                        onClick={() => setSugestaoSelecionada(s)}
                        className="p-5 active:bg-blue-50/50 transition-colors cursor-pointer group relative"
                    >
                        <div className="flex justify-between items-start mb-3">
                             <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                                s.classificacao === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {s.classificacao}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                <Calendar size={12}/> {s.data}
                            </span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-base mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                            {s.descricao}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{s.observacoes}</p>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                            <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {s.sistema}
                            </span>
                            <button 
                                onClick={(e) => handleLike(s.id, e)}
                                disabled={s.status === "finalizada"}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                    isVoted(s.id)
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                {isVoted(s.id) ? <Check size={14} /> : <ThumbsUp size={14} />} {s.curtidas}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                    <Search size={32} className="opacity-20" />
                    Nenhuma sugestão encontrada nesta aba.
                </div>
            )}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                <tr>
                    <th className="px-8 py-5 text-center w-36">Data</th>
                    <th className="px-6 py-5 w-1/4">Título da Sugestão</th>
                    <th className="px-6 py-5 w-1/3">Resumo</th>
                    <th className="px-6 py-5">Módulo</th>
                    <th className="px-6 py-5">Tipo</th>
                    <th className="px-8 py-5 text-center w-36">Votos</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {sugestoesFiltradas.length > 0 ? (
                    sugestoesFiltradas.map((s) => (
                    <tr 
                        key={s.id} 
                        onClick={() => setSugestaoSelecionada(s)}
                        className="text-sm hover:bg-blue-50/30 transition-colors group cursor-pointer"
                    >
                        <td className="px-8 py-5 text-slate-400 text-center font-bold text-xs whitespace-nowrap align-middle">{s.data}</td>
                        <td className="px-6 py-5 align-middle">
                            <span className="font-bold text-slate-700 block text-base group-hover:text-blue-600 transition-colors">{s.descricao}</span>
                        </td>
                        <td className="px-6 py-5 align-middle">
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2" title="Clique para ver completo">
                                {s.observacoes}
                            </p>
                        </td>
                        <td className="px-6 py-5 text-slate-500 font-medium whitespace-nowrap align-middle">{s.sistema}</td>
                        <td className="px-6 py-5 align-middle">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase whitespace-nowrap border ${
                            s.classificacao === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' : 
                            s.classificacao === 'IMPORTANTE' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                            {s.classificacao}
                        </span>
                        </td>
                        <td className="px-8 py-5 text-center align-middle">
                        <button 
                            onClick={(e) => handleLike(s.id, e)}
                            disabled={s.status === "finalizada"}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase cursor-pointer ${
                                s.status === "finalizada" 
                                ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-50" 
                                : isVoted(s.id)
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transform hover:-translate-y-0.5"
                                    : "text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                            {isVoted(s.id) ? <Check size={14} /> : <ThumbsUp size={14} />}
                            {s.curtidas}
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-400 italic">
                        <div className="flex flex-col items-center gap-2">
                             <Search size={32} className="opacity-10"/>
                             <span>Nenhum registro encontrado nesta aba.</span>
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL DE DETALHES --- */}
      {sugestaoSelecionada && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSugestaoSelecionada(null)}
        >
            <div 
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                             <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                                sugestaoSelecionada.classificacao === 'Erro' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {sugestaoSelecionada.classificacao}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200">
                                <Calendar size={12}/> {sugestaoSelecionada.data}
                            </span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-2 py-1 rounded border border-slate-200">
                                {sugestaoSelecionada.sistema}
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                            {sugestaoSelecionada.descricao}
                        </h3>
                    </div>
                    <button 
                        onClick={() => setSugestaoSelecionada(null)}
                        className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto bg-white">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare size={14}/> Detalhes da Solicitação
                    </h4>
                    <div className="text-sm md:text-base text-slate-700 leading-loose whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {sugestaoSelecionada.observacoes}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={() => setSugestaoSelecionada(null)}
                        className="px-6 py-3 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        Fechar
                    </button>
                    <button 
                        onClick={(e) => { handleLike(sugestaoSelecionada.id, e); }}
                        disabled={sugestaoSelecionada.status === "finalizada"}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95 ${
                            isVoted(sugestaoSelecionada.id)
                            ? "bg-slate-900 text-white hover:bg-black"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                         {isVoted(sugestaoSelecionada.id) ? "Votado" : "Apoiar esta ideia"}
                         {isVoted(sugestaoSelecionada.id) ? <Check size={18} /> : <ThumbsUp size={18} />}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL CADASTRO --- */}
      {isModalCadastroOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-4">
          <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                 <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><Plus size={18}/></div>
                 Nova Ideia
              </h3>
              <button 
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 transition-colors cursor-pointer" 
                onClick={() => setIsModalCadastroOpen(false)}
              >
                  <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 md:p-8">
                <form onSubmit={handleCadastrarDB} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Módulo do Sistema</label>
                    <div className="relative">
                        <select name="sistema" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                            <option>Datacaixa PDV</option>
                            <option>Datacaixa Gestão</option>
                            <option>Datacaixa Garçom</option>
                            <option>Cardápio Digital</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                    </div>
                    </div>
                    <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Tipo de Registro</label>
                    <div className="relative">
                        <select name="classificacao" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                            <option value="Melhoria">💡 Melhoria</option>
                            <option value="Erro">🐞 Erro / Bug</option>
                            <option value="IMPORTANTE">🔥 Importante</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                    </div>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 flex justify-between">
                        Título Curto
                        {formErrors.descricao && <span className="text-red-500 flex items-center gap-1 text-[10px]"><AlertCircle size={10}/> Obrigatório</span>}
                    </label>
                    <input 
                    name="descricao"
                    type="text"
                    placeholder="Ex: Adicionar opção de PIX no relatório..."
                    onChange={() => setFormErrors(prev => ({...prev, descricao: false}))}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 transition-all shadow-sm
                        ${formErrors.descricao ? 'border-red-300 ring-1 ring-red-100 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'}`}
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 flex justify-between">
                        Detalhes da Solicitação
                        {formErrors.observacoes && <span className="text-red-500 flex items-center gap-1 text-[10px]"><AlertCircle size={10}/> Obrigatório</span>}
                    </label>
                    <textarea 
                    name="observacoes"
                    rows={6}
                    placeholder="Explique o cenário atual e como você gostaria que ficasse..."
                    onChange={() => setFormErrors(prev => ({...prev, observacoes: false}))}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-600 font-medium outline-none focus:ring-2 resize-none transition-all
                        ${formErrors.observacoes ? 'border-red-300 ring-1 ring-red-100 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'}`}
                    />
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                        {isSubmitting ? 'Salvando...' : 'Enviar Sugestão'}
                    </button>
                </div>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL SUCESSO --- */}
      {isModalSucessoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300 max-w-xs border border-green-50 w-full">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner mb-2 ring-4 ring-green-50">
              <Check size={32} strokeWidth={4} />
            </div>
            <div>
                 <h4 className="text-xl font-black text-slate-900">Recebido!</h4>
                 <p className="text-sm text-slate-500 mt-1 font-medium">Sua contribuição foi registrada.</p>
            </div>
            <button onClick={() => setIsModalSucessoOpen(false)} className="w-full py-3.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all cursor-pointer">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}