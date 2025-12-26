"use client";

import React, { useState } from "react";
// Importe sua Sidebar (verifique se o caminho está correto)
import Sidebar from "@/components/Sidebar"; 

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex bg-gray-50 min-h-screen relative">
      {/* A Sidebar recebe as funções de controle aqui */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* O Conteúdo Principal (Main) */}
      <main 
        className={`
          flex-1 
          transition-all duration-300 ease-in-out
          
          /* LÓGICA DE MARGEM (Desktop) */
          /* Se aberto: empurra 80 (320px). Se fechado: empurra 20 (80px) */
          ${open ? "md:ml-80" : "md:ml-20"} 
          
          /* LÓGICA MOBILE */
          /* Margem zero, pois a sidebar abre por cima (overlay) */
          ml-0 
        `}
      >
        {/* Aqui serão renderizadas suas páginas (Produtos, Dashboard, etc) */}
        {children}
      </main>
    </div>
  );
}