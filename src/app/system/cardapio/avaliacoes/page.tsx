"use client";

import React, { useState } from "react";
import { 
  FaStar, 
  FaRegStar, 
  FaFilter, 
  FaReply, 
  FaCheckDouble,
  FaSearch
} from "react-icons/fa";

// --- MOCK DATA ---
const reviewsData = [
  {
    id: 1,
    cliente: "Fernanda Costa",
    data: "Hoje, 14:30",
    nota: 5,
    comentario: "O lanche chegou super quentinho e a entrega foi muito rápida! O entregador foi super educado. Com certeza pedirei novamente.",
    tags: ["Entrega Rápida", "Sabor"],
    status: "pending", 
    resposta: ""
  },
  {
    id: 2,
    cliente: "Kevin Rodrigo",
    data: "Ontem, 20:15",
    nota: 2,
    comentario: "O hambúrguer estava frio e faltou o molho extra que eu pedi e paguei. Decepcionado com a falta de atenção.",
    tags: ["Pedido Incompleto", "Temperatura"],
    status: "pending",
    resposta: ""
  },
  {
    id: 3,
    cliente: "Juliana Paes",
    data: "24/12/2025",
    nota: 4,
    comentario: "Muito gostoso, mas achei a batata um pouco murcha. O lanche em si estava perfeito.",
    tags: ["Sabor"],
    status: "replied",
    resposta: "Olá Juliana! Agradecemos o feedback. Vamos ajustar o tempo de fritura da batata para garantir a crocância na próxima. Obrigado!"
  },
  {
    id: 4,
    cliente: "Juylianne L.",
    data: "23/12/2025",
    nota: 5,
    comentario: "Melhor açaí da região! Sem mais.",
    tags: ["Qualidade"],
    status: "replied",
    resposta: "Valeu Juylianne! Ficamos felizes que curtiu!"
  },
];

export default function AvaliacoesPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const stats = {
    media: 4.8,
    total: 128,
    distribuicao: [80, 15, 3, 1, 1] 
  };

  const renderStars = (nota: number) => {
    return (
      <div className="flex text-yellow-400 gap-0.5 text-sm shrink-0">
        {[...Array(5)].map((_, i) => (
          i < nota ? <FaStar key={i} /> : <FaRegStar key={i} className="text-gray-300"/>
        ))}
      </div>
    );
  };

  const handleReplySubmit = (id: number) => {
    alert(`Resposta enviada para a avaliação #${id}: ${replyText}`);
    setReplyingId(null);
    setReplyText("");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen space-y-6 w-full overflow-hidden">
      
      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Card de Nota Média */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <h2 className="text-gray-500 font-medium mb-2 text-sm md:text-base">Nota Geral</h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-bold text-gray-800">{stats.media}</span>
            <div className="text-left">
              <div className="flex text-yellow-400 text-base md:text-lg mb-1">
                 {[...Array(5)].map((_,i) => <FaStar key={i}/>)}
              </div>
              <p className="text-xs md:text-sm text-gray-400">{stats.total} avaliações</p>
            </div>
          </div>
        </div>

        {/* Card de Distribuição */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-gray-500 font-medium mb-4 text-sm md:text-base">Distribuição de Notas</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center gap-3 text-xs md:text-sm">
                <span className="w-3 font-bold text-gray-600 shrink-0">{star}</span>
                <FaStar className="text-gray-300 text-[10px] md:text-xs shrink-0" />
                <div className="flex-1 h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-400' : 'bg-red-500'}`} 
                    style={{ width: `${stats.distribuicao[index]}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-gray-400 shrink-0">{stats.distribuicao[index]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ÁREA DE FILTROS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm min-w-max">
            <button 
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filterStatus === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Pendentes
              <span className="bg-yellow-200 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">2</span>
            </button>
            <button 
              onClick={() => setFilterStatus("replied")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filterStatus === 'replied' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Respondidas
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* LISTA DE AVALIAÇÕES */}
      <div className="space-y-4">
        {reviewsData
          .filter(r => filterStatus === 'all' ? true : r.status === filterStatus)
          .map((review) => (
          <div key={review.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:border-blue-100 overflow-hidden">
            {/* Header do Card */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              
              <div className="flex items-start gap-4 w-full sm:w-auto min-w-0">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${review.nota >= 4 ? 'bg-green-500' : review.nota === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {review.cliente.charAt(0)}
                </div>
                
                {/* Nome e Estrelas - min-w-0 ajuda a não estourar o layout */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">{review.cliente}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {renderStars(review.nota)}
                    <span className="text-gray-300 text-xs hidden sm:inline">•</span>
                    <span className="text-xs text-gray-400 block sm:inline w-full sm:w-auto mt-1 sm:mt-0">{review.data}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-auto shrink-0">
                {review.status === 'replied' ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100 whitespace-nowrap">
                    <FaCheckDouble size={10} /> Respondida
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium border border-yellow-100 whitespace-nowrap">
                    Aguardando
                    </span>
                )}
              </div>
            </div>

            {/* Conteúdo com break-words para evitar overflow */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-0 md:pl-14 break-words">
              "{review.comentario}"
            </p>

            {/* Tags */}
            <div className="pl-0 md:pl-14 flex flex-wrap gap-2 mb-4">
              {review.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>

            {/* Área de Resposta */}
            <div className="pl-0 md:pl-14">
              {review.status === 'replied' ? (
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border-l-4 border-blue-500 break-words">
                  <p className="text-xs text-gray-500 font-bold mb-1">Sua resposta:</p>
                  <p className="text-sm text-gray-700">{review.resposta}</p>
                </div>
              ) : (
                <>
                  {replyingId === review.id ? (
                    <div className="animate-fade-in bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                      <textarea
                        className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        rows={3}
                        placeholder="Escreva sua resposta..."
                        autoFocus
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end gap-2 mt-3">
                        <button 
                          onClick={() => setReplyingId(null)}
                          className="px-3 py-2 text-xs md:text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => handleReplySubmit(review.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-xs md:text-sm rounded-md hover:bg-blue-700 font-medium"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReplyingId(review.id)}
                      className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors -ml-3"
                    >
                      <FaReply /> Responder
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}