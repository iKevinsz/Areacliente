"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Key, Package, Save, CreditCard, Info, 
  CheckCircle2, X, Loader2, Copy, Check 
} from "lucide-react";

export default function LicencasPage() {
  const router = useRouter();
  const [activeLicense] = useState("007155414E414B48BE531CA0A9536B0F11");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{nome: string, meses: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para feedback do botão copiar
  const [copied, setCopied] = useState(false);

  const [meusProdutos, setMeusProdutos] = useState([
    { id: 2, nome: "DATACAIXA PDV", meses: 3, total: 239.00, desconto: 227.05, validade: "31/12/2025" },
    { id: 3, nome: "DATACAIXA GESTÃO", meses: 3, total: 319.00, desconto: 303.05, validade: "31/12/2025" },
  ]);

  // Função para copiar a licença
  const handleCopyLicense = async () => {
    try {
      await navigator.clipboard.writeText(activeLicense);
      setCopied(true);
      // Reseta o ícone após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar: ", err);
    }
  };

  const handleMonthChange = (id: number, value: string) => {
    setMeusProdutos(prev => 
      prev.map(p => p.id === id ? { ...p, meses: parseInt(value) } : p)
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800 relative">
      
      {/* HEADER DA PÁGINA */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Key className="text-blue-600" /> Sistema / Licença
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas licenças e renovações módulos Datacaixa.</p>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* CARD 1: LICENÇA ATIVA COM BOTÃO COPIAR */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" /> Licença Ativa
          </label>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={activeLicense} 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-600 cursor-text selection:bg-blue-100 outline-none"
            />
            <button
              onClick={handleCopyLicense}
              className={`flex items-center gap-2 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
                copied 
                ? "bg-green-50 border-green-200 text-green-600" 
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
              title="Copiar chave de licença"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* CARD 2: TABELA DE MEUS PRODUTOS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Package size={20} className="text-blue-600" /> Meus Produtos
            </h2>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Ative a Renovação Automática para adquirir Licença com Desconto!</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/system/sistema/cartao")}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
              >
                <CreditCard size={16} /> Cadastrar cartão
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-4 py-3">Descrição</th>
                    <th className="px-4 py-3 text-center">Meses</th>
                    <th className="px-4 py-3 text-right">Vr. Total</th>
                    <th className="px-4 py-3 text-center">Validade</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {meusProdutos.map((p) => (
                    <tr key={p.id} className="text-sm group hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-bold text-gray-700 cursor-default">{p.nome}</td>
                      <td className="px-4 py-4">
                        <select 
                          value={p.meses}
                          onChange={(e) => handleMonthChange(p.id, e.target.value)}
                          className="mx-auto block bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer hover:border-blue-400 transition-all"
                        >
                          <option value="1">3 meses</option>
                          <option value="6">6 meses</option>
                          <option value="12">1 ano</option>
                          <option value="24">2 anos</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right cursor-default">
                        <p className="font-bold text-gray-800 font-mono">R$ {(p.desconto * p.meses).toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600 cursor-default">{p.validade}</td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => openConfirmModal(p.nome, p.meses)}
                          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold text-xs uppercase cursor-pointer shadow-sm active:scale-95"
                        >
                          <Save size={16} /> Salvar
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

      {/* MODAL DE CONFIRMAÇÃO */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirmar Renovação</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-600">Você está solicitando a renovação de:</p>
                <p className="text-lg font-bold text-blue-700 mt-1">{selectedProduct?.nome}</p>
                <div className="flex justify-between mt-3 text-sm border-t border-blue-100 pt-2">
                  <span className="text-blue-600 font-medium">Período selecionado:</span>
                  <span className="font-bold text-blue-800">{selectedProduct?.meses} mês(es)</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 cursor-pointer transition-colors active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmSave}
                  disabled={isSaving}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 cursor-pointer transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : "Confirmar e Pagar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}