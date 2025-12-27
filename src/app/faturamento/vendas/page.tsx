'use client'; // Necessário para usar hooks de estado (useState)

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, ChevronRight } from 'lucide-react'; // Ícones opcionais

// Mock de dados dos caixas fechados
const caixasFechadosMock = [
  { id: '101', operador: 'João Silva', data: '2023-12-26', horaFechamento: '18:00', total: 2450.00 },
  { id: '102', operador: 'Maria Oliveira', data: '2023-12-26', horaFechamento: '18:15', total: 1890.50 },
  { id: '103', operador: 'João Silva', data: '2023-12-25', horaFechamento: '22:00', total: 3100.00 },
  { id: '104', operador: 'Carlos Souza', data: '2023-12-24', horaFechamento: '16:00', total: 1200.00 },
];

export default function ListaCaixasPage() {
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroData, setFiltroData] = useState('');

  // Lógica simples de filtro
  const caixasFiltrados = caixasFechadosMock.filter((caixa) => {
    const matchNome = caixa.operador.toLowerCase().includes(filtroNome.toLowerCase());
    const matchData = filtroData ? caixa.data === filtroData : true;
    return matchNome && matchData;
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Caixas</h1>

      {/* Área de Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Operador</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="pl-10 w-full border rounded-md p-2 text-sm outline-blue-500"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Data do Fechamento</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="date"
              className="pl-10 w-full border rounded-md p-2 text-sm outline-blue-500"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </div>
        </div>
        
        {/* Botão de limpar filtros opcional */}
        <div className="flex items-end">
          <button 
            onClick={() => { setFiltroNome(''); setFiltroData(''); }}
            className="text-sm text-gray-500 hover:text-red-500 mb-2 underline"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Operador</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Fechamento</th>
              <th className="px-6 py-3 text-right">Total (R$)</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {caixasFiltrados.length > 0 ? (
              caixasFiltrados.map((caixa) => (
                <tr key={caixa.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">#{caixa.id}</td>
                  <td className="px-6 py-4">{caixa.operador}</td>
                  <td className="px-6 py-4">{new Date(caixa.data).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">{caixa.horaFechamento}</td>
                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    {caixa.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* O LINK direciona para a rota dinâmica baseada no ID */}
                    <Link 
                      href={`/analytics/vendas/${caixa.id}`} 
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-400 bg-blue-50 px-3 py-1 rounded transition"
                    >
                      Ver Vendas <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Nenhum caixa fechado encontrado com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}