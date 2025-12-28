'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Por favor, digite seu e-mail.');
      return;
    }

    // Simulação de envio para API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* --- TOPO / CABEÇALHO --- */}
        <div className="bg-white p-8 pb-0 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            {step === 'form' ? (
              <KeyRound className="text-blue-600 w-8 h-8" />
            ) : (
              <CheckCircle2 className="text-green-600 w-8 h-8" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'form' ? 'Esqueceu a senha?' : 'Verifique seu e-mail'}
          </h2>
          
          <p className="text-sm text-gray-500 leading-relaxed">
            {step === 'form' 
              ? 'Não se preocupe! Digite seu e-mail abaixo e enviaremos instruções para recuperar sua conta.' 
              : `Enviamos um link de recuperação para ${email}. Acesse sua caixa de entrada.`}
          </p>
        </div>

        {/* --- CONTEÚDO DO FORMULÁRIO --- */}
        <div className="p-8">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Input de E-mail */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">
                  E-mail Cadastrado
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-100'} rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-sm font-medium`}
                    placeholder="exemplo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-xs font-medium animate-in slide-in-from-left-1">
                    <AlertCircle size={12} /> {error}
                  </div>
                )}
              </div>

              {/* Botão de Ação */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>
          ) : (
            // --- ESTADO DE SUCESSO ---
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-700 font-medium">
                  Não recebeu o e-mail? Verifique sua caixa de spam ou lixo eletrônico.
                </p>
              </div>

              <button
                onClick={() => { setStep('form'); setEmail(''); }}
                className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm cursor-pointer"
              >
                Tentar outro e-mail
              </button>
            </div>
          )}

          {/* --- RODAPÉ / VOLTAR --- */}
          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Voltar para o Login
            </Link>
          </div>
        </div>

      </div>
      
      {/* Footer simples */}
      <div className="fixed bottom-6 text-center w-full text-xs text-gray-400">
        &copy; 2025 Datacaixa Tecnologia. Todos os direitos reservados.
      </div>

    </div>
  );
}