"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Mail, Lock, ArrowRight, Loader2, 
  Eye, EyeOff, User, ShieldCheck, CheckCircle2, AlertTriangle, X 
} from "lucide-react";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Novo estado para o Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validação de Front-end
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem!");
      return;
    }

    setIsLoading(true);

    const result = await registerUser({ name, email, password });

    if (result.success) {
      // SUCESSO: Exibe o modal em vez de redirecionar direto
      setIsLoading(false);
      setShowSuccessModal(true);
    } else {
      setErrorMessage(result.error || "Ocorreu um erro.");
      setIsLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    router.push("/auth/login?success=true");
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden relative">
      
      {/* LADO ESQUERDO: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#003366] relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-white space-y-4 max-w-lg">
            <ShieldCheck className="w-20 h-20 text-orange-500 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-4xl font-bold tracking-tight">Comece sua jornada!</h1>
            <p className="text-blue-100 text-lg leading-relaxed font-medium">
              Junte-se a milhares de empresas que otimizam seus processos com a Datacaixa.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
               <p className="text-2xl font-bold">100%</p>
               <p className="text-xs opacity-70 uppercase">Seguro</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
               <p className="text-2xl font-bold">Suporte</p>
               <p className="text-xs opacity-70 uppercase">Especializado</p>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO DE CADASTRO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-12 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Criar nova conta</h2>
            <p className="text-sm text-gray-500 mt-2">Preencha os dados para ativar seu acesso.</p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertTriangle size={16} />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* INPUT NOME */}
            <div className={`group relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Nome Completo</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-white transition-colors ${focusedField === 'name' ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}`}>
                <User className={`w-5 h-5 ${focusedField === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full ml-3 outline-none text-sm font-medium text-gray-700 bg-transparent"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            {/* INPUT EMAIL */}
            <div className={`group relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">E-mail Corporativo</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-white transition-colors ${focusedField === 'email' ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}`}>
                <Mail className={`w-5 h-5 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full ml-3 outline-none text-sm font-medium text-gray-700 bg-transparent"
                  placeholder="exemplo@empresa.com.br"
                  required
                />
              </div>
            </div>

            {/* INPUT SENHA */}
            <div className={`group relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Senha</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-white transition-colors ${focusedField === 'password' ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}`}>
                <Lock className={`w-5 h-5 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full ml-3 outline-none text-sm font-medium text-gray-700 bg-transparent"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR SENHA */}
            <div className={`group relative transition-all duration-300 ${focusedField === 'confirm' ? 'scale-[1.02]' : ''}`}>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Confirmar Senha</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-white transition-colors ${focusedField === 'confirm' ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}`}>
                <Lock className={`w-5 h-5 ${focusedField === 'confirm' ? 'text-blue-500' : 'text-gray-400'}`} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full ml-3 outline-none text-sm font-medium text-gray-700 bg-transparent"
                  placeholder="Repita sua senha"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Criar minha conta
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Já possui uma conta?{' '}
              <Link 
                href="/auth/login" 
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors hover:underline cursor-pointer"
              >
                Fazer login
              </Link>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mt-8 opacity-60">
            <CheckCircle2 size={12} className="text-green-500" />
            Dados protegidos pela LGPD
          </div>

        </div>
      </div>

      {/* --- MODAL DE SUCESSO --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-300 relative">
            
            {/* Ícone de Sucesso Animado */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Conta Criada!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Seu cadastro foi realizado com sucesso. Agora você já pode acessar a plataforma.
              </p>
            </div>

            <button 
              onClick={handleRedirectToLogin}
              className="w-full bg-[#003366] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Ir para o Login
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}