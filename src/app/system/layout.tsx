"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar"; 

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  // Controle de estado da Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar (gerencia seu próprio estado ou recebe via props) */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Conteúdo Principal */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-80" : "md:ml-20"
        }`}
      >
        <div className="max-w-[2000px] mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}