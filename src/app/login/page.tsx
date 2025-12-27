"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Mail, Lock, ArrowRight, Loader2, 
  Eye, EyeOff, CheckCircle2 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de delay de autenticação
    setTimeout(() => {
      setIsLoading(false);
      router.push("/system/perfil"); // Ajuste para sua rota inicial
    }, 2000);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      
      {/* LADO ESQUERDO: BRANDING & LOGO */}
      <div className="hidden lg:flex w-1/2 bg-[#003366] relative items-center justify-center p-12 overflow-hidden">
        
        {/* Elementos Decorativos de Fundo */}
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px] animate-pulse delay-75"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        {/* Aumentei o espaçamento vertical aqui de space-y-6 para space-y-10 */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* LOGO MAIOR, SEM FUNDO AZUL CLARO, E COM BORDA ADICIONADA */}
          {/* Adicionei um container relativo para aplicar a borda e o brilho */}
          <div className="relative group">
            {/* Efeito de brilho/borda atrás da imagem */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            
            <img 
              src="/datacaixa-facebook-2.jpg" 
              alt="Logo Datacaixa" 
              // Aumentei de h-20 para h-48 e adicionei as classes de animação de hover diretamente na imagem
              // Adicionei classes de borda: border-4 border-white/20 rounded-3xl
              className="relative h-100 w-auto object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500 border-4 border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm p-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                // Ajustei o tamanho do fallback também para ficar proporcional
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="flex flex-col items-center">
                    <div class="w-32 h-32 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                        <div class="w-12 h-12 bg-[#FF6600] rounded-md shadow-lg"></div>
                    </div>
                    <span class="text-white font-bold text-3xl tracking-tight drop-shadow-md">Datacaixa</span>
                  </div>
                `;
              }}
            />
          </div>

          <div className="text-white space-y-4 max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight drop-shadow-sm">Seja Bem-vindo!</h1>
            <p className="text-blue-100 text-lg leading-relaxed font-medium drop-shadow-sm">
              Acesse sua conta para gerenciar vendas, estoques e relatórios com a tecnologia Datacaixa.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO (Sem alterações) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Acesse sua conta</h2>
            <p className="text-sm text-gray-500 mt-2">Por favor, insira suas credenciais abaixo.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* INPUT EMAIL */}
            <div className={`group relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">E-mail</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-white transition-colors ${focusedField === 'email' ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}`}>
                <Mail className={`w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full ml-3 outline-none text-sm font-medium text-gray-700 placeholder:text-gray-300 bg-transparent"
                  placeholder="exemplo@datacaixa.com.br"
                  required
                />
              </div>
            </div>

            {/* INPUT SENHA */}
            <div className={`group relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Senha</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">Esqueceu a senha?</a>
              </div>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 bg-white transition-colors ${focusedField === 'password' ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'}`}>
                <Lock className={`w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full ml-3 outline-none text-sm font-medium text-gray-700 placeholder:text-gray-300 bg-transparent"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* BOTÃO LOGIN */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group"
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
          
          {/* RODAPÉ DO FORMULÁRIO */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Ainda não tem uma conta?{' '}
              <a 
                href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20ajuda%20com%20o%20acesso%20ao%20sistema." 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors hover:underline cursor-pointer"
              >
                Fale com o suporte
              </a>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mt-8 opacity-60 select-none">
            <CheckCircle2 size={12} className="text-green-500" />
            Ambiente Seguro & Criptografado
          </div>

        </div>
      </div>
    </div>
  );
}