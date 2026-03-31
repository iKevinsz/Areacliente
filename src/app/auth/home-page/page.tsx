'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  UserCircle, UserPlus, ChevronRight, Store, 
  Check, X, Sparkles 
} from 'lucide-react';

const FEATURES = [
  "Controle de Pedidos", "Gestão de Vendas", "Controle de Caixa", "Emissão de Recibo",
  "Relatórios Gerenciais", "Dashboard Online", "Backup Nuvem", "Cardápio Digital",
  "App de Delivery Pededaki", "Controle de Estoque", "App Garçom", "NFC-e",
  "NF-e / NFS-e", "Integração iFood", "Datacaixa POS", "Baixa XML",
  "Emissão de Boletos", "Monitor KDS", "TEF", "Sped Fiscal", "Pixel do Facebook"
];

const SUPPORT = [
  "Suporte por WhatsApp", "Acesso Remoto", "Implantação", "Cadastro de Produtos",
  "Treinamento Adicional", "Instalação de Equipamentos (Impressora, Balança, etc...)",
  "Customização de Relatório", "Gerente de Contas"
];

const PLANOS = [
  { nome: 'Básico', mensal: '59', anual: '599', parcelaAnual: '49,91', economia: '109', featuresCount: 8, supportCount: 1, destaque: false },
  { nome: 'Profissional', mensal: '99', anual: '899', parcelaAnual: '74,91', economia: '289', featuresCount: 12, supportCount: 3, destaque: false },
  { nome: 'Empresarial', mensal: '149', anual: '1.299', parcelaAnual: '108,25', economia: '489', featuresCount: 18, supportCount: 6, destaque: true },
  { nome: 'Corporativo', mensal: '249', anual: '1.999', parcelaAnual: '166,58', economia: '989', featuresCount: 21, supportCount: 8, destaque: false }
];

