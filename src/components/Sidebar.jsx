"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaXmark, FaBars, FaGears, FaStore, FaThumbtack } from "react-icons/fa6"; 
import { GoGraph } from "react-icons/go";
import { FaServer } from "react-icons/fa";
import {
  MdPointOfSale,
  MdOutlineHeadsetMic,
  MdSpaceDashboard,
  MdRestaurantMenu,
  MdAttachMoney,
  MdReceipt,
  MdLogout, 
} from "react-icons/md";

const Sidebar = ({ open, setOpen }) => {
  const [subMenus, setSubMenus] = useState({});
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [isPinned, setIsPinned] = useState(false);

  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState({ id: 1, name: "KEVIN-TESTE" });
  
  // Estado para simular notificações de novos pedidos
  const [pendingOrders, setPendingOrders] = useState(3); // Exemplo: 3 pedidos pendentes

  const myStores = [
    { id: 1, name: "KEVIN-TESTE" },
    { id: 2, name: "LUNIERE BALÕES DECOR" },
    { id: 3, name: "KEVIN PARCEIRO TESTE" }
  ];

  const storeMenuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      
      const handleClickOutside = (event) => {
        if (storeMenuRef.current && !storeMenuRef.current.contains(event.target)) {
          setStoreMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("resize", checkMobile);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const toggleSubMenu = (menuKey) => {
    setSubMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleMouseEnter = () => {
    if (!isMobile) setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isPinned) {
      setOpen(false);
      setStoreMenuOpen(false);
    }
  };

  const togglePin = () => {
    const newState = !isPinned;
    setIsPinned(newState);
    setOpen(true);
  };

  const Menus = [
    { title: "Meus Dados", icon: <MdSpaceDashboard />, path: "/system/perfil", key: "perfil" },
    {
      title: "Cardápio Digital",
      icon: <MdRestaurantMenu />,
      gap: true,
      key: "cardapio",
      subMenu: [
        { 
            title: "Vendas", 
            path: "/system/cardapio/pedidos",
            notification: pendingOrders 
        },
        { title: "Dashboard", path: "/system/cardapio/dashboard" },
        { title: "Produtos", path: "/system/cardapio/produtos" },
        { title: "Grupos", path: "/system/cardapio/grupos" },
        { title: "QRCode", path: "/system/cardapio/qrcode" },
        { title: "WhatsApp", path: "/system/cardapio/whatsapp" },
        { title: "Avaliações", path: "/system/cardapio/avaliacoes" },
        { title: "Parâmetros", path: "/system/cardapio/parametros" },
      ],
    },
    {
      title: "Ponto de Venda",
      icon: <MdPointOfSale />,
      key: "pdv",
      subMenu: [
        { title: "Dashboard", path: "/system/pdv/dashboard" },
        { title: "Consultar Caixa", path: "/system/pdv/caixa" },
      ],
    },
    
    {
      title: "NF-e",
      icon: <MdReceipt />,
      key: "nfe",
      subMenu: [
        { title: "Emitir NF-e", path: "/system/nfe/emitir" },
        { title: "Pedidos", path: "/system/nfe/pedidos" },
        { title: "Orçamentos", path: "/system/nfe/orcamentos" }, 
      ],
    },

    {
      title: "Financeiro",
      icon: <MdAttachMoney />,
      key: "financeiro",
      subMenu: [
        { title: "Visão Geral", path: "/system/financeiro/resumo" },
        { title: "Contas a Pagar", path: "/system/financeiro/pagar" },
        { title: "Contas a Receber", path: "/system/financeiro/receber" },
        { title: "Fluxo de Caixa", path: "/system/financeiro/fluxo" },
      ],
    },
    {
      title: "Faturamento",
      icon: <GoGraph />,
      key: "faturamento",
      subMenu: [
        { title: "Dashboard", path: "/system/faturamento/dashboard" },
        { title: "Histórico de Vendas", path: "/system/faturamento/vendas" },
        { title: "Relatórios", path: "/system/faturamento/relatorios" },
      ],
    },
    {
      title: "Sistema",
      icon: <FaServer />,
      key: "sistema",
      subMenu: [
        { title: "Planos", path: "/system/sistema/planos" },
        { title: "Licenças", path: "/system/sistema/licencas" },
        { title: "Cadastrar Cartão", path: "/system/sistema/cartao" },
        { title: "Faturas", path: "/system/sistema/faturas" },
        { title: "Backup", path: "/system/sistema/bckp" },
        { title: "Sugestões", path: "/system/sistema/sugestoes" },
        { title: "Downloads", path: "/system/sistema/downloads" },
      ],
    },
    {
      title: "Suporte",
      icon: <MdOutlineHeadsetMic />, 
      path: "/system/suporte",
      key: "suporte"
    },
    {
      title: "Configurações",
      icon: <FaGears />, 
      path: "/system/configuracoes/geral", 
      key: "configuracoes"
    },
  ];

  return (
    <>
    {/* BOTÃO FLUTUANTE MOBILE */}
    {mounted && createPortal(
      <button
        onClick={() => setOpen(!open)} 
        style={{ zIndex: 2147483647 }}
        className="md:hidden fixed top-4 left-4 p-2 bg-[#00254d] text-white rounded-md shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-[#001a35] transition-all border border-white/20"
      >
        {open ? <FaXmark size={24} /> : <FaBars size={24} />}
      </button>,
      document.body
    )}

      {/* OVERLAY MOBILE */}
      <div
        style={{ zIndex: 2147483646 }}
        className={`md:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR CONTAINER */}
      <nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ zIndex: 2147483647 }}
        className={`
          fixed top-0 bottom-0 left-0 bg-[#F3F4F6] transition-all duration-300 ease-in-out shadow-2xl border-r border-gray-200
          ${open ? "w-72 md:w-80" : "w-72 md:w-20"} 
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${!open ? "invisible md:visible" : "visible"}
        `}
      >
        {/* BOTÃO FIXAR/SOLTAR */}
        <div
          title={isPinned ? "Desafixar Sidebar" : "Fixar Sidebar"}
          className={`hidden md:flex absolute cursor-pointer -right-3 top-9 w-7 h-7 bg-white border-2 rounded-full text-sm items-center justify-center transition-all duration-300 z-50 shadow-md hover:scale-110 
            ${isPinned ? "border-blue-500 text-blue-500 shadow-blue-200" : "border-[#00254d] text-[#00254d]"}
          `}
          onClick={togglePin}
        >
          {isPinned ? <FaThumbtack className="rotate-45" /> : <FaThumbtack />}
        </div>

        {/* BOTÃO FECHAR MOBILE */}
        <div
          className="md:hidden absolute top-4 right-4 text-[#00254d] hover:text-[#001a35] cursor-pointer p-2 z-50"
          onClick={() => setOpen(false)}
        >
          <FaXmark size={24} />
        </div>

        <div className="h-full w-full flex flex-col p-5 pt-8 overflow-hidden">
          
          <div className={`flex-shrink-0 flex items-center mb-6 transition-all duration-300 ${open ? "gap-x-4 justify-start" : "justify-center"}`}>
            <div className="relative w-10 h-10 shrink-0">
              <img
                src="/logo.png"
                alt="logo"
                className={`w-10 h-10 rounded-md object-cover border-[#00254d]/20 transition-all duration-700 ease-in-out ${
                  open ? "md:rotate-[360deg]" : ""
                }`}
              />
            </div>
            
            <h1 className={`text-[#00254d] font-bold text-xl whitespace-nowrap transition-all duration-200 origin-left ${!open ? "opacity-0 w-0 scale-0 overflow-hidden" : "opacity-100 w-auto scale-100"}`}>
              Datacaixa Web
            </h1>
          </div>

          {/* MENU DE LOJAS */}
          <div className="mb-6 relative" ref={storeMenuRef}>
            <button
                onClick={() => {
                    if(!open) {
                        setOpen(true);
                        setTimeout(() => setStoreMenuOpen(true), 150);
                    } else {
                        setStoreMenuOpen(!storeMenuOpen);
                    }
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${storeMenuOpen ? 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-100' : 'border-gray-300 bg-white hover:border-[#00254d]'} ${!open ? 'justify-center border-transparent bg-transparent hover:bg-white' : ''}`}
            >
                <div className={`p-1.5 rounded-md ${open ? 'bg-blue-50 text-blue-600' : 'bg-[#00254d]/5 text-[#00254d]'}`}>
                    <FaStore size={16} />
                </div>
                <div className={`flex-1 text-left overflow-hidden ${!open ? 'hidden' : 'block'}`}>
                    <span className="block text-xs text-gray-400 font-medium">Loja Atual:</span>
                    <span className="block text-sm font-bold text-gray-700 truncate">{selectedStore.name}</span>
                </div>
                {open && (
                    <FaChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${storeMenuOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {storeMenuOpen && open && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                        {myStores.map(store => (
                            <div
                                key={store.id}
                                onClick={() => {
                                    setSelectedStore(store);
                                    setStoreMenuOpen(false);
                                }}
                                className={`px-4 py-3 text-sm cursor-pointer border-l-4 transition-all hover:bg-gray-50 flex items-center justify-between ${selectedStore.id === store.id ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-transparent text-gray-600'}`}
                            >
                                {store.name}
                                {selectedStore.id === store.id && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <ul className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-1 pb-4 space-y-2">
            {Menus.map((Menu, index) => (
              <li key={index} className={`${Menu.gap ? "mt-8" : "mt-1"}`}>
                {Menu.subMenu ? (
                  <div
                    className={`group flex items-center py-3 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:bg-white hover:shadow-sm hover:border-gray-200 ${subMenus[Menu.key] ? "bg-white shadow-sm border-gray-200" : ""} ${open ? "justify-between" : "justify-center"}`}
                    onClick={() => {
                      if (!open) setOpen(true);
                      toggleSubMenu(Menu.key);
                    }}
                  >
                    <div className={`flex items-center ${open ? "gap-3" : ""} relative`}>
                      <span className="text-2xl text-gray-500 group-hover:text-[#00254d] transition-colors shrink-0 relative">
                        {Menu.icon}
                        
                        {/* NOTIFICAÇÃO NO MENU PAI (BOLINHA) SE FECHADO */}
                        {!open && Menu.subMenu.some(sub => sub.notification > 0) && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#F3F4F6]"></span>
                        )}
                      </span>
                      <span className={`font-medium text-gray-600 group-hover:text-[#00254d] whitespace-nowrap transition-all duration-200 ${!open ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                        {Menu.title}
                      </span>
                      
                      {/* NOTIFICAÇÃO NO MENU PAI (CONTADOR) SE ABERTO */}
                      {open && !subMenus[Menu.key] && Menu.subMenu.some(sub => sub.notification > 0) && (
                         <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                            {Menu.subMenu.reduce((acc, sub) => acc + (sub.notification || 0), 0)}
                         </span>
                      )}
                    </div>
                    {open && (
                      <FaChevronDown className={`text-gray-400 group-hover:text-[#00254d] transition-transform duration-200 ${subMenus[Menu.key] && "rotate-180"}`} size={12} />
                    )}
                  </div>
                ) : (
                  <Link
                    href={Menu.path || "#"}
                    className={`group flex items-center py-3 px-3 rounded-lg transition-all duration-200 border border-transparent hover:bg-white hover:shadow-sm hover:border-gray-200 ${pathname === Menu.path ? "bg-white shadow-sm border-gray-200" : ""} ${open ? "gap-3 justify-start" : "justify-center"}`}
                    onClick={() => { if (isMobile) setOpen(false); }}
                  >
                    <span className={`text-2xl transition-colors shrink-0 ${pathname === Menu.path ? "text-[#00254d]" : "text-gray-500 group-hover:text-[#00254d]"}`}>
                      {Menu.icon}
                    </span>
                    <span className={`font-medium whitespace-nowrap transition-all duration-200 ${pathname === Menu.path ? "text-[#00254d] font-bold" : "text-gray-600 group-hover:text-[#00254d]"} ${!open ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                      {Menu.title}
                    </span>
                  </Link>
                )}
                {Menu.subMenu && subMenus[Menu.key] && open && (
                  <ul className="mt-1 ml-4 border-l-2 border-gray-200 pl-2 space-y-1 animate-fade-in">
                    {Menu.subMenu.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={sub.path}
                          className={`flex items-center justify-between gap-2 py-2 px-3 text-sm rounded-md transition-all ${pathname === sub.path ? "text-[#00254d] font-bold bg-white shadow-sm" : "text-gray-500 hover:text-[#00254d] hover:bg-white hover:shadow-sm"}`}
                          onClick={() => { if (isMobile) setOpen(false); }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${pathname === sub.path ? "bg-[#00254d]" : "bg-gray-300"}`}></div>
                              <span className="whitespace-nowrap truncate">{sub.title}</span>
                          </div>
                          
                          {/* BADGE DE NOTIFICAÇÃO NO SUBMENU */}
                          {sub.notification > 0 && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                  {sub.notification}
                              </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 mt-2 pt-2">
            <Link
              href="/auth/login"
              className={`group flex items-center py-3 px-3 rounded-lg transition-all duration-200 border border-transparent hover:bg-red-50 hover:border-red-100 ${open ? "gap-3 justify-start" : "justify-center"}`}
            >
              <span className="text-2xl text-gray-500 group-hover:text-red-600 transition-colors shrink-0">
                <MdLogout />
              </span>
              <span className={`font-medium whitespace-nowrap transition-all duration-200 text-gray-600 group-hover:text-red-600 ${!open ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                Sair do Sistema
              </span>
            </Link>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Sidebar;