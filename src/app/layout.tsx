"use client";
import { Children, useState } from "react";
import Sidebar from "../components/sidebar";
import { FaBars } from "react-icons/fa";
import { Header } from "@/components/header";
import { ThemeProvider } from "../components/header/ThemeProvider";
import "./globals.css";


export default function RootLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="pt-br">
      <body className="bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Conteúdo principal */}
        <main className="flex-1 ml-0 lg:ml-64 p-6 w-full">
          
          {/* Botão que só aparece no mobile */}
          <button
            className="lg:hidden mb-4 p-2 rounded-md bg-white shadow"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars size={20} />
          </button>
          {/* Header */}
          <Header />
          <ThemeProvider> </ThemeProvider>
          {children}
        </main>
      </body>
    </html>
  );
}