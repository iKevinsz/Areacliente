"use client";

import { User, Headphones, Phone, Moon, Sun } from "lucide-react";
import { useTheme } from "../header/ThemeProvider";
import Link from "next/link";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Removido o 'justify-between' e mantido apenas o 'justify-end' para alinhar a Nav à direita */}
      <div className="flex items-center justify-end w-full px-4 py-4">

        {/* Conteúdo Direita: Suporte, Telefone e Tema */}
        <nav>
          <ul className="flex items-center gap-6">

            {/* Suporte */}
            <li className="flex items-center gap-2">
              <Headphones size={18} />
              Suporte: DATACAIXA TECNOLOGIA
            </li>

            {/* Telefone */}
            <li className="flex items-center gap-2">
              <Phone size={18} />
              +55 (11) 99999-9999
            </li>

            {/* Botão de tema */}
            <li>
              <button
                onClick={toggleTheme}
                aria-label="Alternar tema" 
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </li>

          </ul>
        </nav>

      </div>
    </header>
  );
}