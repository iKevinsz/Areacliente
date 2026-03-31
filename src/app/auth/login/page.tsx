"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Mail, Lock, ArrowRight, Loader2, 
  Eye, EyeOff, CheckCircle2, AlertTriangle, Check 
} from "lucide-react";

import { loginUser } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Recuperação do e-mail salvo
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); 

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    const result = await loginUser({ email, password, rememberMe });

    if (result.success) {
      router.push("/system/perfil");
    } else {
      setErrorMessage(result.error || "Erro ao realizar login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:p-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex justify-center mb-8">
          <img 
            src="/datacaixa-facebook-2.jpg" 
            alt="Logo Datacaixa" 
            className="h-20 w-auto object-contain rounded-xl"
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Acesse sua conta</h2>
          <p className="text-sm text-gray-500 mt-2">Insira suas credenciais para continuar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake">
              <AlertTriangle size={18} />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* INPUT EMAIL */}
          <div className={`group relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">E-mail</label>
            <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-gray-50 transition-all ${focusedField === 'email' ? 'border-blue-500 bg-white shadow-md' : 'border-gray-100'}`}>
              <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full ml-3 outline-none text-sm font-medium text-gray-700 bg-transparent cursor-text"
                placeholder="exemplo@datacaixa.com.br"
                required
              />
            </div>
          </div>

          {/* INPUT SENHA */}
          <div className={`group relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.01]' : ''}`}>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Senha</label>
              <Link 
                href="/auth/forgot-password" 
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                Esqueceu?
              </Link>
            </div>
            <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-gray-50 transition-all ${focusedField === 'password' ? 'border-blue-500 bg-white shadow-md' : 'border-gray-100'}`}>
              <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full ml-3 outline-none text-sm font-medium text-gray-700 bg-transparent cursor-text"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CHECKBOX CUSTOMIZADO COM PONTEIRO CORRETO */}
          <div className="flex items-center py-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-blue-400'}`}>
                {rememberMe && <Check size={14} className="text-white stroke-[3]" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              <span className="text-sm font-medium text-gray-600">Lembrar acesso</span>
            </label>
          </div>

          {/* BOTÃO LOGIN COM ESTADOS DE CURSOR */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Entrar no Sistema 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
          <p className="text-sm text-gray-500">
            Ainda não tem uma conta?{' '}
            <Link href="/auth/register" className="font-bold text-blue-600 hover:underline cursor-pointer">
              Criar conta
            </Link>
          </p>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest opacity-80">
            <CheckCircle2 size={12} className="text-green-500" />
            Ambiente Seguro
          </div>
        </div>
      </div>
    </div>
  );
}