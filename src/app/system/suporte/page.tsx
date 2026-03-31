"use client";

import React, { useState, useEffect } from "react";
import { 
  Headset, 
  MessageCircle, 
  HelpCircle, 
  Youtube, 
  ExternalLink, 
  PhoneCall,
  Clock,
  PlayCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function SuportePage() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const suporteLinks = [
    {
      title: "WhatsApp Suporte",
      description: "Fale diretamente com nossa equipe técnica via chat.",
      info: "(11) 98620-5451",
      icon: <MessageCircle className="text-green-500" size={32} />,
      link: "https://wa.me/1198620-5451",
      buttonText: "Iniciar Conversa",
      color: "hover:border-green-200"
    },
    {
      title: "Central de Ajuda",
      description: "Tutoriais detalhados e perguntas frequentes sobre o sistema.",
      info: "https://datacaixa.com.br/ajuda/",
      icon: <HelpCircle className="text-blue-500" size={32} />,
      link: "https://datacaixa.com.br/ajuda/",
      buttonText: "Acessar Base de Conhecimento",
      color: "hover:border-blue-200"
    },
    {
      title: "Canal no YouTube",
      description: "Vídeos passo a passo para você dominar todas as funções.",
      info: "Vídeos Informativos",
      icon: <Youtube className="text-red-500" size={32} />,
      link: "https://www.youtube.com/@Datacaixa",
      buttonText: "Assistir Tutoriais",
      color: "hover:border-red-200"
    }
  ];

  const getYouTubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  const videosTutoriais = [
    { title: "Como instalar o Datacaixa Garçom", link: "https://www.youtube.com/watch?v=RLCRxrrVDR0", thumb: getYouTubeThumb("RLCRxrrVDR0") },
    { title: "Utilizando Ingredientes | Datacaixa PDV", link: "https://youtu.be/lfV1k6pECNg", thumb: getYouTubeThumb("lfV1k6pECNg") },
    { title: "Utilizando Fator de Conversão", link: "https://www.youtube.com/watch?v=P1beemFcYik", thumb: getYouTubeThumb("P1beemFcYik") },
    { title: "Nota Fiscal Entrada | Datacaixa Gestão", link: "https://www.youtube.com/watch?v=1NY1LGl_SqI", thumb: getYouTubeThumb("1NY1LGl_SqI") },
    { title: "Configuração Emissão NFC-e", link: "https://www.youtube.com/watch?v=80hcATwpARc", thumb: getYouTubeThumb("80hcATwpARc") },
  ];

  // Lógica de navegação
  const handleNext = () => {
    setVideoIndex((prev) => (prev + 1) % (videosTutoriais.length - 2));
  };

  const handlePrev = () => {
    setVideoIndex((prev) => (prev - 1 + (videosTutoriais.length - 2)) % (videosTutoriais.length - 2));
  };

  // Rotação Automática
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, videosTutoriais.length]);

  const visibleVideos = videosTutoriais.slice(videoIndex, videoIndex + 3);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen font-sans overflow-x-hidden">
      <div className="p-4 md:p-8 w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Headset className="text-blue-600" /> Central de Atendimento
          </h1>
          <p className="text-gray-500 text-sm mt-1">Precisa de ajuda? Escolha um dos canais abaixo.</p>
        </div>

        {/* Suporte Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {suporteLinks.map((item, idx) => (
            <div key={idx} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md ${item.color} flex flex-col h-full`}>
              <div className="mb-4 bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                {item.buttonText} <ExternalLink size={14} className="text-gray-400" />
              </a>
            </div>
          ))}
        </div>

        {/* Tutoriais com Setas de Navegação */}
        <div 
          className="mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <PlayCircle className="text-red-500" size={24} /> Tutoriais em Destaque
            </h2>
            
            {/* SETAS DE NAVEGAÇÃO */}
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm text-gray-600 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm text-gray-600 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Grid de Vídeos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleVideos.map((video, idx) => (
              <a 
                key={`${video.title}-${idx}`}
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all animate-in fade-in zoom-in-95 duration-500"
              >
                <div className="aspect-video bg-gray-200 relative flex items-center justify-center overflow-hidden">
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                  <Youtube className="absolute text-white opacity-80 group-hover:opacity-100 transition-all drop-shadow-xl" size={44} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-bold text-gray-700 text-sm truncate pr-2">{video.title}</span>
                  <PlayCircle size={16} className="text-blue-500 shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Rodapé Info */}
        <div className="mt-12 bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-white/20 p-3 rounded-full"><Clock size={24} /></div>
            <div>
              <h4 className="font-bold text-lg">Horário de Funcionamento</h4>
              <p className="text-blue-100 text-sm">Atendimento das 8:00 às 22:00 todos os dias, incluindo Sábados, Domingos e Feriados.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
            <PhoneCall size={18} />
            <span className="font-mono font-bold text-lg">(11) 98620-5451</span>
          </div>
        </div>
      </div>
    </div>
  );
}