import React, { useState } from "react";
import { BiChat } from "react-icons/bi";
import { FaBell, FaSearch } from "react-icons/fa";
import { FaChevronDown, FaChevronRight, FaGears } from "react-icons/fa6";
import { FiTable } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { MdOutlineHeadsetMic, MdSpaceDashboard } from "react-icons/md";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { TiCalendar } from "react-icons/ti";


const App = () => {

  const [open, setOpen] = useState(true);
  const [subMenus, setSubMenus] = useState({
    calendar: false,
    support: false,
    tables: false,
    analytics: false,
    inbox: false,
    settings: false,
  });

  interface SubMenuState {
    calendar: boolean;
    support: boolean;
    tables: boolean;
    analytics: boolean;
    inbox: boolean;
    settings: boolean;
  }

  interface MenuItem {
    title: string;
    icon: React.ReactNode;
    gap?: boolean;
    subMenu?: string[];
    // Dica: É melhor garantir que key seja uma das chaves válidas
    key?: keyof SubMenuState;
  }

  const toggleSubMenu = (menu: keyof SubMenuState | undefined) => {
    if (menu) {
      setSubMenus((prev: SubMenuState) => ({
        ...prev,
        // CORREÇÃO 1: Adicionado 'as keyof SubMenuState'
        [menu]: !prev[menu as keyof SubMenuState],
      }));
    }
  };

  const Menus: MenuItem[] = [ // Dica: Tipar o array ajuda também
    { title: "Dashboard", icon: <MdSpaceDashboard /> },
    { title: "Inbox", icon: <BiChat />, gap: true, subMenu: ["Requested Messages", "Unread Messages", "All Messages"], key: "inbox" },
    { title: "Calendar", icon: <TiCalendar /> },
    { title: "Tables", icon: <FiTable /> },
    { title: "Analytics", icon: <GoGraph /> },
    { title: "Support", icon: <MdOutlineHeadsetMic /> },
    { title: "Setting", icon: <FaGears />, subMenu: ["General", "Security", "Notifications"], key: "settings" },
  ];

  return (
    <div className="w-full flex">
      {/* Sidebar section */}
      <div className={`${open ? "w-72 p-5" : "w-20 p-4"} bg-zinc-900 h-screen pt-8 relative duration-300 ease-in-out`}>
        {/* Toggle button sections */}
        <div className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-zinc-50 border-zinc-50 border-2 rounded-full text-xl flex items-center justify-center ${!open && "rotate-180"} transition-all ease-in-out duration-300`}
          onClick={() => setOpen(!open)}
        >
          {open ?
            <TbLayoutSidebarLeftExpand /> :
            <TbLayoutSidebarLeftCollapse />}
        </div>

        {/* Logo and title section */}
        <div className="flex gap-x-4 items-center">
          <img src="https://cdn.pixabay.com/photo/2017/02/18/19/20/logo-2078018_640.png" alt="logo" className={`w-10 h-10 rounded-full object-cover object-center cursor-pointer ease-in-out duration-3 ${open && "rotate-[360deg]"}`} />

          <h1 className={`text-zinc-50 origin-left font-semibold text-xl duration-200 ease-in-out ${!open && "scale-0"}`}>
            Admin Dashboard
          </h1>
        </div>

        {/* Sidebar Navbar Items section */}
        <ul className="pt-6 space-y-0.5">
          {Menus.map((Menu, index) => (
            <li key={index} className={`flex flex-col rounded-md py-3 px-4 cursor-pointer hover:text-white text-zinc-50 hover:bg-zinc-800/50 transition-all ease-in-out duration-300 ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-zinc-800/40"}`}>
              <div className="flex items-center justify-between gap-x-4" onClick={() => toggleSubMenu(Menu.key)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {Menu.icon}
                  </span>
                  <span className={`${!open && "hidden"} origin-left ease-in-out duration-300`}>
                    {Menu.title}
                  </span>
                </div>

                {Menu.subMenu && Menu.key && (
                    <span
                      // CORREÇÃO 2: Adicionado 'as keyof SubMenuState' na verificação do estado para a rotação
                      className={`ml-auto cursor-pointer text-sm ${subMenus[Menu.key as keyof SubMenuState] ? "rotate-360" : ""} transition-transform ease-in-out duration-300 ${!open ? "hidden" : ""}`}>
                      {/* CORREÇÃO 3: Adicionado 'as keyof SubMenuState' na verificação do ícone */}
                      {subMenus[Menu.key as keyof SubMenuState] ?
                        <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  )}

              </div>

              {/* Sidebar submenus NAvbar ITems */}
              {/* CORREÇÃO 4: Adicionado 'as keyof SubMenuState' para verificar se o submenu deve aparecer */}
              {Menu.subMenu && Menu.key && subMenus[Menu.key as keyof SubMenuState] && (
                <ul className="pl-3 pt-4 text-zinc-300">
                  {Menu.subMenu.map((subMenu, subIndex) => (
                    <li key={subIndex} className="text-sm flex items-center gap-x-2 py-3 px-2 hover:bg-zinc-800 rounded-lg">
                      <span className="text-zinc-4">
                        <FaChevronRight className="text-xs" />
                      </span>
                      {subMenu}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Dashboard Layout section */}
      <div className="h-screen flex-1 bg-zinc-100 space-y-6">
        {/* Navbar section */}
        <div className="w-full h-[8ch] px-12 bg-zinc-50 shadow-md flex items-center justify-between">

          <div className="w-96 border border-zinc-300 rounded-full h-11 flex items-center justify-center">
            <input type="text" placeholder="Search..." className="flex-1 h-full rounded-full outline-none border-none bg-zinc-50 px-4" />

            <button className="px-4 h-full flex items-center justify-center text-base text-zinc-600 border-l border-zinc-300">
              <FaSearch />
            </button>
          </div>

          <div className="flex items-center gap-x-8">
            {/* Notification */}
            <button className="relative">
              <div className="w-5 h-5 bg-zinc-50 flex items-center justify-center absolute -top-1.5 -right-2.5 rounded-full p-0.5">
                <span className="bg-red-600 text-white rounded-full w-full h-full flex items-center justify-center text-xs">3</span>
              </div>
              <FaBell className="text-xl" />
            </button>

            {/* Profile img */}
            <img src="https://cdn.pixabay.com/photo/2016/11/21/11/17/model-1844729_640.jpg" alt="profile img" className="w-11 h-11 rounded-full object-cover object-center cursor-pointer" />
          </div>
        </div>

        {/* Dashboard contents */}
        <div className="w-full px-12">
          <h1 className="text-xl text-zinc-800 font-medium">
            This is the Dashboard page.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;