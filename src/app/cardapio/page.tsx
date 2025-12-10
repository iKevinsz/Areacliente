// app/control/companies/page.js
// Update the import path to the correct location of CompanyList
import { CompanyList } from '@/components/CompanyList';
import { companies } from '@/data/companies';
import { Bell } from 'lucide-react';

export default function ControlCompaniesPage() {
  const tabs = [
    { name: 'Grupos', current: true },
    { name: 'Produtos', current: false },
    { name: 'Complementos', current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Assumindo que você tem um Sidebar aqui, mas focando no conteúdo da página */}
      
      <main className="flex-1 p-8">
        
        {/* Header da Página */}
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div className="text-xl font-medium text-gray-700">
            Cardápio Digital <span className="text-blue-600 font-semibold">› Produtos</span>
          </div>
          <Bell size={24} className="text-gray-500" />
        </div>

        {/* Barra de Navegação de Tabs */}
        <nav className="border-b border-gray-200 mb-6">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href="#"
                className={`
                  ${tab.current 
                      ? 'border-blue-600 text-blue-600 font-medium' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } 
                  whitespace-nowrap py-3 px-1 border-b-2 text-sm transition-colors duration-200
                `}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Conteúdo da Tabela */}
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Lista de Grupos
        </h1>
        
        <CompanyList data={companies} />
        
      </main>
    </div>
  );
}