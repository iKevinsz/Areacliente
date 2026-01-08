"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Key,
  Package,
  Save,
  CreditCard,
  Info,
  CheckCircle2,
  X,
  Loader2,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

export default function LicencasPage() {
  const router = useRouter();
  const [activeLicense] = useState("007155414E414B48BE531CA0A9536B0F11");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    nome: string;
    meses: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [meusProdutos, setMeusProdutos] = useState([
    {
      id: 2,
      nome: "DATACAIXA PDV",
      meses: 3,
      total: 239.0,
      desconto: 227.05,
      validade: "31/12/2025",
    },
    {
      id: 3,
      nome: "DATACAIXA GESTÃO",
      meses: 3,
      total: 319.0,
      desconto: 303.05,
      validade: "31/12/2025",
    },
  ]);

  const handleCopyLicense = async () => {
    try {
      await navigator.clipboard.writeText(activeLicense);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar: ", err);
    }
  };

  const handleMonthChange = (id: number, value: string) => {
    setMeusProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, meses: parseInt(value) } : p))
    );
  };

  const openConfirmModal = (nome: string, meses: number) => {
    setSelectedProduct({ nome, meses });
    setIsModalOpen(true);
  };

  const confirmSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsModalOpen(false);
      alert("Renovação processada com sucesso!");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* HEADER DA PÁGINA */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-3">
          <Key className="text-blue-600 shrink-0" /> Licença do Sistema
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1 uppercase font-bold tracking-tighter">
          Gerencie seus módulos Datacaixa
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
        {/* CARD 1: LICENÇA ATIVA */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2 tracking-widest">
            <CheckCircle2 size={14} className="text-green-500" /> Chave de
            Ativação
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              readOnly
              value={activeLicense}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[11px] md:text-sm font-mono text-gray-600 outline-none truncate"
            />
            <button
              onClick={handleCopyLicense}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
                copied
                  ? "bg-green-50 border-green-200 text-green-600"
                  : "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copiado!" : "Copiar Chave"}
            </button>
          </div>
        </div>

        {/* CARD 2: MEUS PRODUTOS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h2 className="font-black text-gray-800 flex items-center gap-2 uppercase text-sm tracking-tighter">
              <Package size={20} className="text-blue-600" /> Módulos Ativos
            </h2>
          </div>

          <div className="p-4 md:p-6">
            {/* Banner Desconto */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs md:text-sm text-blue-900 font-bold">
                  Ative a Renovação Automática e ganhe descontos exclusivos!
                </p>
              </div>
              <button
                onClick={() => router.push("/system/sistema/cartao")}
                className="w-full md:w-auto text-xs font-black bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CreditCard size={14} /> CADASTRAR CARTÃO
              </button>
            </div>

            {/* LISTA DE PRODUTOS RESPONSIVA */}
            <div className="space-y-4">
              {/* MOBILE: CARD VIEW */}
              <div className="md:hidden space-y-3">
                {meusProdutos.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-gray-800 text-sm tracking-tight">
                        {p.nome}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Val: {p.validade}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">
                          Renovação
                        </p>
                        <select
                          value={p.meses}
                          onChange={(e) =>
                            handleMonthChange(p.id, e.target.value)
                          }
                          className="text-xs font-bold text-blue-600 outline-none bg-transparent cursor-pointer"
                        >
                          <option value="3">3 meses</option>
                          <option value="6">6 meses</option>
                          <option value="12">1 ano</option>
                        </select>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase">
                          Total
                        </p>
                        <p className="text-sm font-black text-gray-800">
                          R$ {(p.desconto * p.meses).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openConfirmModal(p.nome, p.meses)}
                      className="w-full bg-white border border-blue-200 text-blue-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:bg-blue-600 active:text-white transition-all shadow-sm"
                    >
                      <Save size={14} /> Atualizar Licença
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP: TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3 text-center">Período</th>
                      <th className="px-4 py-3 text-right">Valor Final</th>
                      <th className="px-4 py-3 text-center">Vencimento</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {meusProdutos.map((p) => (
                      <tr
                        key={p.id}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-5 font-bold text-gray-800">
                          {p.nome}
                        </td>
                        <td className="px-4 py-5 text-center">
                          <select
                            value={p.meses}
                            onChange={(e) =>
                              handleMonthChange(p.id, e.target.value)
                            }
                            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none cursor-pointer hover:border-blue-400"
                          >
                            <option value="3">3 meses</option>
                            <option value="6">6 meses</option>
                            <option value="12">1 ano</option>
                          </select>
                        </td>
                        <td className="px-4 py-5 text-right font-black text-gray-900">
                          R$ {(p.desconto * p.meses).toFixed(2)}
                        </td>
                        <td className="px-4 py-5 text-center text-gray-500 font-medium text-xs">
                          {p.validade}
                        </td>
                        <td className="px-4 py-5 text-right">
                          <button
                            onClick={() => openConfirmModal(p.nome, p.meses)}
                            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase cursor-pointer"
                          >
                            <Save size={14} /> Salvar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO CENTRALIZADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                  Renovação
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-8 space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Produto Selecionado
                </p>
                <p className="text-lg font-black text-blue-700 leading-tight">
                  {selectedProduct?.nome}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                  <ChevronRight size={14} className="text-blue-500" />{" "}
                  {selectedProduct?.meses} mês(es) de acesso
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-4 rounded-2xl bg-gray-100 text-gray-600 font-black text-[10px] uppercase active:scale-95 transition-all"
                >
                  VOLTAR
                </button>
                <button
                  onClick={confirmSave}
                  disabled={isSaving}
                  className="py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "CONFIRMAR"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
