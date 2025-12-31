"use client";

import React from "react";
import { Monitor, Smartphone, Download, ExternalLink } from "lucide-react";

export default function DownloadsPage() {
  const linksDownload = [
    {
      id: "datacaixa",
      titulo: "Download Datacaixa",
      descricao: "Sistema para Ponto de Venda e Gestão Empresarial.",
      tipo: "desktop",
      imagemUrl: "/img/logo-datacaixa.png", 
      
      urlDownload: "https://datacaixa.com.br/downloads/setup_datacaixa.exe" 
    },
    {
      id: "comanda",
      titulo: "Download Comanda",
      descricao: "Aplicativo Android para lançar produtos na Mesa ou Comanda e integrado com o Datacaixa.",
      tipo: "mobile",
      imagemUrl: "/img/logo-comanda.png",
      urlDownload: "https://play.google.com/store/apps/details?id=com.datacaixa.comandamobile" 
    },
  ];

  const handleDownload = (url: string) => {
    // window.open com _blank abre o instalador em uma nova aba ou inicia o download direto
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER DA PÁGINA */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-500 flex items-center gap-2">
          Sistema / <span className="text-gray-900 font-bold tracking-tight">Downloads</span>
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-4">
        
        {linksDownload.map((item) => (
          <div 
            key={item.id}
            className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 flex-1 text-center md:text-left">
              
              {/* ÁREA DA IMAGEM DO ÍCONE */}
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                <img 
                  src={item.imagemUrl} 
                  alt={item.id} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.projetoacbr.com.br/forum/uploads/monthly_2022_11/logo-com-borda.png.2fc8d2cff4fd1e0c59041b0fb78a178e.png"; 
                  }}
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm md:text-base font-medium text-gray-700 leading-relaxed">
                  {item.descricao}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {item.tipo === "desktop" ? <Monitor size={12} /> : <Smartphone size={12} />}
                  {item.tipo === "desktop" ? "Windows" : "Android / IOS"}
                </div>
              </div>
            </div>

            {/* BOTÃO DE REDIRECIONAMENTO */}
            <button 
              onClick={() => handleDownload(item.urlDownload)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap min-w-[200px] justify-center cursor-pointer group/btn"
            >
              <Download size={18} className="group-hover/btn:translate-y-0.5 transition-transform" />
              {item.titulo}
              <ExternalLink size={14} className="opacity-50" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}