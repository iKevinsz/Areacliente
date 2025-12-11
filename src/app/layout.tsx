// app/layout.js (ou layout.jsx)
"use client";

import { useState, ReactNode } from "react";
// AJUSTE O CAMINHO ABAIXO conforme onde você salvou o arquivo no Passo 2
import Sidebar from "@/components/Sidebar"; 
import "./globals.css";
import { Inter } from 'next/font/google';
 import Header from "../components/header/Header"; // Import the new Header
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  // O estado que controla se a sidebar está expandida (true) ou recolhida (false)
  // Inicia como true (expandida)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        
        {/* Renderiza a Sidebar.
          Passamos o estado e a função para atualizar o estado como props.
        */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Conteúdo Principal (main).
          A margem esquerda (ml) se ajusta dinamicamente:
          - Se sidebarOpen for true: ml-72 (largura da sidebar expandida)
          - Se sidebarOpen for false: ml-20 (largura da sidebar recolhida)
          A classe 'transition-all' garante que o ajuste da margem seja suave.
        */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "ml-62" : "ml-2"
          }`}
        >
          {/* Aqui será renderizada a sua página de cadastro (o children).
            Adicionamos um container para centralizar e limitar a largura em telas grandes.
          */}
          <div className="max-w-[5000px] mx-auto">
             {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}