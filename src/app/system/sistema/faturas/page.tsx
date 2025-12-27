"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, Download, Search, FileSearch, 
  Calendar, X, Copy, Check, Printer, 
  CheckCircle2, Filter
} from "lucide-react";

interface Fatura {
  id: number;
  emissao: string;
  descricao: string;
  valor: number;
  vencimento: string; // Formato DD/MM/YYYY para exibição
  vencimentoISO: string; // Formato YYYY-MM-DD para lógica de filtro
  status: string;
  faturaNum: string;
  formaPgto: string;
  codigoBarras: string;
}

export default function FaturasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [copied, setCopied] = useState(false);

  // Estados para o filtro de período
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const faturas: Fatura[] = [
    { 
      id: 1, 
      emissao: "20/12/2025", 
      descricao: "MENSALIDADE DATACAIXA PDV", 
      valor: 84.55, 
      vencimento: "05/01/2026",
      vencimentoISO: "2026-01-05",
      status: "Em Aberto",
      faturaNum: "88451",
      formaPgto: "BOLETO",
      codigoBarras: "00190.00009 02738.164004 00100.000001 1 95890000008455"
    },
    { 
      id: 2, 
      emissao: "01/12/2025", 
      descricao: "MENSALIDADE DATACAIXA GESTÃO", 
      valor: 113.05, 
      vencimento: "10/12/2025",
      vencimentoISO: "2025-12-10",
      status: "Pago",
      faturaNum: "85214",
      formaPgto: "CARTÃO",
      codigoBarras: ""
    },
  ];

  // Lógica de Filtro Funcional
  const faturasFiltradas = useMemo(() => {
    return faturas.filter(fatura => {
      const dataVenc = fatura.vencimentoISO;
      if (dataInicio && dataVenc < dataInicio) return false;
      if (dataFim && dataVenc > dataFim) return false;
      return true;
    });
  }, [dataInicio, dataFim]);

  const handleOpenBoleto = (fatura: Fatura) => {
    setSelectedFatura(fatura);
    setIsModalOpen(true);
  };

  const handleCopyBarcode = () => {
    if (selectedFatura?.codigoBarras) {
      navigator.clipboard.writeText(selectedFatura.codigoBarras);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800 relative">
      
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-600 flex items-center gap-2">
          Sistema / <span className="text-gray-900">Faturas</span>
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* FILTRO DE PERÍODO FUNCIONAL */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-2 tracking-wider">
            <Filter size={12} /> Filtrar por Vencimento
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">De:</span>
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Até:</span>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>
            {(dataInicio || dataFim) && (
              <button 
                onClick={() => { setDataInicio(""); setDataFim(""); }}
                className="text-xs text-red-500 font-bold hover:underline"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* TABELA DE FATURAS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-700">Lista de Faturas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#414d5f] text-white text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Emissão</th>
                  <th className="px-6 py-4">Descrição</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                  <th className="px-6 py-4 text-center">Vencimento</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {faturasFiltradas.length > 0 ? (
                  faturasFiltradas.map((f) => (
                    <tr key={f.id} className="text-sm hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{f.emissao}</td>
                      <td className="px-6 py-4 font-bold text-gray-700">{f.descricao}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-800">R$ {f.valor.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{f.vencimento}</td>
                      <td className="px-6 py-4 text-center">
                        {f.status === "Em Aberto" ? (
                          <button 
                            onClick={() => handleOpenBoleto(f)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold text-xs cursor-pointer shadow-sm active:scale-95"
                          >
                            <FileSearch size={14} /> Abrir Boleto
                          </button>
                        ) : (
                          <span className="text-green-600 font-bold text-xs uppercase flex items-center justify-center gap-1">
                            <CheckCircle2 size={14} /> Pago
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                      Nenhuma fatura encontrada para o período selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DO BOLETO */}
      {isModalOpen && selectedFatura && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3 text-blue-600">
                <FileText size={24} />
                <h3 className="text-lg font-bold text-gray-900">Visualizar Boleto</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Vencimento</p>
                  <p className="font-bold text-gray-800 text-lg">{selectedFatura?.vencimento}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-blue-400 text-[10px] font-bold uppercase mb-1">Valor Total</p>
                  <p className="font-bold text-blue-700 text-lg">R$ {selectedFatura?.valor.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Linha Digitável</label>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 font-mono text-sm text-gray-600 break-all leading-relaxed">
                    {selectedFatura?.codigoBarras || "Código indisponível"}
                  </div>
                  <button 
                    onClick={handleCopyBarcode}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
                      copied ? "bg-green-600 border-green-600 text-white" : "bg-gray-900 border-gray-900 text-white hover:bg-black shadow-lg"
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-50">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all cursor-pointer">
                  <Printer size={18} /> Imprimir Boleto
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 cursor-pointer">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}