"use client";

import React, { useState } from "react";
import { 
  Save, 
  Search, 
  Server, 
  CheckCircle2, 
  Loader2,
  X,
  Database,
  ChevronRight
} from "lucide-react";

export default function BackupPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [servidor, setServidor] = useState("KEVIN");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const backups = [
    { id: 1, data: "13/03/2025", sistema: "DATACAIXA", tamanho: 11, situacao: "Finalizado" },
    { id: 2, data: "01/11/2023", sistema: "DATACAIXA", tamanho: 1, situacao: "Finalizado" },
    { id: 3, data: "30/10/2023", sistema: "DATACAIXA", tamanho: 1, situacao: "Finalizado" },
    { id: 4, data: "08/08/2023", sistema: "DATACAIXA", tamanho: 2, situacao: "Finalizado" },
    { id: 5, data: "07/08/2023", sistema: "DATACAIXA", tamanho: 2, situacao: "Finalizado" },
    { id: 6, data: "07/08/2023", sistema: "DATACAIXA", tamanho: 1, situacao: "Finalizado" },
    { id: 7, data: "07/07/2023", sistema: "DATACAIXA", tamanho: 2, situacao: "Finalizado" },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER DA PÁGINA */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
           <Database className="text-blue-600 shrink-0" /> Sistema / Backups
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1 uppercase font-bold tracking-tighter">Histórico de cópias de segurança</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        
        {/* CONFIGURAÇÃO DO SERVIDOR RESPONSIVA */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">
            Identificação do Servidor
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={servidor}
                onChange={(e) => setServidor(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
              />
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              SALVAR CONFIGURAÇÃO
            </button>
          </div>
        </div>

        {/* LISTAGEM DE BACKUPS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-black text-gray-800 uppercase text-xs tracking-tighter">Registros Recentes</h2>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Pesquisar data ou sistema..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* VIEW MOBILE (CARDS) */}
          <div className="md:hidden divide-y divide-gray-100">
            {backups.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between gap-3 active:bg-gray-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-blue-600">#{b.id}</span>
                    <h4 className="font-black text-gray-800 text-sm truncate">{b.data}</h4>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">{b.sistema} • {b.tamanho} MB</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[9px] font-black uppercase">
                    <CheckCircle2 size={10} /> {b.situacao}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 shrink-0" />
              </div>
            ))}
          </div>

          {/* VIEW DESKTOP (TABELA) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#414d5f] text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-5">Data da Cópia</th>
                  <th className="px-6 py-5">Sistema de Origem</th>
                  <th className="px-6 py-5 text-center">Tamanho</th>
                  <th className="px-6 py-5 text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {backups.map((b) => (
                  <tr key={b.id} className="text-sm hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5 text-gray-600 font-medium">{b.data}</td>
                    <td className="px-6 py-5 font-black text-gray-700">{b.sistema}</td>
                    <td className="px-6 py-5 text-center text-gray-600 font-mono text-xs">{b.tamanho} MB</td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold transition-all group-hover:scale-105">
                        <CheckCircle2 size={14} />
                        {b.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RODAPÉ DA LISTA */}
          <div className="p-4 md:p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
            <span className="text-center sm:text-left">Exibindo {backups.length} registros salvos em nuvem</span>
            <div className="flex items-center gap-2">
               <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white opacity-50 cursor-not-allowed">Anterior</button>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md">1</button>
               <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white opacity-50 cursor-not-allowed">Próximo</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE SUCESSO CENTRALIZADO (ESTILO APP) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                Configurado!
              </h3>
              
              <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                O servidor de backup foi atualizado. Suas próximas cópias serão direcionadas para <span className="text-blue-600 font-black">{servidor}</span>.
              </p>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gray-900 hover:bg-black text-white font-black text-xs py-4 rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 uppercase tracking-widest"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}