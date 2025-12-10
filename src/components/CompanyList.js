// components/CompanyList.js
import { Search, Trash2, Edit } from 'lucide-react';

const TableHeader = [
  'Sociétés',
  'Pays',
  'Villes',
  'Branches',
  'E-mail',
  'Téléphone',
  'Site web',
  'Commisaire respo.',
  'Nombre de contrôle',
  'Actions',
];

export function CompanyList({ data }) {
  // Simulação de um estado de item "passando o mouse" (hover)
  const hoveredItemId = 2; // Simula o estado "Suprimer" na segunda linha

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      
      {/* Search Bar e Botão Adicionar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-grow max-w-lg">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Vous cherchez une société..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
          Ajouter
          <span className="ml-1 text-xl">+</span>
        </button>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TableHeader.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {data.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 relative">
                <td className="px-6 py-4 whitespace-nowrap">{company.sit}.</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.branch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">{company.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{company.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">{company.website}</td>
                <td className="px-6 py-4 whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis">{company.commissioner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{company.controlNumber < 10 ? `0${company.controlNumber}` : company.controlNumber}</td>
                
                {/* Coluna de Ações com Botões */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {/* Ícone de Excluir */}
                    <button className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    {/* Ícone de Editar */}
                    <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors">
                      <Edit size={18} />
                    </button>
                  </div>
                  
                  {/* Simulação do botão "Supprimer" (aparece ao passar o mouse) */}
                  {company.id === hoveredItemId && (
                      <button className="absolute top-1/2 right-10 transform -translate-y-1/2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                          Supprimer
                      </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer da Tabela e Paginação */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          02 sociétés
        </p>
        
        {/* Componente de Paginação */}
        <div className="flex items-center space-x-1">
          <button className="text-gray-400 hover:text-gray-600 p-2">
            &lt;
          </button>
          
          {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                page === 1
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
          
          <button className="text-gray-400 hover:text-gray-600 p-2">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}