"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  gap?: boolean;
  subMenu?: { title: string; path: string }[];
  key: string;
}

// 1. ADICIONEI O ÍCONE FaBars AQUI
import {
  FaChevronDown,
  FaChevronRight,
  FaGears,
  FaXmark,
  FaBars,
} from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import {
  MdOutlineHeadsetMic,
  MdSpaceDashboard,
  MdRestaurantMenu,
  MdAttachMoney,
  MdReceipt,
} from "react-icons/md";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const [subMenus, setSubMenus] = useState<Record<string, boolean>>({
    cardapio: false,
    financeiro: false,
    nfe: false,
    analytics: false,
    support: false,
    settings: false,
  });

  const toggleSubMenu = (menuKey: string) => {
    if (menuKey) {
      setSubMenus((prev) => ({
        ...prev,
        [menuKey]: !prev[menuKey],
      }));
    }
  };

  const Menus = [
    {
      title: "Meus Dados",
      icon: <MdSpaceDashboard />,
      path: "/",
      key: "dashboard",
    },
    {
      title: "Cardápio Digital",
      icon: <MdRestaurantMenu />,
      gap: true,
      subMenu: [
        { title: "Produtos", path: "/produtos" },
        { title: "Categorias", path: "/cardapio/" },
      ],
      key: "cardapio",
    },
    { title: "NF-e", icon: <MdReceipt />, path: "/nfe", key: "nfe" },
    {
      title: "Financeiro",
      icon: <MdAttachMoney />,
      path: "/financeiro",
      key: "financeiro",
    },
    {
      title: "Consultar",
      icon: <GoGraph />,
      gap: true,
      subMenu: [
        { title: "Deshboard", path: "/analytics/dashboard" },
        { title: "Consultar caixas", path: "/analytics/vendas" },
      ],
      key: "analytics",
    },
    {
      title: "Sistema",
      icon: <MdOutlineHeadsetMic />,
      path: "/support",
      key: "support",
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

  const renderMenuItemContent = (Menu: MenuItem) => (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{Menu.icon}</span>
      <span
        className={`${
          !open && "hidden md:hidden"
        } md:group-hover:block origin-left font-medium ease-in-out duration-300 whitespace-nowrap`}
      >
        {open && Menu.title}
        {!open && <span className="hidden">{Menu.title}</span>}
      </span>
    </div>
  );

  return (
    <>
      {/* --- NOVIDADE: BOTÃO FLUTUANTE PARA ABRIR NO MOBILE --- 
          Ele só aparece se a tela for pequena (md:hidden) e se o menu estiver fechado (!open)
      */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#003087] text-white rounded-md shadow-lg hover:bg-blue-800 transition-colors"
          aria-label="Abrir menu"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* 1. OVERLAY MOBILE (BACKDROP) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* 2. SIDEBAR PRINCIPAL */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-[#003087] z-50 transition-all duration-300 ease-in-out shadow-lg
          ${open ? "w-72 md:w-80" : "w-72 md:w-20"} 
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          p-5 pt-8
        `}
      >
        {/* BOTÃO DE TOGGLE (DESKTOP) */}
        <div
          className={`hidden md:flex absolute cursor-pointer -right-3 top-9 w-7 h-7 bg-white border-2 border-[#003087] rounded-full text-sm items-center justify-center text-[#003087] ${
            !open && "rotate-180"
          } transition-all duration-300 z-50 shadow-md hover:bg-gray-100`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <TbLayoutSidebarLeftExpand />
          ) : (
            <TbLayoutSidebarLeftCollapse />
          )}
        </div>

        {/* BOTÃO FECHAR (MOBILE - DENTRO DA SIDEBAR) */}
        <div
          className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer p-2"
          onClick={() => setOpen(false)}
        >
          <FaXmark size={24} />
        </div>

        {/* Logo e Título */}
        <div
          className={`flex gap-x-4 items-center mb-8 ${
            !open ? "md:justify-center" : ""
          }`}
        >
          <img
            src="https://cdn.pixabay.com/photo/2017/02/18/19/20/logo-2078018_640.png"
            alt="logo"
            className={`w-10 h-10 rounded-full object-cover border-2 border-white/20 duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-semibold text-xl duration-200 whitespace-nowrap ${
              !open && "md:scale-0 md:hidden"
            }`}
          >
            Datacaixa
          </h1>
        </div>

        {/* Lista de Menus */}
        <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-hide">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex flex-col rounded-md cursor-pointer transition-colors duration-200 ${
                Menu.gap ? "mt-8" : "mt-1"
              } ${
                index === 0 && "bg-white/10 text-white"
              } hover:bg-white/10 text-gray-300`}
            >
              {Menu.subMenu ? (
                <div
                  className={`flex items-center py-3 px-3 rounded-md ${
                    !open ? "md:justify-center" : "justify-between"
                  }`}
                  onClick={() => {
                    if (!open) setOpen(true);
                    toggleSubMenu(Menu.key);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl min-w-[24px]">{Menu.icon}</span>
                    <span
                      className={`${
                        !open && "md:hidden"
                      } font-medium whitespace-nowrap duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </div>
                  {open && (
                    <span
                      className={`${
                        subMenus[Menu.key] ? "rotate-180" : ""
                      } transition-transform duration-300`}
                    >
                      <FaChevronDown size={12} />
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  href={Menu.path}
                  className={`flex items-center py-3 px-3 rounded-md gap-3 ${
                    !open ? "md:justify-center" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-2xl min-w-[24px]">{Menu.icon}</span>
                  <span
                    className={`${
                      !open && "md:hidden"
                    } font-medium whitespace-nowrap duration-200`}
                  >
                    {Menu.title}
                  </span>
                </Link>
              )}

              {Menu.subMenu &&
                subMenus[Menu.key] &&
                (open || window.innerWidth < 768) && (
                  <ul className="pl-10 pt-1 pb-2 space-y-1 bg-black/10 rounded-b-md">
                    {Menu.subMenu.map((subMenuItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subMenuItem.path}
                          className="flex items-center gap-2 py-2 px-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all"
                          onClick={() => setOpen(false)}
                        >
                          <FaChevronRight size={10} />
                          <span className="whitespace-nowrap">
                            {subMenuItem.title}
                          </span>
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
