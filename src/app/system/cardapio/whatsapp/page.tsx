"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code"; 
import { 
  FaWhatsapp, 
  FaCheckCircle, 
  FaPowerOff, 
  FaSyncAlt, 
  FaMobileAlt, 
  FaEllipsisV,
  FaQrcode,
  FaExclamationTriangle // Importei ícone de alerta
} from "react-icons/fa";
import { MdSignalWifi4Bar, MdSignalWifiOff } from "react-icons/md";

export default function WhatsAppConnectionPage() {
  // Simulação de Estado
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [qrCode, setQrCode] = useState<string>("");
  const [connectedPhone, setConnectedPhone] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  
  // Estado para controlar o Modal
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Simula o carregamento do QR Code
  useEffect(() => {
    if (status === "disconnected") {
      generateMockQR();
    }
  }, [status]);

  const generateMockQR = () => {
    setQrCode(""); 
    setTimeout(() => {
      setQrCode("token-de-autenticacao-whatsapp-123456");
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1500);
  };

  const handleConnect = () => {
    setStatus("connecting");
    setTimeout(() => {
      setStatus("connected");
      setConnectedPhone("+55 (11) 99999-8888");
    }, 3000);
  };

  // Função que realmente desconecta (chamada pelo modal)
  const confirmDisconnect = () => {
    setStatus("disconnected");
    setConnectedPhone("");
    setShowDisconnectModal(false); // Fecha o modal
    generateMockQR();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative"> {/* relative para posicionar o modal */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaWhatsapp className="text-green-500" /> Conexão WhatsApp
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gerencie a conexão para envio automático de mensagens e cardápio.
            </p>
          </div>
          
          {/* Badge de Status */}
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold border ${
            status === 'connected' 
              ? 'bg-green-100 text-green-700 border-green-200' 
              : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            {status === 'connected' ? <MdSignalWifi4Bar size={18}/> : <MdSignalWifiOff size={18}/>}
            {status === 'connected' ? 'Serviço Online' : 'Serviço Offline'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
              
              {/* === ESTADO 1: DESCONECTADO === */}
              {status === "disconnected" && (
                <div className="text-center w-full max-w-sm fade-in">
                  <div className="mb-6 relative group">
                    {qrCode ? (
                      <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm inline-block">
                        <QRCode
                          value={qrCode}
                          size={220}
                          fgColor="#1f2937"
                        />
                        <div 
                          className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl"
                          onClick={generateMockQR}
                        >
                          <FaSyncAlt className="text-gray-600 mb-2" size={24}/>
                          <span className="text-sm font-bold text-gray-700">Atualizar QR Code</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[250px] h-[250px] bg-gray-100 animate-pulse rounded-xl mx-auto flex items-center justify-center">
                        <FaQrcode className="text-gray-300" size={40} />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Escaneie o QR Code</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Abra o WhatsApp no seu celular e escaneie o código acima para sincronizar.
                  </p>
                  
                  <button 
                    onClick={handleConnect}
                    className="text-xs text-blue-500 hover:underline cursor-pointer"
                  >
                    (Simular Leitura do Celular)
                  </button>
                </div>
              )}

              {/* === ESTADO 2: CONECTANDO === */}
              {status === "connecting" && (
                <div className="text-center fade-in">
                  <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-lg font-bold text-gray-800">Sincronizando...</h3>
                  <p className="text-gray-500 text-sm">Aguarde enquanto estabelecemos a conexão segura.</p>
                </div>
              )}

              {/* === ESTADO 3: CONECTADO === */}
              {status === "connected" && (
                <div className="text-center w-full fade-in">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <FaCheckCircle size={40} />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Dispositivo Conectado!</h2>
                  <p className="text-gray-500 mb-6">Seu sistema está pronto para enviar mensagens.</p>

                  <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto border border-gray-200 text-left mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Telefone</span>
                      <span className="text-sm font-semibold text-gray-800">{connectedPhone}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Sessão iniciada</span>
                      <span className="text-sm font-semibold text-gray-800">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status da Bateria</span>
                      <span className="text-sm font-semibold text-green-600">98% (Carregando)</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowDisconnectModal(true)} // Abre o modal
                    className="flex items-center gap-2 mx-auto px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors text-sm font-medium border border-red-200 cursor-pointer"
                  >
                    <FaPowerOff /> Desconectar Sessão
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMobileAlt /> Como Conectar?
              </h3>
              <ol className="relative border-l border-gray-200 ml-3 space-y-6">                  
                <StepItem number="1" title="Abra o WhatsApp" desc="Abra o aplicativo no seu celular." />
                <StepItem number="2" title="Acesse o Menu" desc={<span>No Android clique em <FaEllipsisV className="inline text-gray-400"/> (Mais opções). <br/>No iPhone vá em <strong>Configurações</strong>.</span>} />
                <StepItem number="3" title="Aparelhos Conectados" desc="Toque em 'Aparelhos conectados' e depois em 'Conectar um aparelho'." />
                <StepItem number="4" title="Escaneie" desc="Aponte a câmera do celular para o QR Code ao lado." isLast />
              </ol>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-blue-800 font-semibold text-sm mb-1">💡 Dica Importante</h4>
              <p className="text-blue-600 text-xs leading-relaxed">
                Mantenha seu celular conectado à internet para que as mensagens automáticas sejam enviadas sem interrupções.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL DE CONFIRMAÇÃO DE DESCONEXÃO --- */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaExclamationTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-gray-900">Desconectar WhatsApp?</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Ao desconectar, o sistema deixará de enviar mensagens automáticas. Você precisará escanear o QR Code novamente para reconectar.
                </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowDisconnectModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDisconnect}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-colors cursor-pointer"
              >
                Sim, Desconectar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponente
const StepItem = ({ number, title, desc, isLast }: any) => (
  <li className={`ml-6 ${!isLast ? 'mb-6' : ''}`}>
    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-4 ring-white">
      <span className="text-xs font-bold text-blue-600">{number}</span>
    </span>
    <h4 className="flex items-center mb-1 text-sm font-semibold text-gray-900">{title}</h4>
    <p className="mb-4 text-xs font-normal text-gray-500">{desc}</p>
  </li>
);