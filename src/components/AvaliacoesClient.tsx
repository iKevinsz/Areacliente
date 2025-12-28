"use client";

import React, { useState, useMemo } from "react";
import { 
  FaStar, 
  FaRegStar, 
  FaReply, 
  FaCheckDouble,
  FaSearch
} from "react-icons/fa";

// 1. Definimos a interface dos dados que vêm do Prisma (Banco de Dados)
interface AvaliacaoDB {
  id: number;
  clienteNome: string;
  nota: number;
  comentario: string | null;
  resposta: string | null;
  tags: string | null;
  criadoEm: Date;
}

interface AvaliacoesClientProps {
  // AQUI ESTA A CORREÇÃO: dadosDoBanco agora é opcional ou tem valor padrão
  dadosDoBanco?: AvaliacaoDB[]; 
}

// Adicionamos " = []" para evitar o erro de undefined se a prop falhar
export default function AvaliacoesClient({ dadosDoBanco = [] }: AvaliacoesClientProps) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Transformamos os dados do banco para o formato visual da tela
  const reviews = useMemo(() => {
    // Proteção extra: Se dadosDoBanco for nulo/undefined, retorna array vazio
    if (!dadosDoBanco) return [];

    return dadosDoBanco.map((item) => ({
      id: item.id,
      cliente: item.clienteNome,
      // Formata a data para dia/mês/ano
      data: new Date(item.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
      nota: item.nota,
      comentario: item.comentario || "",
      // Converte string "Sabor,Entrega" em array
      tags: item.tags ? item.tags.split(",") : [],
      // Define status baseado se tem resposta ou não
      status: item.resposta ? "replied" : "pending",
      resposta: item.resposta || ""
    }));
  }, [dadosDoBanco]);

  // 3. Cálculo Dinâmico das Estatísticas (Média e Distribuição)
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { media: 0, total: 0, distribuicao: [0, 0, 0, 0, 0] };

    const somaNotas = reviews.reduce((acc, curr) => acc + curr.nota, 0);
    const media = (somaNotas / total).toFixed(1);

    // Conta quantas notas de 5, 4, 3, 2, 1 existem
    const counts = [0, 0, 0, 0, 0]; // Index 0 = nota 5, Index 4 = nota 1
    reviews.forEach(r => {
        const index = 5 - r.nota; // nota 5 vira index 0
        if (index >= 0 && index < 5) counts[index]++;
    });

    // Converte para porcentagem para a barra de progresso
    const distribuicao = counts.map(count => Math.round((count / total) * 100));

    return { media, total, distribuicao };
  }, [reviews]);

  // Filtragem combinada (Status + Busca)
  const filteredReviews = reviews.filter(r => {
    const matchesStatus = filterStatus === 'all' ? true : r.status === filterStatus;
    const matchesSearch = r.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.comentario.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
    // AQUI VOCÊ FUTURAMENTE VAI CHAMAR UMA SERVER ACTION PARA SALVAR NO BANCO
    alert(`Simulação: Resposta enviada para o ID #${id}: ${replyText}`);
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
                 {[...Array(5)].map((_,i) => (
                    i < Math.round(Number(stats.media)) ? <FaStar key={i}/> : <FaRegStar key={i} className="text-gray-300"/>
                 ))}
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
              {/* Contador dinâmico de pendentes */}
              <span className="bg-yellow-200 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">
                {reviews.filter(r => r.status === 'pending').length}
              </span>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* LISTA DE AVALIAÇÕES */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:border-blue-100 overflow-hidden">
            {/* Header do Card */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              
              <div className="flex items-start gap-4 w-full sm:w-auto min-w-0">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${review.nota >= 4 ? 'bg-green-500' : review.nota === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {review.cliente.charAt(0)}
                </div>
                
                {/* Nome e Estrelas */}
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

            {/* Conteúdo */}
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

        {filteredReviews.length === 0 && (
           <div className="text-center py-10 text-gray-500">
             Nenhuma avaliação encontrada.
           </div>
        )}
      </div>
      
    </div>
  );
}