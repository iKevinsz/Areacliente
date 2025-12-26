// src/components/Sidebar.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronRight, FaGears, FaXmark, FaBars } from "react-icons/fa6"; 
import { GoGraph } from "react-icons/go";
import {
  MdOutlineHeadsetMic,
  MdSpaceDashboard,
  MdRestaurantMenu,
  MdAttachMoney,
  MdReceipt,
} from "react-icons/md";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";

const Sidebar = ({ open, setOpen }) => {
  const [subMenus, setSubMenus] = useState({});

  const toggleSubMenu = (menuKey) => {
    setSubMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const Menus = [
    { title: "Meus Dados", icon: <MdSpaceDashboard />, path: "/", key: "dashboard" },
    
    {
      title: "Cardápio Digital",
      icon: <MdRestaurantMenu />,
      gap: true,
      subMenu: [
        { title: "Produtos", path: "/produtos" },
        { title: "Categorias", path: "/cardapio/categorias" },
      ],
      key: "cardapio",
    },
    
    { title: "NF-e", icon: <MdReceipt />, path: "/nfe", key: "nfe" },
    
    // --- ALTERAÇÃO: Financeiro agora tem Submenu ---
{ 
      title: "Financeiro", 
      icon: <MdAttachMoney />, 
      key: "financeiro", 
      subMenu: [
        // O LINK DEVE SER EXATAMENTE ESTE:
        { title: "Visão Geral", path: "/financeiro/resumo" }, 
        
        { title: "Contas a Pagar", path: "/financeiro/pagar" },
        { title: "Contas a Receber", path: "/financeiro/receber" },
        { title: "Fluxo de Caixa", path: "/financeiro/fluxo" },
      ]
    },
    // -----------------------------------------------

    // --- ALTERAÇÃO: Faturamento agora tem Submenu ---
    { 
      title: "Faturamento", 
      icon: <GoGraph />, 
      key: "faturamento", 
      subMenu: [
        { title: "Dashboard", path: "/analytics" }, // Link para a tela de gráficos que criamos
        { title: "Histórico de Vendas", path: "/faturamento/historico" },
        { title: "Relatórios", path: "/faturamento/relatorios" },
      ]
    },
    // ------------------------------------------------
    
    { 
      title: "Sistema", 
      icon: <MdOutlineHeadsetMic />, 
      key: "sistema", 
      subMenu: [
        { title: "Licenças", path: "/sistema/licencas" },
        { title: "Faturas", path: "/sistema/faturas" },
        { title: "Cadastrar Cartão", path: "/sistema/cartao" },
        { title: "Backup", path: "/sistema/backup" },
        { title: "Sugestões", path: "/sistema/sugestoes" },
        { title: "Downloads", path: "/sistema/downloads" },
      ]
    },

    {
      title: "Configurações",
      icon: <FaGears />,
      subMenu: [
        { title: "Geral", path: "/settings/general" },
        { title: "Segurança", path: "/settings/security" },
      ],
      key: "settings",
    },
  ];

  return (
    <>
      {/* BOTÃO FLUTUANTE (MOBILE) */}
      {!open && (
        <button 
            onClick={() => setOpen(true)}
            className="md:hidden fixed top-4 left-4 z-[9999] p-2 bg-[#003087] text-white rounded-md shadow-lg hover:bg-blue-800 transition-all"
        >
            <FaBars size={24} />
        </button>
      )}

      {/* OVERLAY ESCURO (BACKDROP) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-[#003057] z-[9999] transition-all duration-300 ease-in-out shadow-lg
          ${open ? "w-72 md:w-80" : "w-72 md:w-20"} 
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          p-5 pt-8
        `}
      >
        {/* BOTÃO TOGGLE DESKTOP */}
        <div
          className={`hidden md:flex absolute cursor-pointer -right-3 top-9 w-7 h-7 bg-white border-2 border-[#003087] rounded-full text-sm items-center justify-center text-[#003087] ${
            !open && "rotate-180"
          } transition-all duration-300 z-50 shadow-md`}
          onClick={() => setOpen(!open)}
        >
          {open ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
        </div>

        {/* BOTÃO FECHAR MOBILE */}
        <div 
            className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer p-2"
            onClick={() => setOpen(false)}
        >
            <FaXmark size={24} />
        </div>

        {/* Logo */}
        <div className={`flex gap-x-4 items-center mb-8 ${!open ? "md:justify-center" : ""}`}>
          <img
            src="/logo.png" 
            alt="logo"
            className={`w-10 h-10 rounded-full object-cover border-2 border-white/20 duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1 className={`text-white origin-left font-semibold text-xl duration-200 whitespace-nowrap ${!open && "md:hidden"}`}>
            Área de Cliente
          </h1>
        </div>

        {/* Menus */}
        <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-hide">
          {Menus.map((Menu, index) => (
            <li key={index} className={`flex flex-col rounded-md cursor-pointer text-gray-300 hover:bg-white/10 ${Menu.gap ? "mt-8" : "mt-1"}`}>
              {Menu.subMenu ? (
                <div 
                  className={`flex items-center py-3 px-3 ${!open ? "md:justify-center" : "justify-between"}`}
                  onClick={() => { 
                    if(!open) setOpen(true); 
                    toggleSubMenu(Menu.key); 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{Menu.icon}</span>
                    <span className={`${!open && "md:hidden"} font-medium whitespace-nowrap`}>{Menu.title}</span>
                  </div>
                  {open && <FaChevronDown className={`${subMenus[Menu.key] && "rotate-180"} duration-200`} size={12}/>}
                </div>
              ) : (
                <Link 
                  href={Menu.path} 
                  className={`flex items-center gap-3 py-3 px-3 ${!open ? "md:justify-center" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-2xl">{Menu.icon}</span>
                  <span className={`${!open && "md:hidden"} font-medium whitespace-nowrap`}>{Menu.title}</span>
                </Link>
              )}
              
              {/* Submenu Render */}
              {Menu.subMenu && subMenus[Menu.key] && open && (
                <ul className="pl-10 bg-black/10 pb-2 transition-all">
                  {Menu.subMenu.map((sub, i) => (
                    <li key={i}>
                      <Link 
                        href={sub.path} 
                        className="flex items-center gap-2 py-2 text-sm text-gray-400 hover:text-white" 
                        onClick={() => setOpen(false)}
                      >
                        <FaChevronRight size={10}/> {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;