// app/login/page.js (ou pages/login.js)

import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  
  // Note: Em um aplicativo real, você usaria estados para gerenciar a visibilidade da senha e o envio do formulário.

  return (
    // Contêiner principal para centralizar o conteúdo vertical e horizontalmente
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      
      {/* Container do Formulário */}
      <div className="w-full max-w-sm p-8 bg-white rounded-lg">
        
        {/* Logotipo e Título */}
        <div className="flex flex-col items-center mb-10">
          {/* O logo na imagem parece ser um ícone com o nome "workflow" */}
          <div className="mb-4">
            {/* Placeholder para o Logotipo "workflow" (usando um círculo azul e o texto para simular o estilo) */}
            <div className="flex items-center justify-center space-x-2">
              <span className="w-5 h-5 bg-blue-600 rounded-full opacity-70"></span>
              <span className="text-2xl font-bold text-gray-800">Datacaixa</span>
            </div>
          </div>
          <h1 className="text-center text-gray-700 text-sm md:text-base">
            Merci d'entrer vos informations de connexion
          </h1>
        </div>

        {/* Formulário de Login */}
        <form className="space-y-6">
          
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="johndoe@gmail.com"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue="••••••••••••••••" // Para simular a senha preenchida
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
              />
              {/* Ícone de Olho para mostrar/esconder senha */}
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                <EyeOff size={18} />
              </button>
            </div>
          </div>

          {/* Link "Mot de passe oublié ?" */}
          <div className="flex justify-end">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-500">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Botão Se connecter */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Se connecter &rarr;
            </button>
          </div>
        </form>

        {/* Link "Créer un compte" */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ? 
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
            Créer un compte
          </a>
        </p>

      </div>
    </div>
  );
}