"use client";

import React, { useState } from "react";
import { 
  Database, 
  Save, 
  Search, 
  Download, 
  Server, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";

export default function BackupPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [servidor, setServidor] = useState("KEVIN");

  // Dados baseados na imagem image_2da078.png
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
      alert("Configuração salva com sucesso!");
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* TÍTULO DA PÁGINA */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
          Sistema / <span className="text-gray-900 font-bold tracking-tight">Backups</span>
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* CONFIGURAÇÃO DO SERVIDOR */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            Servidor
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-md">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                value={servidor}
                onChange={(e) => setServidor(e.target.value.toUpperCase())}
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Salvar
            </button>
          </div>
        </div>

        {/* TABELA DE REGISTROS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-gray-700">Lista de Backups</h2>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#414d5f] text-white text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Sistema</th>
                  <th className="px-6 py-4 text-center">Tamanho (MB)</th>
                  <th className="px-6 py-4 text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {backups.map((b) => (
                  <tr key={b.id} className="text-sm hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{b.data}</td>
                    <td className="px-6 py-4 font-bold text-gray-700">{b.sistema}</td>
                    <td className="px-6 py-4 text-center text-gray-600 font-mono">{b.tamanho}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-gray-600 font-medium">
                        <CheckCircle2 size={14} className="text-green-500" />
                        {b.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RODAPÉ DA TABELA */}
          <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>Mostrando 1 até {backups.length} de {backups.length} registros</span>
            <div className="flex items-center gap-1">
               <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-not-allowed">Anterior</button>
               <button className="px-3 py-1 bg-blue-600 text-white rounded font-bold shadow-sm">1</button>
               <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50 cursor-not-allowed">Próximo</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}