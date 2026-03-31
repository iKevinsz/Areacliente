"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Mail, Lock, ArrowRight, Loader2, ArrowLeft,
  User, ShieldCheck, CheckCircle2, 
  AlertTriangle, Phone, Building2, Inbox, Eye, EyeOff
} from "lucide-react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [personType, setPersonType] = useState<"PF" | "PJ">("PJ");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    ie: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // --- LÓGICA DE MÁSCARAS ---
  const applyMask = (name: string, value: string) => {
    const rawValue = value.replace(/\D/g, "");

    switch (name) {
      case "document":
        if (personType === "PF") {
          return rawValue
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .substring(0, 14);
        } else {
          return rawValue
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})/, "$1-$2")
            .substring(0, 18);
        }
      case "phone":
        return rawValue
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2")
          .substring(0, 15);
      case "ie":
        return rawValue.substring(0, 15);
      default:
        return value;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const masked = applyMask(name, value);
    setFormData((prev) => ({ ...prev, [name]: masked }));
    if (errorMessage) setErrorMessage(""); // Limpa erro ao digitar
  };

  // --- VALIDAÇÃO POR ETAPA ---
  const validateStep = () => {
    setErrorMessage("");
    
    if (step === 1) {
      if (!formData.name.trim()) return "Todos os campos são obrigatórios.";
      const docClean = formData.document.replace(/\D/g, "");
      if (personType === "PF" && docClean.length !== 11) return "CPF inválido.";
      if (personType === "PJ" && docClean.length !== 14) return "CNPJ inválido.";
    }

    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return "Insira um e-mail válido.";
      if (formData.phone.replace(/\D/g, "").length < 10) return "Número de celular incompleto.";
    }

    if (step === 3) {
      if (formData.password.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
      if (formData.password !== formData.confirmPassword) return "As senhas não coincidem.";
    }

    return null;
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setStep(step + 1);
  };

  const handleFinalize = async () => {
    const error = validateStep();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser(formData);
      if (result.success) setStep(4);
      else setErrorMessage(result.error || "Erro ao criar conta.");
    } catch (error) {
      setErrorMessage("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, icon: personType === "PJ" ? Building2 : User },
    { id: 2, icon: Mail },
    { id: 3, icon: Lock },
    { id: 4, icon: Inbox },
  ];

  return (
    <div className="min-h-screen bg-[#eaeff5] flex flex-col items-center justify-center p-4 font-sans">
      
      <Link 
        href="/auth/login" 
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-[#2563eb] font-bold text-sm transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para o Login
      </Link>

      <div className="bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        <div className="bg-[#f8fafc] border-b border-gray-100 px-8 py-8">
          <div className="relative flex justify-between items-center max-w-[280px] mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-[#2563eb] -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            {steps.map((s) => (
              <div key={s.id} className="relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= s.id ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-100' : 'bg-white border-2 border-gray-200 text-gray-300'
                }`}>
                  {step > s.id ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo-datacaixa-site.png" alt="Datacaixa" className="h-12 mb-4" />
            <h1 className="text-xl font-bold text-[#0f2133]">
              {step === 4 ? "Sucesso!" : "Área do Cliente"}
            </h1>
            <p className="text-[11px] text-gray-400 mt-1 font-bold uppercase tracking-widest">
              {step === 4 ? "Cadastro realizado" : `Passo ${step} de 3`}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-100 animate-shake">
              <AlertTriangle size={14} /> {errorMessage}
            </div>
          )}

          {step === 4 ? (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                <div className="relative w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner border border-blue-100">
                  <Inbox size={38} className="animate-bounce" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#0f2133]">Verifique seu e-mail</h2>
                <p className="text-sm text-gray-500 leading-relaxed px-2">
                  Um link de ativação foi enviado para: <br/>
                  <span className="text-[#2563eb] font-bold break-all">{formData.email}</span>
                </p>
              </div>
              <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full py-4 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                Acessar minha conta <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {step === 1 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex p-1 bg-gray-50 rounded-xl gap-1">
                    {["PJ", "PF"].map((t) => (
                      <button 
                        key={t} 
                        type="button"
                        onClick={() => {setPersonType(t as any); setFormData(p => ({...p, document: ""}))}} 
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${personType === t ? 'bg-white text-[#2563eb] shadow-sm' : 'text-gray-400'}`}
                      >
                        {t === "PJ" ? "EMPRESA" : "PESSOA FÍSICA"}
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">DOCUMENTO ({personType})</label>
                    <input 
                      name="document" value={formData.document} onChange={handleInputChange} 
                      placeholder={personType === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"} 
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all font-medium" 
                    />
                  </div>

                  {personType === "PJ" && (
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">INSCRIÇÃO ESTADUAL</label>
                      <input 
                        name="ie" value={formData.ie} onChange={handleInputChange} 
                        placeholder="Número da IE" 
                        className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white transition-all font-medium" 
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">{personType === "PJ" ? "RAZÃO SOCIAL" : "NOME COMPLETO"}</label>
                    <input 
                      name="name" value={formData.name} onChange={handleInputChange} 
                      placeholder="Insira o nome" 
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white transition-all font-medium" 
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">E-MAIL DE ACESSO</label>
                    <input 
                      name="email" type="email" value={formData.email} onChange={handleInputChange} 
                      placeholder="exemplo@email.com" 
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white transition-all font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">WHATSAPP / CELULAR</label>
                    <input 
                      name="phone" value={formData.phone} onChange={handleInputChange} 
                      placeholder="(00) 00000-0000" 
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white transition-all font-medium" 
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">SENHA</label>
                    <div className="relative">
                      <input 
                        name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} 
                        className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white transition-all font-medium" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">CONFIRME A SENHA</label>
                    <input 
                      name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} 
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white transition-all font-medium" 
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)} 
                    className="px-5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all border border-gray-100 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={step === 3 ? handleFinalize : handleNext} 
                  disabled={isLoading}
                  className="flex-1 bg-[#2563eb] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : (step === 3 ? "Finalizar Cadastro" : "Próximo Passo")}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </div>

              <div className="text-center pt-6">
                <p className="text-xs text-gray-400 font-medium">
                  Já possui uma conta? <Link href="/auth/login" className="text-[#2563eb] font-bold hover:underline cursor-pointer">Entrar</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
        <ShieldCheck size={14} className="text-green-500" /> AMBIENTE SEGURO
      </div>
    </div>
  );
}