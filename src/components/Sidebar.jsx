// components/Sidebar.jsx
"use client";

import React, { useState } from "react";
// Importando o componente Link do Next.js
import Link from "next/link";

// Importando ícones do pacote react-icons
import { FaChevronDown, FaChevronRight, FaGears } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { 
  MdOutlineHeadsetMic, 
  MdSpaceDashboard, 
  MdRestaurantMenu, 
  MdAttachMoney,    
  MdReceipt         
} from "react-icons/md";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";

const Sidebar = ({ open, setOpen }) => {
  const [subMenus, setSubMenus] = useState({
    cardapio: false,
    financeiro: false,
    nfe: false,
    analytics: false,
    support: false,
    settings: false,
  });

  const toggleSubMenu = (menuKey) => {
    if (menuKey) {
      setSubMenus((prev) => ({
        ...prev,
        [menuKey]: !prev[menuKey],
      }));
    }
  };

  const Menus = [
    { title: "Meus Dados", icon: <MdSpaceDashboard />, path: "/", key: "dashboard" },
    { 
      title: "Cardápio Digital", 
      icon: <MdRestaurantMenu />, 
      gap: true,
      subMenu: [
        { title: "Produtos", path: "/cardapio/" },
        { title: "Categorias", path: "/cardapio/" }
      ], 
      key: "cardapio" 
    },
    { 
      title: "NF-e", 
      icon: <MdReceipt />, 
      path: "/nfe", 
      key: "nfe" 
    },
    { 
      title: "Financeiro", 
      icon: <MdAttachMoney />, 
      path: "/financeiro", 
      key: "financeiro" 
    },
    { title: "Faturamento", icon: <GoGraph />, path: "/analytics", key: "analytics" },
    { title: "Sistema", icon: <MdOutlineHeadsetMic />, path: "/support", key: "support" },
    { 
      title: "Configurações", 
      icon: <FaGears />, 
      subMenu: [
        { title: "Geral", path: "/settings/general" },
        { title: "Segurança", path: "/settings/security" }
      ], 
      key: "settings" 
    },
  ];

  const renderMenuItemContent = (Menu) => (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{Menu.icon}</span>
      <span
        className={`${
          !open && "hidden"
        } origin-left font-medium ease-in-out duration-300 whitespace-nowrap`}
      >
        {Menu.title}
      </span>
    </div>
  );

  return (
    <div
      className={`${
        open ? "w-80 p-5" : "w-20 p-4"
      // MUDANÇA AQUI: bg-zinc-900 -> bg-[#001f3f] (Azul Marinho) ou a cor exata da Datacaixa
      } bg-[#003087] h-screen fixed left-0 top-0 pt-8 duration-300 ease-in-out z-50 shadow-lg`}
    >
      {/* Botão de Expandir/Recolher - Ajuste de borda para combinar */}
      <div
        className={`absolute cursor-pointer -right-0.5 top-9 w-8 h-8 p-0.5 bg-white border-2 border-[#003087] rounded-full text-xl flex items-center justify-center text-[#003087] ${
          !open && "rotate-180"
        } transition-all ease-in-out duration-300 z-50 shadow-md`}
        onClick={() => setOpen(!open)}
      >
        {open ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
      </div>

      {/* Logo e Título */}
      <div className={`flex gap-x-4 items-center mb-6 ${!open ? "justify-center" : ""}`}>
        <img
          src="https://cdn.pixabay.com/photo/2017/02/18/19/20/logo-2078018_640.png"
          alt="logo"
          className={`w-10 h-10 rounded-full object-cover object-center cursor-pointer ease-in-out duration-500 ${
            open && "rotate-[360deg]"
          }`}
        />

        <h1
          className={`text-white origin-left font-semibold text-xl duration-200 ease-in-out whitespace-nowrap ${
            !open && "scale-0 hidden"
          }`}
        >
          Datacaixa
        </h1>
      </div>

      {/* Lista de Menus */}
      <ul className="pt-2 space-y-1">
        {Menus.map((Menu, index) => (
          <li
            key={index}
            // Ajuste do hover para ser um tom mais claro ou escuro do azul
            className={`flex flex-col rounded-md cursor-pointer transition-all ease-in-out duration-300 ${
              Menu.gap ? "mt-9" : "mt-2"
            } ${index === 0 && "bg-white/10 text-white"} hover:bg-white/10 text-gray-300`}
          >
            {Menu.subMenu ? (
              <div
                className={`flex items-center py-3 px-3 rounded-md ${!open ? "justify-center" : "justify-between gap-x-4"}`}
                onClick={() => toggleSubMenu(Menu.key)}
              >
                {renderMenuItemContent(Menu)}
                {open && (
                  <span
                    className={`${
                      subMenus[Menu.key] ? "rotate-180" : ""
                    } transition-transform ease-in-out duration-300`}
                  >
                    <FaChevronDown />
                  </span>
                )}
              </div>
            ) : (
              <Link 
                href={Menu.path}
                className={`flex items-center py-3 px-3 rounded-md ${!open ? "justify-center" : ""}`}
              >
                {renderMenuItemContent(Menu)}
              </Link>
            )}

            {/* Submenus */}
            {Menu.subMenu && subMenus[Menu.key] && open && (
              <ul className="pl-8 pt-2 text-gray-400 space-y-1">
                {Menu.subMenu.map((subMenuItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subMenuItem.path}
                      className="text-sm flex items-center gap-x-2 py-2 px-2 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
                    >
                      <span className="text-xs">
                        <FaChevronRight />
                      </span>
                      <span className="whitespace-nowrap">{subMenuItem.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;