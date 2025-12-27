import React from 'react';
import Link from 'next/link';

// No Next.js 13+, params é passado como prop para o componente da página
export default function DetalheCaixaPage({ params }: { params: { id: string } }) {
  const caixaId = params.id;

  // AQUI VOCÊ FARIA O FETCH NO BANCO DE DADOS USANDO O "caixaId"
  
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Botão de Voltar */}
      <Link href="/analytics/vendas" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-4">
        ← Voltar para lista
      </Link>

      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detalhes do Caixa #{caixaId}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Visualizando todas as vendas e ocorrências deste fechamento.
          </p>
        </div>
        {/* ... Restante do layout detalhado (Cards, Tabela de Vendas) que fizemos antes ... */}
      </div>

      {/* Conteúdo de exemplo apenas para ilustrar */}
      <div className="bg-white p-8 border rounded shadow-sm text-center text-gray-500">
        Aqui entraria a tabela completa de vendas do caixa <strong>{caixaId}</strong>...
      </div>
    </div>
  );
}