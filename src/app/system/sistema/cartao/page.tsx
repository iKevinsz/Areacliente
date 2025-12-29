"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Loader2,
  ChevronLeft,
  Save,
  Info,
  Lock,
  CheckCircle,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CadastrarCartaoPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    numeroCartao: "",
    validadeMes: "1",
    validadeAno: "2025",
    nome: "",
    cvv: "",
    parcelas: "1",
    documento: "", 
    celular: "",
    email: ""
  });

  useEffect(() => {
    async function loadEmpresaData() {
      try {
        const response = await fetch("/api/empresa");
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            documento: data.cnpj_cpf || "14.356.429/0001-20",
            celular: data.celular || "",
            email: data.email || ""
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da empresa:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEmpresaData();
  }, []);

  const maskCartao = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1 $2")
      .substring(0, 19); 
  };

  const maskCelular = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "numeroCartao") maskedValue = maskCartao(value);
    if (name === "celular") maskedValue = maskCelular(value);
    if (name === "nome") maskedValue = value.toUpperCase().substring(0, 50);
    if (name === "cvv") maskedValue = value.replace(/\D/g, "").substring(0, 3); 

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cvv.length < 3) {
      alert("O CVV deve ter exatamente 3 dígitos.");
      return;
    }
    setIsSaving(true);
    
    // Simulação de salvamento no banco de dados
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const closeAndRedirect = () => {
    setShowSuccessModal(false);
    router.push("/sistema/licencas");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between max-w-[1000px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="text-blue-600" /> Sistema / Assinatura e Cobrança
        </h1>
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 font-medium cursor-pointer transition-colors">
          <ChevronLeft size={18} /> Voltar
        </button>
      </div>

      <div className="max-w-[1000px] mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 font-bold text-gray-800">
            Cadastrar Cartão
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              <div className="md:col-span-12 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock size={10} /> CPF/CNPJ do Titular (Puxado de Meus Dados)
                </label>
                <input 
                  type="text" 
                  name="documento" 
                  value={formData.documento} 
                  readOnly
                  className="w-full border border-gray-200 bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed font-medium" 
                />
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Número do Cartão</label>
                <input 
                  type="text" name="numeroCartao" value={formData.numeroCartao} onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none font-mono" required
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mês</label>
                <select name="validadeMes" value={formData.validadeMes} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer bg-white">
                  {Array.from({ length: 12 }, (_, i) => (<option key={i+1} value={i+1}>{String(i+1).padStart(2, '0')}</option>))}
                </select>
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ano</label>
                <select name="validadeAno" value={formData.validadeAno} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer bg-white">
                  {Array.from({ length: 11 }, (_, i) => (<option key={i} value={2025+i}>{2025+i}</option>))}
                </select>
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome Impresso no Cartão</label>
                <input 
                  type="text" name="nome" value={formData.nome} onChange={handleChange}
                  placeholder="NOME EXATAMENTE COMO NO CARTÃO"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none uppercase" required
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CVV</label>
                <input 
                  type="text" name="cvv" value={formData.cvv} onChange={handleChange}
                  placeholder="000" maxLength={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none font-mono" required
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parcelas</label>
                <select name="parcelas" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer bg-white">
                  {Array.from({ length: 12 }, (_, i) => (<option key={i+1} value={i+1}>{i+1}x sem juros</option>))}
                </select>
              </div>

              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Celular</label>
                <input 
                  type="text" name="celular" value={formData.celular} onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" required
                />
              </div>
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  placeholder="exemplo@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" required
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-amber-700 leading-relaxed">
                Um lançamento de <strong>R$ 1,00</strong> será feito para validar o cartão e estornado automaticamente em seguida.
              </p>
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer">
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Cadastrar Cartão</>}
            </button>
          </form>
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={closeAndRedirect}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cartão Cadastrado!
            </h2>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              Seu cartão final <span className="font-bold text-gray-800">*{formData.numeroCartao.slice(-4)}</span> foi validado e cadastrado com sucesso no sistema.
            </p>

            <button 
              onClick={closeAndRedirect}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Ir para Licenças
            </button>
          </div>
        </div>
      )}
    </div>
  );
}