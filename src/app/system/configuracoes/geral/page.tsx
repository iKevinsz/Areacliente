"use client";

import React, { useState, useEffect } from "react";
import { 
  User, Lock, Save, Building2, Mail, Phone, 
  ShieldCheck, Loader2, Check, AlertCircle, X 
} from "lucide-react";

export default function ConfigGeralPage() {
  const [activeTab, setActiveTab] = useState("dados");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para mensagens de erro e sucesso
  const [error, setError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "Kevin Datacaixa",
    empresa: "Datacaixa Tecnologia",
    email: "kevin@datacaixa.com.br",
    telefone: "(11) 99999-9999"
  });

  const [passwordData, setPasswordData] = useState({
    novaSenha: "",
    confirmaSenha: ""
  });

  // Limpa erros ao trocar de aba
  useEffect(() => {
    setError("");
  }, [activeTab]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- VALIDAÇÕES ---
    if (activeTab === "dados") {
      if (!formData.nome.trim() || !formData.empresa.trim() || !formData.telefone.trim()) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
    } 
    else if (activeTab === "seguranca") {
      if (!passwordData.novaSenha || !passwordData.confirmaSenha) {
        setError("Preencha ambos os campos de senha.");
        return;
      }
      if (passwordData.novaSenha.length < 6) {
        setError("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (passwordData.novaSenha !== passwordData.confirmaSenha) {
        setError("As senhas não coincidem.");
        return;
      }
    }

    // --- SIMULAÇÃO DE ENVIO ---
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Abre o modal de sucesso
      setIsSuccessModalOpen(true);
      
      // Limpa campos de senha se for o caso
      if (activeTab === "seguranca") {
        setPasswordData({ novaSenha: "", confirmaSenha: "" });
      }
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800 relative">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-500 flex items-center gap-2">
          Perfil / <span className="text-gray-900 font-bold tracking-tight">Configurações Gerais</span>
        </h1>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab("dados")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "dados" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            <User size={16} /> Dados Cadastrais
          </button>
          <button
            onClick={() => setActiveTab("seguranca")}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "seguranca" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            <ShieldCheck size={16} /> Alterar Senha
          </button>
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
          
          {/* MENSAGEM DE ERRO GERAL */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* FORMULÁRIO DADOS CADASTRAIS */}
          {activeTab === "dados" && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <User size={10} /> Nome Completo
                  </label>
                  <input 
                    type="text" 
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all font-medium text-gray-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Building2 size={10} /> Empresa
                  </label>
                  <input 
                    type="text" 
                    value={formData.empresa}
                    onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all font-medium text-gray-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Mail size={10} /> Email Comercial
                  </label>
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none text-gray-500 cursor-not-allowed select-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Phone size={10} /> Telefone / WhatsApp
                  </label>
                  <input 
                    type="text" 
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all font-medium text-gray-700"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* FORMULÁRIO ALTERAR SENHA */}
          {activeTab === "seguranca" && (
            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LOGIN</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="kevin@datacaixa.com.br"
                    disabled
                    className="w-full bg-[#E9ECEF] border border-gray-300 rounded-md px-4 py-3 text-gray-600 text-sm outline-none cursor-not-allowed"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">NOVA SENHA</label>
                <input 
                  type="password" 
                  value={passwordData.novaSenha}
                  onChange={(e) => setPasswordData({...passwordData, novaSenha: e.target.value})}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CONFIRME A SENHA</label>
                <input 
                  type="password" 
                  value={passwordData.confirmaSenha}
                  onChange={(e) => setPasswordData({...passwordData, confirmaSenha: e.target.value})}
                  className={`w-full bg-white border rounded-md px-4 py-3 text-sm outline-none focus:ring-2 transition-all ${
                    passwordData.confirmaSenha && passwordData.novaSenha !== passwordData.confirmaSenha
                    ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-50"
                  }`}
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#5c8ee5] hover:bg-blue-600 text-white px-8 py-3 rounded-md font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[120px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Salvar"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* MODAL DE SUCESSO (CUSTOMIZADO) */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200 border border-green-50">
            
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <Check size={32} strokeWidth={3} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900">Sucesso!</h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "dados" 
                  ? "Suas informações cadastrais foram atualizadas." 
                  : "Sua senha foi alterada com segurança."}
              </p>
            </div>

            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition-all cursor-pointer active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}