"use client";

import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { FaDownload, FaCopy, FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export default function QRCodePage() {
  // MOCK - Substitua pelo link real do seu cliente
  const menuLink = "https://www.pededaki.com.br/kevinteste";
  
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<any>(null);

  // Função para copiar o link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(menuLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Função para baixar o QR Code como PNG
  const downloadQRCode = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Definindo um tamanho grande para alta qualidade
    const size = 1024; 
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "meu-cardapio-qr.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">QR Code e Compartilhamento</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie como seus clientes acessam seu cardápio digital.</p>
        </div>

        {/* Cartão Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden grid md:grid-cols-5">
          
          {/* Coluna Esquerda - Visualização do QR Code */}
          <div className="md:col-span-2 bg-blue-50/50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6">
              <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={menuLink}
                  viewBox={`0 0 256 256`}
                  ref={svgRef}
                  fgColor="#1e3a8a" // Azul escuro para combinar com a marca
                />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-4">Aponte a câmera do celular</p>
            
            <button 
              onClick={downloadQRCode}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full justify-center"
            >
              <FaDownload /> Baixar Imagem (PNG)
            </button>
             <p className="text-xs text-gray-400 mt-3 text-center">Alta resolução para impressão em mesas e displays.</p>
          </div>

          {/* Coluna Direita - Ações e Links */}
          <div className="md:col-span-3 p-8 flex flex-col justify-center space-y-8">
            
            {/* Seção do Link */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Link Direto</h3>
              <p className="text-sm text-gray-500 mb-4">
                Use este link para enviar pelo WhatsApp ou adicionar na bio do Instagram.
              </p>
              
              <div className="flex rounded-md shadow-sm relative">
                <input
                  type="text"
                  readOnly
                  value={menuLink}
                  className="py-3 px-4 block w-full border-gray-200 bg-gray-50 rounded-l-md text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`inline-flex flex-shrink-0 justify-center items-center h-[2.875rem] w-[2.875rem] rounded-r-md border border-transparent font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
                 {copied && (
                  <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-sm">
                    Link copiado!
                  </span>
                )}
              </div>
                <div className="mt-3 text-right">
                <Link 
                    href="https://www.pededaki.com.br/kevinteste" 
                    target="_blank" 
                    rel="noopener noreferrer" // Importante para segurança em links externos
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 font-medium transition-colors"
                >
                    Testar link no navegador <FaExternalLinkAlt size={12}/>
                </Link>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Seção de Compartilhamento Social */}
            <div>
               <h3 className="text-lg font-semibold text-gray-800 mb-4">Compartilhamento Rápido</h3>
               <div className="flex flex-wrap gap-3">
                  {/* Botões sociais uniformizados */}
                  <SocialButton icon={<FaWhatsapp size={20} />} label="WhatsApp" color="hover:text-green-600 hover:bg-green-50" href={`https://wa.me/?text=Confira nosso cardápio digital: ${menuLink}`} />
                  <SocialButton icon={<FaFacebook size={20} />} label="Facebook" color="hover:text-blue-600 hover:bg-blue-50" href={`https://www.facebook.com/sharer/sharer.php?u=${menuLink}`} />
                  <SocialButton icon={<FaTwitter size={20} />} label="Twitter" color="hover:text-sky-500 hover:bg-sky-50" href={`https://twitter.com/intent/tweet?url=${menuLink}&text=Confira nosso cardápio!`} />
                  <SocialButton icon={<FaEnvelope size={20} />} label="E-mail" color="hover:text-red-500 hover:bg-red-50" href={`mailto:?subject=Nosso Cardápio Digital&body=Olá, confira nosso cardápio digital aqui: ${menuLink}`} />
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para os botões sociais
const SocialButton = ({ icon, label, color, href }: any) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg text-gray-600 transition-all ${color} active:scale-95 bg-white shadow-sm`}
    title={`Compartilhar no ${label}`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </a>
);