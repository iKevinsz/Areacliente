"use client";

import React from "react";
import {
  Monitor,
  Smartphone,
  Download,
  ExternalLink,
  ArrowRight,
  Apple,
} from "lucide-react";

export default function DownloadsPage() {
  const linksDownload = [
    {
      id: "datacaixa",
      titulo: "Instalador Datacaixa",
      subtitulo: "Versão Desktop (Windows)",
      descricao:
        "Sistema completo de PDV e Gestão. Inclui retaguarda e frente de caixa.",
      tipo: "desktop",
      imagemUrl: "/logo.png",
      urlDownload: "https://datacaixa.com.br/downloads/setup_datacaixa.exe",
    },
    {
      id: "comanda-android",
      titulo: "App Comanda Mobile",
      subtitulo: "Versão Android",
      descricao: "Para smartphones e tablets Android. Sincronização via Wi-Fi.",
      tipo: "android",
      imagemUrl: "/logo.png",
      urlDownload:
        "https://play.google.com/store/apps/details?id=com.datacaixa.comandamobile",
    },
    {
      id: "comanda-ios",
      titulo: "App Comanda Mobile",
      subtitulo: "Versão iOS (iPhone)",
      descricao:
        "Disponível na App Store para iPhone e iPad. Controle total na palma da mão.",
      tipo: "ios",
      imagemUrl: "/logo.png",
      urlDownload:
        "https://apps.apple.com/br/app/datacaixa-gar%C3%A7om/id6746877265",
    },
  ];

  const handleDownload = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          Central de Downloads
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl">
          Baixe os instaladores oficiais e mantenha seu sistema sempre
          atualizado. Escolha a versão compatível com seu dispositivo.
        </p>
      </div>

      {/* GRID DE CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {linksDownload.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* CORPO DO CARD */}
            <div className="p-8 pb-4 flex flex-col items-center text-center flex-1">
              {/* Ícone / Imagem */}
              <div className="w-24 h-24 mb-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-500" />
                <img
                  src={item.imagemUrl}
                  alt={item.id}
                  className="w-full h-full object-contain relative z-10"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://www.projetoacbr.com.br/forum/uploads/monthly_2022_11/logo-com-borda.png.2fc8d2cff4fd1e0c59041b0fb78a178e.png";
                  }}
                />
              </div>

              {/* Título e Subtítulo */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {item.titulo}
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                {item.subtitulo}
              </span>

              {/* Descrição */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {item.descricao}
              </p>

              {/* Badge de Requisitos */}
              <div className="mt-auto flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                {item.tipo === "desktop" && (
                  <Monitor size={14} className="text-blue-600" />
                )}
                {item.tipo === "android" && (
                  <Smartphone size={14} className="text-green-600" />
                )}
                {item.tipo === "ios" && (
                  <Smartphone size={14} className="text-gray-800" />
                )}{" "}
                {/* Ícone genérico pois Apple icon pode não estar no pacote padrão, se tiver use <Apple /> */}
                <span>
                  {item.tipo === "desktop" && "Windows 10 ou 11"}
                  {item.tipo === "android" && "Android 8.0+"}
                  {item.tipo === "ios" && "iOS 12.0+"}
                </span>
              </div>
            </div>

            {/* BOTÃO DE AÇÃO */}
            <div className="p-6 pt-0 mt-2">
              <button
                onClick={() => handleDownload(item.urlDownload)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 py-4 px-6 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 group/btn cursor-pointer"
              >
                <Download
                  size={18}
                  className="group-hover/btn:animate-bounce"
                />
                {item.tipo === "desktop" ? "Baixar Instalador" : "Acessar Loja"}
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"
                />
              </button>
            </div>
          </div>
        ))}

        {/* CARD DE SUPORTE */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 flex flex-col justify-between shadow-xl text-white group cursor-default border border-gray-700">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
              <ExternalLink className="text-blue-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">Precisa de ajuda?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Acesse nossa base de conhecimento ou chame o suporte técnico para
              configurar seus dispositivos.
            </p>
          </div>
          <button
            onClick={() =>
              window.open("https://datacaixa.com.br/ajuda/", "_blank")
            }
            className="mt-6 w-full py-4 rounded-xl border border-white/20 hover:bg-white/10 hover:border-white/40 text-white transition-all font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            Central de Ajuda
          </button>
        </div>
      </div>
    </div>
  );
}
