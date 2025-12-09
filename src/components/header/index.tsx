"use client";

import { User, Headphones, Phone, Moon, Sun } from "lucide-react";
import { useTheme } from "../header/ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex px-2 py-4 bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 transition-colors">
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">

        {/* Área do cliente */}
        <div className="flex items-center gap-2 font-medium">
          <User size={18} />
          Área do Cliente
        </div>

        {/* Navegação */}
        <nav>
          <ul className="flex items-center gap-6">

            <li className="flex items-center gap-2">
              <Headphones size={18} />
              Suporte: DATACAIXA TECNOLOGIA
            </li>

            <li className="flex items-center gap-2">
              <Phone size={18} />
              +55 (11) 99999-9999
            </li>

            {/* Botão de tema */}
            <li>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </li>

          </ul>
        </nav>

      </div>
    </header>
  );
}
