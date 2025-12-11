// components/Header.jsx
"use client";

import React from "react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header 
      className={`
        fixed top-0 right-0 z-40 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out
        ${sidebarOpen ? "left-72" : "left-20"}
      `}
    >
      {/* Left Section: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button (Visible only on small screens if not handled by sidebar) 
            or strictly for toggling sidebar on mobile if the sidebar is hidden by default.
            For this layout, the sidebar handles its own toggle on desktop. 
            On mobile, you might want a button here. 
        */}
        <button
          className="p-2 text-gray-600 rounded-md hover:bg-gray-100 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          Painel de Controle
        </h2>
      </div>

      {/* Right Section: User Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <FaBell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@datacaixa.com</p>
          </div>
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaUserCircle size={32} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;