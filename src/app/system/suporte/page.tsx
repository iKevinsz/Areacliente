"use client";

import React from "react";
import { 
  Headset, 
  MessageCircle, 
  HelpCircle, 
  Youtube, 
  ExternalLink, 
  PhoneCall,
  Clock
} from "lucide-react";

export default function SuportePage() {
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

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Headset className="text-blue-600" /> Central de Atendimento
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Precisa de ajuda? Escolha um dos canais abaixo para falar conosco.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suporteLinks.map((item, index) => (
          <div 
            key={index} 
            className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 flex flex-col h-full ${item.color} hover:shadow-md hover:-translate-y-1`}
          >
            <div className="mb-4 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center">
              {item.icon}
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">
              {item.description}
            </p>
            
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors group"
            >
              {item.buttonText}
              <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600" />
            </a>
          </div>
        ))}
      </div>

      {/* Info Adicional */}
      <div className="mt-8 bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="bg-white/20 p-3 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg">Horário de Funcionamento</h4>
            <p className="text-blue-100 text-sm">Atendimento das 8:00 às 22:00 todos os dias, incluindo Sábados, Domingos e Feriados.

</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <PhoneCall size={18} />
          <span className="font-mono font-bold">(11) 98620-5451</span>
        </div>
      </div>
    </div>
  );
}