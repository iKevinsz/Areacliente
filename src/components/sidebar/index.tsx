"use client";

import { useState } from "react";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaIdCard,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      {/* Fundo escuro no mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r shadow
          z-40 flex flex-col
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-64"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b gap-3">
          <img src="/logo.png" className="h-8" alt="Logo" />
          <span className="font-semibold text-gray-700">Datacaixa</span>
        </div>

        {/* Seleção da loja */}
        <div className="px-4 py-3 border-b">
          <select className="w-full bg-gray-100 rounded px-2 py-1 text-sm outline-none">
            <option>KEVIN-TESTE</option>
          </select>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto text-sm">
          <MenuItem icon={<FaHome />} label="Meus Dados" href="#" />
          <MenuItem icon={<FaUtensils />} label="Cardápio Digital" href="#" />
          <MenuItem icon={<FaShoppingCart />} label="Ponto de Venda" href="#" />
          <MenuItem icon={<FaFileInvoiceDollar />} label="Faturamento" href="#" />
          <MenuItem icon={<FaMoneyBillWave />} label="Financeiro" href="#" />
          <MenuItem icon={<FaIdCard />} label="Conta Digital" href="#" />
          <MenuItem icon={<FaCog />} label="Sistema" href="#" />
        </nav>

        {/* Rodapé */}
        <div className="border-t p-4 text-sm">
          <button className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <FaSignOutAlt /> Sair
          </button>

          <p className="mt-4 text-xs text-gray-400">
            Versão: 2025.10.20<br />© Datacaixa Tecnologia
          </p>
        </div>
      </aside>
    </>
  );
}

/* Componente para itens do menu */
function MenuItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer transition"
    >
      <span className="text-gray-500">{icon}</span>
      {label}
    </a>
  );
}