export default function WelcomePage() {
  const [isAnnual, setIsAnnual] = useState(true);

  // Lógica de animação ao scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleEscolherPlano = (planoNome: string) => {
    const telefone = "5511999999999"; 
    const mensagem = encodeURIComponent(`Olá! Gostaria de saber mais sobre o plano ${planoNome} (${isAnnual ? 'Anual' : 'Mensal'}) que vi no site.`);
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-x-hidden scroll-smooth relative">
      
      {/* 1. TETO BRANCO */}
      <div className="absolute top-3 left-0 right-0 w-full h-[85px] md:h-[80px] bg-white z-30 shadow-sm border-b border-slate-100"></div>

      {/* 2. NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 flex justify-center pointer-events-none">
        <header className="pointer-events-auto mt-3 md:mt-0 w-full max-w-6xl bg-white px-5 md:px-8 py-6.5 flex items-center justify-between shadow-xl rounded-b-2xl md:rounded-b-[2rem] border-b border-x border-slate-200/50 transition-all">
          <div className="flex items-center gap-2 cursor-pointer group">
            <img src="/logo-datacaixa-site.png" alt="Logo Datacaixa" className="h-7 md:h-9 w-auto object-contain" />
            <div id="logo-fallback" className="hidden items-center gap-2 text-xl md:text-2xl font-black text-[#0f2133] tracking-tight">
              <div className="w-8 h-8 bg-[#ef6132] rounded-md flex items-center justify-center text-white"><Store size={20} /></div>
              Datacaixa
            </div>
          </div>

          <div className="flex items-center gap-2.5 md:gap-3">
            <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#0f2133] text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#1a365d] transition-colors shadow-sm active:scale-95 cursor-pointer">
              <UserCircle size={18} className="opacity-90" /> Entrar
            </Link>
            <Link href="/auth/register" className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#0f2133] text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#1a365d] transition-colors shadow-sm active:scale-95 cursor-pointer">
              <UserPlus size={18} className="opacity-90" /> Cadastro
            </Link>
          </div>
        </header>
      </div>

      {/* 3. HERO SECTION */}
      <section className="relative w-full bg-[#0a1e35] pt-44 pb-32 md:pt-52 md:pb-48 flex flex-col items-center justify-center px-4 z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-white -skew-y-2 origin-top-left z-0"></div>
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center mt-4 reveal transition-all duration-1000 opacity-0 translate-y-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-8 px-5 py-2 rounded-full border border-blue-500/20 backdrop-blur-md">
             Sistema de Gestão Completo
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight">
            A Solução Ideal para <br/> o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Negócio</span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl max-w-2xl leading-relaxed mb-12 font-medium opacity-90">
            Controle vendas, estoque e notas fiscais com a plataforma mais amada pelos empreendedores brasileiros.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <a href="#planos" className="w-full sm:w-auto px-10 py-4.5 bg-[#ef6132] hover:bg-[#cf4e22] hover:scale-105 hover:shadow-[0_20px_40px_rgba(239,97,50,0.4)] text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 text-base group cursor-pointer">
              Conhecer Planos <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/auth/login" className="w-full sm:w-auto px-10 py-4.5 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-black rounded-2xl flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95 text-base cursor-pointer">
              Acessar meu painel
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[120px]">
            <path className="fill-slate-50" d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* 4. SEÇÃO DE PLANOS */}
      <section id="planos" className="py-24 md:py-32 px-4 relative z-10 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-16 reveal transition-all duration-700 opacity-0 translate-y-10">
            <p className="text-[#ef6132] font-black text-sm uppercase tracking-widest mb-4">Ainda não possui nosso sistema?</p>
            <h2 className="text-3xl md:text-6xl font-black text-[#0f2133] tracking-tighter">
              Conheça nossos planos
            </h2>
          </div>

          {/* TOGGLE */}
          <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl border border-slate-100 mb-20 relative reveal transition-all duration-700 delay-200 opacity-0 translate-y-10">
            <button onClick={() => setIsAnnual(false)} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${!isAnnual ? 'bg-[#0f2133] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600'}`}>Mensal</button>
            <button onClick={() => setIsAnnual(true)} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer flex items-center gap-2 ${isAnnual ? 'bg-[#0f2133] text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
              Anual <span className={`text-[10px] px-2 py-0.5 rounded-md font-black ${isAnnual ? 'bg-[#ef6132] text-white' : 'bg-orange-100 text-orange-600'}`}>-20%</span>
            </button>
          </div>

          {/* GRID DOS PLANOS COM ANIMAÇÃO EM CASCATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full items-stretch">
            {PLANOS.map((plano, index) => (
              <div 
                key={index} 
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`bg-white rounded-[3rem] flex flex-col relative transition-all duration-700 group reveal opacity-0 translate-y-10 ${
                  plano.destaque 
                    ? 'border-4 border-[#0f2133] shadow-[0_40px_80px_rgba(15,33,51,0.15)] z-10 xl:-translate-y-6' 
                    : 'border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-4'
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0f2133] text-white text-[11px] font-black uppercase tracking-widest px-8 py-2 rounded-full shadow-xl">
                    O Mais Vendido
                  </div>
                )}

                <div className="p-10 pb-8 border-b border-slate-50">
                  <h3 className="text-2xl font-black text-[#0f2133] mb-6">{plano.nome}</h3>
                  <div className="min-h-[120px] flex flex-col justify-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-slate-300">R$</span>
                      <span className="text-6xl font-black text-[#0f2133] tracking-tighter">{isAnnual ? plano.anual : plano.mensal}</span>
                      <span className="text-slate-400 font-bold text-sm">/{isAnnual ? 'ano' : 'mês'}</span>
                    </div>
                    <div className={`mt-5 space-y-2 transition-all duration-500 ${isAnnual ? 'opacity-100' : 'opacity-0'}`}>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ou 12x R$ {plano.parcelaAnual}</p>
                      <div className="inline-flex bg-green-50 text-green-600 text-[11px] font-black px-3 py-1 rounded-lg border border-green-100">Economize R$ {plano.economia}</div>
                    </div>
                  </div>
                </div>

                <div className="p-10 flex-1 flex flex-col">
                  <ul className="space-y-4.5 mb-12 flex-1">
                    {FEATURES.map((feature, i) => (
                      <li key={i} className={`flex items-start gap-4 text-sm font-bold ${i < plano.featuresCount ? 'text-slate-600' : 'text-slate-200'}`}>
                        <div className={`shrink-0 mt-0.5 rounded-lg p-1 ${i < plano.featuresCount ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-200'}`}>
                          {i < plano.featuresCount ? <Check size={14} strokeWidth={4} /> : <X size={14} strokeWidth={4} />}
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleEscolherPlano(plano.nome)}
                    className={`group/btn w-full py-5 rounded-2xl font-black text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    plano.destaque ? 'bg-[#ef6132] text-white hover:bg-[#cf4e22]' : 'bg-[#0f2133] text-white hover:bg-slate-800'
                  }`}>
                    Escolher Plano
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}