"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  FileSearch,
  Calendar,
  X,
  Copy,
  Check,
  Printer,
  CheckCircle2,
  Filter,
  ChevronRight,
} from "lucide-react";

interface Fatura {
  id: number;
  emissao: string;
  descricao: string;
  valor: number;
  vencimento: string;
  vencimentoISO: string;
  status: string;
  faturaNum: string;
  formaPgto: string;
  codigoBarras: string;
}

export default function FaturasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [copied, setCopied] = useState(false);
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
      codigoBarras: "00190.00009 02738.164004 00100.000001 1 95890000008455",
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
      codigoBarras: "",
    },
  ];

  const faturasFiltradas = useMemo(() => {
    return faturas.filter((fatura) => {
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

  const formatMoney = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
          Minhas Faturas
        </h1>
        <p className="text-xs md:text-sm text-gray-500 uppercase font-bold tracking-tighter">
          Histórico de mensalidades e pagamentos
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* FILTRO DE PERÍODO */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-widest">
            <Filter size={14} /> Filtrar Vencimento
          </label>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto flex-1">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 ml-1">
                  DE:
                </span>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 ml-1">
                  ATÉ:
                </span>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {(dataInicio || dataFim) && (
              <button
                onClick={() => {
                  setDataInicio("");
                  setDataFim("");
                }}
                className="text-xs text-red-500 font-black uppercase hover:underline active:scale-95 transition-all"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* LISTAGEM RESPONSIVA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-black text-gray-800 uppercase text-xs tracking-tighter">
              Documentos
            </h2>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {faturasFiltradas.length} total
            </span>
          </div>

          {/* MOBILE VIEW (CARDS) */}
          <div className="md:hidden divide-y divide-gray-100">
            {faturasFiltradas.length > 0 ? (
              faturasFiltradas.map((f) => (
                <div
                  key={f.id}
                  className="p-4 active:bg-gray-50 transition-colors flex items-center justify-between gap-3"
                  onClick={() =>
                    f.status === "Em Aberto" && handleOpenBoleto(f)
                  }
                >
                  <div className="min-w-0">
                    <h4 className="font-black text-gray-800 text-sm truncate mb-1">
                      {f.descricao}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Venc: {f.vencimento}
                      </span>
                      {f.status === "Pago" ? (
                        <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-md uppercase">
                          Pago
                        </span>
                      ) : (
                        <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase">
                          Aberto
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-black text-gray-900">
                      {formatMoney(f.valor)}
                    </p>
                  </div>
                  {f.status === "Em Aberto" ? (
                    <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
                      <ChevronRight size={20} />
                    </div>
                  ) : (
                    <CheckCircle2 className="text-green-500" size={24} />
                  )}
                </div>
              ))
            ) : (
              <NoData />
            )}
          </div>

          {/* DESKTOP VIEW (TABLE) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#414d5f] text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-5 text-center">Vencimento</th>
                  <th className="px-6 py-5">Descrição / Referência</th>
                  <th className="px-6 py-5 text-right">Valor Líquido</th>
                  <th className="px-6 py-5 text-center">Situação</th>
                  <th className="px-6 py-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {faturasFiltradas.length > 0 ? (
                  faturasFiltradas.map((f) => (
                    <tr
                      key={f.id}
                      className="text-sm hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5 text-center font-bold text-gray-500">
                        {f.vencimento}
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-gray-700 leading-none mb-1">
                          {f.descricao}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          Emissão: {f.emissao}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-gray-800">
                        {formatMoney(f.valor)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center">
                          {f.status === "Pago" ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                              <CheckCircle2 size={12} /> Pago
                            </span>
                          ) : (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                              Pendente
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {f.status === "Em Aberto" && (
                          <button
                            onClick={() => handleOpenBoleto(f)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-black text-[10px] uppercase cursor-pointer shadow-lg shadow-blue-100"
                          >
                            <FileSearch size={14} /> Detalhes
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <NoData isTable colSpan={5} />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL CENTRALIZADO (ESTILO APP) */}
      {isModalOpen && selectedFatura && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 leading-none">
                    Dados do Boleto
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Fatura #{selectedFatura.faturaNum}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center sm:text-left">
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">
                    Vencimento
                  </p>
                  <p className="font-black text-gray-800 text-base">
                    {selectedFatura.vencimento}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center sm:text-left">
                  <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1">
                    Total à Pagar
                  </p>
                  <p className="font-black text-blue-700 text-base">
                    {formatMoney(selectedFatura.valor)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Copia e Cola
                </label>
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 font-mono text-[11px] text-gray-600 break-all leading-relaxed select-all">
                    {selectedFatura.codigoBarras || "Código não gerado"}
                  </div>
                  <button
                    onClick={handleCopyBarcode}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-gray-900 text-white hover:bg-black shadow-xl"
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Código Copiado!" : "Copiar Código"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                  <Download size={18} /> Baixar PDF
                </button>
                <button className="flex items-center justify-center gap-2 py-3 text-gray-400 font-bold text-xs hover:text-gray-600">
                  <Printer size={16} /> Imprimir boleto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NoData = ({
  isTable = false,
  colSpan = 1,
}: {
  isTable?: boolean;
  colSpan?: number;
}) => {
  const content = (
    <div className="px-6 py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-3 w-full">
      <FileText size={40} className="opacity-10" />
      <p className="text-sm font-black uppercase tracking-tighter">
        Nenhuma fatura localizada
      </p>
    </div>
  );
  return isTable ? (
    <tr>
      <td colSpan={colSpan}>{content}</td>
    </tr>
  ) : (
    content
  );
};
