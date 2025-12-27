"use client";

import React, { useState } from "react";
import { 
  FaStore, FaTruck, FaCreditCard, FaClock, FaCoffee, FaTicketAlt, FaPlug, 
  FaSave, FaInfoCircle, FaCalculator, FaMotorcycle, FaUtensils, FaMapMarkedAlt, 
  FaCity, FaPlus, FaTrash, FaEdit, FaExclamationTriangle, FaPercentage, FaMapMarkerAlt,
  FaTimes, FaMoneyBill, FaGlobe, FaQrcode, FaCopy, FaRegClock, FaCalendarAlt, FaTag
} from "react-icons/fa";

// --- COMPONENTES VISUAIS REUTILIZÁVEIS ---

const ToggleSwitch = ({ label, description, checked, onChange }: any) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <h4 className="text-sm font-semibold text-gray-800">{label}</h4>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const SelectionCard = ({ icon, label, checked, onChange }: any) => (
  <div onClick={onChange} className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${checked ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-700" : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"}`}>
    <div className={`text-xl ${checked ? "text-blue-600" : "text-gray-400"}`}>{icon}</div>
    <span className="font-semibold text-sm">{label}</span>
  </div>
);

const RadioOption = ({ label, selected, onClick, description }: any) => (
  <div onClick={onClick} className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all mb-2 ${selected ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:bg-gray-50"}`}>
    <div>
      <span className={`block text-sm font-medium ${selected ? "text-blue-700" : "text-gray-700"}`}>{label}</span>
      {description && <span className="text-xs text-gray-400">{description}</span>}
    </div>
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selected ? "border-blue-600" : "border-gray-300"}`}>
      {selected && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
    </div>
  </div>
);

const PaymentOption = ({ label, subLabel, checked, onChange, children, icon }: any) => (
  <div 
    onClick={onChange} 
    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${checked ? "bg-white border-blue-200 shadow-sm" : "bg-white border-gray-100 opacity-80"}`}
  >
    <div className="flex items-start gap-3">
      <div className="pt-1">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          onClick={(e) => e.stopPropagation()} 
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className={`${checked ? "text-blue-600" : "text-gray-400"}`}>{icon}</span>}
          <span className={`font-semibold ${checked ? "text-gray-800" : "text-gray-600"}`}>{label}</span>
        </div>
        {subLabel && <p className="text-xs text-gray-400 mb-2">{subLabel}</p>}
        
        {checked && children && (
          <div 
            className="mt-3 pl-0 animate-fade-in cursor-auto" 
            onClick={(e) => e.stopPropagation()} 
          >
            {children}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function ParametrosPage() {
  const [activeTab, setActiveTab] = useState("geral");
  const [unsavedChanges, setUnsavedChanges] = useState(true);

  // --- CONTROLE DE MODAL ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">("create");
  // Targets: Regra, Exceção, Horário, Pausa, Cupom
  const [modalTarget, setModalTarget] = useState<"rule" | "exception" | "schedule" | "pausa" | "cupom">("rule"); 
  const [editingItem, setEditingItem] = useState<any>(null);

  // --- ESTADOS GERAIS ---
  const [lojaFechada, setLojaFechada] = useState(false);
  const [ocultarCardapio, setOcultarCardapio] = useState(false);
  const [enviarWhatsapp, setEnviarWhatsapp] = useState(true);
  const [cpfObrigatorio, setCpfObrigatorio] = useState(true);
  const [cepObrigatorio, setCepObrigatorio] = useState(false);
  const [calculoPreco, setCalculoPreco] = useState("media");

  // --- ESTADOS ENTREGA ---
  const [metodos, setMetodos] = useState({ delivery: true, retirada: true, local: false });
  const [tipoTaxa, setTipoTaxa] = useState("km"); 
  const [freteGratis, setFreteGratis] = useState("");
  const [valorTaxaFixa, setValorTaxaFixa] = useState("5.00");
  const [percentualTaxa, setPercentualTaxa] = useState("10");

  // --- ESTADOS PAGAMENTO ---
  const [pagamento, setPagamento] = useState({
    creditoPos: true,
    debitoPos: true,
    dinheiro: true,
    onlineCredito: false,
    onlinePix: false,
    pixEstatico: true,
    valeRefeicao: false
  });
  const [gateways, setGateways] = useState({ credito: 'asaas', pix: 'asaas' });
  const [chavePix, setChavePix] = useState("");
  const [bandeirasVale, setBandeirasVale] = useState("");

  // --- ESTADOS HORÁRIO ---
  const [fusoHorario, setFusoHorario] = useState("America/Sao_Paulo");
  const [horarios, setHorarios] = useState([
    { id: 1, dia: "Segunda-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 2, dia: "Terça-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 3, dia: "Quarta-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 4, dia: "Quinta-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 5, dia: "Sexta-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 6, dia: "Sábado", ativo: true, inicio: "09:00", fim: "14:00" },
    { id: 0, dia: "Domingo", ativo: false, inicio: "00:00", fim: "00:00" },
  ]);

  // --- ESTADOS PAUSAS ---
  const [pausas, setPausas] = useState([
    { id: 1, nome: "Natal", inicio: "2025-12-25T08:00", fim: "2025-12-26T08:00" }
  ]);

  // --- ESTADOS CUPONS (NOVO) ---
  const [cupons, setCupons] = useState([
    { 
      id: 1, 
      codigo: "teste", 
      tipoDesconto: "porcentagem", // ou 'fixo'
      valor: 10, 
      minimoCompra: 4.00, 
      limiteUso: 1, 
      saldoDisponivel: 0,
      ativo: true,
      validade: "2025-02-13T01:00"
    }
  ]);

  // Tabelas de Dados
  const [bairros, setBairros] = useState([
    { id: 1, nome: "Centro", valor: 5.00 },
    { id: 2, nome: "Jardim das Flores", valor: 8.00 },
  ]);
  const [regrasKm, setRegrasKm] = useState([
    { id: 1, min: 0, max: 3, valor: 4.00 },
    { id: 2, min: 3.1, max: 5, valor: 6.00 },
    { id: 3, min: 5.1, max: 8, valor: 9.00 },
  ]);
  const [excecoesCep, setExcecoesCep] = useState([
    { id: 101, cep: "12345-000", valor: 15.00 }
  ]);

  const tabs = [
    { id: "geral", label: "Geral", icon: <FaStore /> },
    { id: "entrega", label: "Entrega", icon: <FaTruck /> },
    { id: "pagamento", label: "Formas de Pgto.", icon: <FaCreditCard /> },
    { id: "horario", label: "Horário de Funcionamento", icon: <FaClock /> },
    { id: "pausa", label: "Pausas", icon: <FaCoffee /> },
    { id: "cupom", label: "Cupons", icon: <FaTicketAlt /> },
    { id: "integracao", label: "Integração", icon: <FaPlug /> },
  ];

  // --- FUNÇÕES AUXILIARES ---
  const handleSaveAll = () => {
    setUnsavedChanges(false);
  };

  const handleCopySchedule = (sourceIndex: number) => {
    const source = horarios[sourceIndex];
    const newSchedule = horarios.map((h) => {
      if (h.id === source.id) return h;
      return { ...h, ativo: source.ativo, inicio: source.inicio, fim: source.fim };
    });
    setHorarios(newSchedule);
    setUnsavedChanges(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- FUNÇÕES DE MODAL ---
  const openCreateRuleModal = () => {
    setModalTarget("rule");
    setModalType("create");
    setEditingItem(tipoTaxa === 'km' ? { min: '', max: '', valor: '' } : { nome: '', valor: '' });
    setModalOpen(true);
  };

  const openCreateExceptionModal = () => {
    setModalTarget("exception");
    setModalType("create");
    setEditingItem({ cep: '', valor: '' });
    setModalOpen(true);
  };

  const openCreatePausaModal = () => {
    setModalTarget("pausa");
    setModalType("create");
    setEditingItem({ nome: '', inicio: '', fim: '' });
    setModalOpen(true);
  };

  const openCreateCupomModal = () => {
    setModalTarget("cupom");
    setModalType("create");
    setEditingItem({ 
      codigo: '', 
      tipoDesconto: 'porcentagem', 
      valor: '', 
      minimoCompra: '', 
      limiteUso: '', 
      validade: '',
      ativo: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any, target: "rule" | "exception" | "pausa" | "cupom") => {
    setModalTarget(target);
    setModalType("edit");
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const openDeleteModal = (item: any, target: "rule" | "exception" | "schedule" | "pausa" | "cupom") => {
    setModalTarget(target);
    setModalType("delete");
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    if (modalTarget === 'exception') {
      const newItem = {
        id: editingItem.id || Date.now(),
        cep: editingItem.cep,
        valor: Number(editingItem.valor)
      };
      if (modalType === 'create') setExcecoesCep([...excecoesCep, newItem]);
      else setExcecoesCep(excecoesCep.map(item => item.id === editingItem.id ? newItem : item));
    } else if (modalTarget === 'pausa') {
      const newItem = {
        id: editingItem.id || Date.now(),
        nome: editingItem.nome,
        inicio: editingItem.inicio,
        fim: editingItem.fim
      };
      if (modalType === 'create') setPausas([...pausas, newItem]);
      else setPausas(pausas.map(item => item.id === editingItem.id ? newItem : item));
    } else if (modalTarget === 'cupom') {
      const newItem = {
        id: editingItem.id || Date.now(),
        codigo: editingItem.codigo,
        tipoDesconto: editingItem.tipoDesconto,
        valor: Number(editingItem.valor),
        minimoCompra: Number(editingItem.minimoCompra),
        limiteUso: Number(editingItem.limiteUso),
        validade: editingItem.validade,
        ativo: editingItem.ativo,
        saldoDisponivel: 0 // Simulado
      };
      if (modalType === 'create') setCupons([...cupons, newItem]);
      else setCupons(cupons.map(item => item.id === editingItem.id ? newItem : item));
    }
    else {
      // Regras KM ou Bairro
      if (tipoTaxa === 'km') {
        const newItem = {
          id: editingItem.id || Date.now(),
          min: Number(editingItem.min),
          max: Number(editingItem.max),
          valor: Number(editingItem.valor)
        };
        if (modalType === 'create') setRegrasKm([...regrasKm, newItem]);
        else setRegrasKm(regrasKm.map(item => item.id === editingItem.id ? newItem : item));
      } else if (tipoTaxa === 'bairro') {
        const newItem = {
          id: editingItem.id || Date.now(),
          nome: editingItem.nome,
          valor: Number(editingItem.valor)
        };
        if (modalType === 'create') setBairros([...bairros, newItem]);
        else setBairros(bairros.map(item => item.id === editingItem.id ? newItem : item));
      }
    }
    closeModal();
    setUnsavedChanges(true); 
  };

  const handleDeleteItem = () => {
    if (modalTarget === 'exception') {
      setExcecoesCep(excecoesCep.filter(item => item.id !== editingItem.id));
    } else if (modalTarget === 'pausa') {
      setPausas(pausas.filter(item => item.id !== editingItem.id));
    } else if (modalTarget === 'cupom') {
      setCupons(cupons.filter(item => item.id !== editingItem.id));
    } else if (modalTarget === 'schedule') {
      const newHorarios = [...horarios];
      const index = newHorarios.findIndex(h => h.id === editingItem.id);
      if (index >= 0) {
        newHorarios[index].inicio = "";
        newHorarios[index].fim = "";
        newHorarios[index].ativo = false;
        setHorarios(newHorarios);
      }
    } else {
      if (tipoTaxa === 'km') setRegrasKm(regrasKm.filter(item => item.id !== editingItem.id));
      else if (tipoTaxa === 'bairro') setBairros(bairros.filter(item => item.id !== editingItem.id));
    }
    closeModal();
    setUnsavedChanges(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-24 relative">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Parâmetros do Sistema</h1>
          <p className="text-gray-500 text-sm">Configure as regras de negócio do seu cardápio digital.</p>
        </div>

        {/* Navegação de Abas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="space-y-6 animate-fade-in">
          
          {/* ABA GERAL */}
          {activeTab === "geral" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaStore className="text-blue-600" /> Visibilidade e Status
                  </h3>
                  <div className="divide-y divide-gray-100">
                    <ToggleSwitch label="Loja Fechada Temporariamente" description="Impede novos pedidos informando que a loja está fechada." checked={lojaFechada} onChange={() => {setLojaFechada(!lojaFechada); setUnsavedChanges(true)}} />
                    <ToggleSwitch label="Ocultar Cardápio Digital" description="O link do cardápio ficará inacessível para os clientes." checked={ocultarCardapio} onChange={() => {setOcultarCardapio(!ocultarCardapio); setUnsavedChanges(true)}} />
                    <ToggleSwitch label="Enviar Pedido para WhatsApp" description="Ao finalizar, o cliente será redirecionado para o WhatsApp." checked={enviarWhatsapp} onChange={() => {setEnviarWhatsapp(!enviarWhatsapp); setUnsavedChanges(true)}} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" /> Dados Obrigatórios
                  </h3>
                  <div className="divide-y divide-gray-100">
                    <ToggleSwitch label="Exigir CPF na nota" checked={cpfObrigatorio} onChange={() => {setCpfObrigatorio(!cpfObrigatorio); setUnsavedChanges(true)}} />
                    <ToggleSwitch label="Exigir CEP no cadastro" checked={cepObrigatorio} onChange={() => {setCepObrigatorio(!cepObrigatorio); setUnsavedChanges(true)}} />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalculator className="text-blue-600" /> Regras de Valores
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Valor Mínimo (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">R$</span>
                        <input type="number" onChange={() => setUnsavedChanges(true)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="0,00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CEP Padrão</label>
                      <input type="text" onChange={() => setUnsavedChanges(true)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="00000-000" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cálculo para produtos com mais de 1 sabor (Ex: Pizzas)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div onClick={() => {setCalculoPreco("media"); setUnsavedChanges(true)}} className={`cursor-pointer p-3 border rounded-lg flex items-center gap-3 transition-all ${calculoPreco === 'media' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${calculoPreco === 'media' ? 'border-blue-600' : 'border-gray-400'}`}>
                          {calculoPreco === 'media' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-800">Preço Médio</span>
                          <span className="text-xs text-gray-500">Soma dos sabores ÷ qtd</span>
                        </div>
                      </div>
                      <div onClick={() => {setCalculoPreco("maior"); setUnsavedChanges(true)}} className={`cursor-pointer p-3 border rounded-lg flex items-center gap-3 transition-all ${calculoPreco === 'maior' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${calculoPreco === 'maior' ? 'border-blue-600' : 'border-gray-400'}`}>
                          {calculoPreco === 'maior' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-800">Maior Valor</span>
                          <span className="text-xs text-gray-500">Considera o sabor mais caro</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-gray-800">Observações Gerais</h3>
                    <span className="text-xs text-gray-400">Exibido no checkout</span>
                  </div>
                  <textarea onChange={() => setUnsavedChanges(true)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32" placeholder="Ex: Tempo de entrega pode variar em dias de chuva..."></textarea>
                  <p className="text-right text-xs text-gray-400 mt-1">0 / 200 caracteres</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA ENTREGA ================= */}
          {activeTab === "entrega" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Métodos Aceitos</h3>
                  <div className="space-y-3">
                    <SelectionCard icon={<FaMotorcycle />} label="Delivery (Entrega)" checked={metodos.delivery} onChange={() => {setMetodos({...metodos, delivery: !metodos.delivery}); setUnsavedChanges(true)}} />
                    <SelectionCard icon={<FaStore />} label="Retirar no Local" checked={metodos.retirada} onChange={() => {setMetodos({...metodos, retirada: !metodos.retirada}); setUnsavedChanges(true)}} />
                    <SelectionCard icon={<FaUtensils />} label="Consumir no Local" checked={metodos.local} onChange={() => {setMetodos({...metodos, local: !metodos.local}); setUnsavedChanges(true)}} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Cálculo do Frete</h3>
                  <RadioOption label="Taxa Fixa" description="Valor único para qualquer endereço" selected={tipoTaxa === 'fixa'} onClick={() => {setTipoTaxa('fixa'); setUnsavedChanges(true)}} />
                  <RadioOption label="Taxa por Bairro" description="Defina valores para bairros específicos" selected={tipoTaxa === 'bairro'} onClick={() => {setTipoTaxa('bairro'); setUnsavedChanges(true)}} />
                  <RadioOption label="Taxa por KM (Distância)" description="Calculado via Google Maps" selected={tipoTaxa === 'km'} onClick={() => {setTipoTaxa('km'); setUnsavedChanges(true)}} />
                   <RadioOption label="Percentual do Pedido" description="Cobrar % sobre o total da compra" selected={tipoTaxa === 'percentual'} onClick={() => {setTipoTaxa('percentual'); setUnsavedChanges(true)}} />

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Frete Grátis a partir de:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">R$</span>
                      <input type="number" value={freteGratis} onChange={(e) => {setFreteGratis(e.target.value); setUnsavedChanges(true)}} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0,00" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {tipoTaxa === 'km' && <><FaMapMarkedAlt className="text-blue-600"/> Tabela por KM</>}
                        {tipoTaxa === 'bairro' && <><FaCity className="text-blue-600"/> Tabela de Bairros</>}
                        {tipoTaxa === 'fixa' && <><FaMotorcycle className="text-blue-600"/> Taxa Única</>}
                        {tipoTaxa === 'percentual' && <><FaPercentage className="text-blue-600"/> Taxa Percentual</>}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {tipoTaxa === 'km' ? 'Defina as faixas de quilometragem e seus respectivos preços.' : 'Configure os valores conforme a regra selecionada.'}
                      </p>
                    </div>
                    {(tipoTaxa === 'km' || tipoTaxa === 'bairro') && (
                      <button onClick={openCreateRuleModal} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                        <FaPlus size={12}/> Adicionar
                      </button>
                    )}
                  </div>

                  {tipoTaxa === 'fixa' && (
                    <div className="animate-fade-in space-y-6">
                      <div className="max-w-xs">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Valor da Entrega</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400 font-bold">R$</span>
                          <input type="number" value={valorTaxaFixa} onChange={(e) => {setValorTaxaFixa(e.target.value); setUnsavedChanges(true)}} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-2">Simulação:</h4>
                        <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Pedido Exemplo</span><span>R$ 45,00</span></div>
                        <div className="flex justify-between text-sm font-bold text-blue-600 mb-2"><span>+ Taxa</span><span>R$ {Number(valorTaxaFixa).toFixed(2)}</span></div>
                        <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-gray-800"><span>Total</span><span>R$ {(45 + Number(valorTaxaFixa)).toFixed(2)}</span></div>
                      </div>
                    </div>
                  )}

                  {tipoTaxa === 'percentual' && (
                    <div className="animate-fade-in space-y-6">
                      <div className="max-w-xs">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Porcentagem</label>
                        <div className="relative">
                          <input type="number" value={percentualTaxa} onChange={(e) => {setPercentualTaxa(e.target.value); setUnsavedChanges(true)}} className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                          <span className="absolute right-4 top-3.5 text-gray-400 font-bold">%</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Ex: 10% do valor dos produtos.</p>
                      </div>
                       <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h4 className="text-sm font-bold text-orange-800 mb-2">Simulação (R$ 100,00):</h4>
                        <div className="flex justify-between text-sm font-bold text-orange-600 mb-2"><span>+ Taxa ({percentualTaxa}%)</span><span>R$ {(100 * (Number(percentualTaxa)/100)).toFixed(2)}</span></div>
                        <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-gray-800"><span>Total</span><span>R$ {(100 + (100 * (Number(percentualTaxa)/100))).toFixed(2)}</span></div>
                      </div>
                    </div>
                  )}

                  {tipoTaxa === 'bairro' && (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                       <table className="w-full text-sm text-left">
                         <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                           <tr><th className="px-6 py-3">Bairro</th><th className="px-6 py-3">Valor</th><th className="px-6 py-3 text-right">Ações</th></tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {bairros.map((b) => (
                             <tr key={b.id} className="hover:bg-gray-50 transition-colors duration-200">
                               <td className="px-6 py-4">{b.nome}</td>
                               <td className="px-6 py-4 font-bold text-green-600">R$ {b.valor.toFixed(2)}</td>
                               <td className="px-6 py-4 flex justify-end gap-2">
                                 <button onClick={() => openEditModal(b, 'rule')} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" title="Editar"><FaEdit size={16}/></button>
                                 <button onClick={() => openDeleteModal(b, 'rule')} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Excluir"><FaTrash size={16}/></button>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </div>
                  )}

                  {tipoTaxa === 'km' && (
                    <div className="animate-fade-in">
                      <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3">KM Inicial</th>
                              <th className="px-6 py-3">KM Final</th>
                              <th className="px-6 py-3">Valor</th>
                              <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {regrasKm.map((r) => (
                              <tr key={r.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4">{r.min} km</td>
                                <td className="px-6 py-4">{r.max} km</td>
                                <td className="px-6 py-4 font-bold text-green-600">R$ {r.valor.toFixed(2)}</td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                  <button onClick={() => openEditModal(r, 'rule')} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" title="Editar"><FaEdit size={16}/></button>
                                  <button onClick={() => openDeleteModal(r, 'rule')} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Excluir"><FaTrash size={16}/></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
                        <div className="flex justify-between items-center mb-4">
                           <div className="flex items-center gap-2">
                             <FaExclamationTriangle className="text-orange-500"/>
                             <h4 className="font-bold text-gray-800">Exceções de CEP</h4>
                           </div>
                           <button onClick={openCreateExceptionModal} className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1 cursor-pointer">
                             <FaPlus size={10}/> Cadastrar Exceção
                           </button>
                        </div>
                        
                        {excecoesCep.length > 0 ? (
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                             <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-2">CEP</th>
                                    <th className="px-4 py-2">Valor Fixo</th>
                                    <th className="px-4 py-2 text-right">Ações</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {excecoesCep.map((ex) => (
                                    <tr key={ex.id} className="hover:bg-gray-50 transition-colors duration-200">
                                      <td className="px-4 py-2 font-mono text-gray-600">{ex.cep}</td>
                                      <td className="px-4 py-2 font-bold text-green-600">R$ {ex.valor.toFixed(2)}</td>
                                      <td className="px-4 py-2 flex justify-end gap-2">
                                        <button onClick={() => openEditModal(ex, 'exception')} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" title="Editar">
                                            <FaEdit size={14}/>
                                        </button>
                                        <button onClick={() => openDeleteModal(ex, 'exception')} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Excluir">
                                            <FaTrash size={14}/>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                             </table>
                          </div>
                        ) : (
                          <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg text-gray-400 text-xs">
                            Nenhuma exceção cadastrada.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA PAGAMENTO ================= */}
          {activeTab === "pagamento" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-blue-600" /> Habilitar Formas de Pagamento
                  </h3>

                  <div className="space-y-3">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Pagamento na Entrega / Retirada</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <PaymentOption 
                          label="Cartão de Crédito" 
                          subLabel="Maquininha (POS)" 
                          checked={pagamento.creditoPos} 
                          onChange={() => {setPagamento({...pagamento, creditoPos: !pagamento.creditoPos}); setUnsavedChanges(true)}}
                        />
                        <PaymentOption 
                          label="Cartão de Débito" 
                          subLabel="Maquininha (POS)" 
                          checked={pagamento.debitoPos} 
                          onChange={() => {setPagamento({...pagamento, debitoPos: !pagamento.debitoPos}); setUnsavedChanges(true)}}
                        />
                        <PaymentOption 
                          label="Dinheiro" 
                          subLabel="Permite solicitar troco" 
                          icon={<FaMoneyBill className="text-green-600"/>}
                          checked={pagamento.dinheiro} 
                          onChange={() => {setPagamento({...pagamento, dinheiro: !pagamento.dinheiro}); setUnsavedChanges(true)}}
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Pagamento Digital</p>
                    
                    <PaymentOption 
                      label="Pagamento Online" 
                      subLabel="Cartão de Crédito direto no App"
                      icon={<FaGlobe className="text-blue-500"/>}
                      checked={pagamento.onlineCredito} 
                      onChange={() => {setPagamento({...pagamento, onlineCredito: !pagamento.onlineCredito}); setUnsavedChanges(true)}}
                    >
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gateway Processador</label>
                        <select 
                          value={gateways.credito}
                          onChange={(e) => {setGateways({...gateways, credito: e.target.value}); setUnsavedChanges(true)}}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                          <option value="asaas">Asaas</option>
                          <option value="mercadopago">Mercado Pago</option>
                          <option value="stripe">Stripe</option>
                        </select>
                      </div>
                    </PaymentOption>

                    <PaymentOption 
                      label="Pix Online (Automático)" 
                      subLabel="Confirmação automática via API"
                      icon={<FaQrcode className="text-teal-600"/>}
                      checked={pagamento.onlinePix} 
                      onChange={() => {setPagamento({...pagamento, onlinePix: !pagamento.onlinePix}); setUnsavedChanges(true)}}
                    >
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gateway Pix</label>
                        <select 
                          value={gateways.pix}
                          onChange={(e) => {setGateways({...gateways, pix: e.target.value}); setUnsavedChanges(true)}}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                          <option value="asaas">Asaas</option>
                          <option value="mercadopago">Mercado Pago</option>
                        </select>
                      </div>
                    </PaymentOption>

                    <PaymentOption 
                      label="Pix (Estático)" 
                      subLabel="Cliente envia o comprovante"
                      icon={<FaQrcode className="text-gray-600"/>}
                      checked={pagamento.pixEstatico} 
                      onChange={() => {setPagamento({...pagamento, pixEstatico: !pagamento.pixEstatico}); setUnsavedChanges(true)}}
                    >
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Chave PIX</label>
                        <input 
                          type="text" 
                          value={chavePix}
                          onChange={(e) => {setChavePix(e.target.value); setUnsavedChanges(true)}}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                          placeholder="CNPJ, Email ou Telefone"
                        />
                      </div>
                    </PaymentOption>

                    <PaymentOption 
                      label="Vale Refeição" 
                      subLabel="Sodexo, Alelo, VR..."
                      icon={<FaTicketAlt className="text-orange-500"/>}
                      checked={pagamento.valeRefeicao} 
                      onChange={() => {setPagamento({...pagamento, valeRefeicao: !pagamento.valeRefeicao}); setUnsavedChanges(true)}}
                    >
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Bandeiras Aceitas</label>
                        <textarea 
                          rows={2}
                          value={bandeirasVale}
                          onChange={(e) => {setBandeirasVale(e.target.value); setUnsavedChanges(true)}}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                          placeholder="Ex: Aceitamos VR e Alelo Refeição..."
                        />
                      </div>
                    </PaymentOption>

                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                   <div className="flex items-start gap-3">
                     <FaInfoCircle className="text-blue-600 mt-1 shrink-0" />
                     <div>
                       <h4 className="font-bold text-blue-900 text-sm mb-1">Como funciona o Pix?</h4>
                       <p className="text-xs text-blue-800 leading-relaxed">
                         <strong>Pix Online:</strong> O cliente paga e o sistema aprova o pedido automaticamente na hora. Requer conta em Gateway.<br/><br/>
                         <strong>Pix Estático:</strong> O cliente faz a transferência e precisa enviar o comprovante via WhatsApp para você aprovar.
                       </p>
                     </div>
                   </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Resumo do Checkout</h3>
                  <div className="space-y-2">
                    {Object.entries(pagamento).filter(([key, val]) => val).length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Nenhum método selecionado.</p>
                    ) : (
                      <ul className="space-y-2">
                        {pagamento.creditoPos && <li className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 rounded-full bg-green-500"></div> Crédito (Maquininha)</li>}
                        {pagamento.debitoPos && <li className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 rounded-full bg-green-500"></div> Débito (Maquininha)</li>}
                        {pagamento.dinheiro && <li className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 rounded-full bg-green-500"></div> Dinheiro</li>}
                        {pagamento.onlineCredito && <li className="flex items-center gap-2 text-sm text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Crédito Online ({gateways.credito})</li>}
                        {pagamento.pixEstatico && <li className="flex items-center gap-2 text-sm text-gray-600"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Pix (Comprovante)</li>}
                        {pagamento.onlinePix && <li className="flex items-center gap-2 text-sm text-teal-600"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Pix Automático ({gateways.pix})</li>}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA HORÁRIOS ================= */}
          {activeTab === "horario" && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                     <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaRegClock className="text-blue-600" /> Funcionamento e Fusos
                    </h3>
                    <p className="text-sm text-gray-500">Defina os horários de abertura e fechamento para cada dia da semana.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <FaGlobe className="text-gray-400" />
                    <select 
                      value={fusoHorario} 
                      onChange={(e) => {setFusoHorario(e.target.value); setUnsavedChanges(true)}}
                      className="bg-transparent text-sm text-gray-700 font-medium outline-none cursor-pointer"
                    >
                      <option value="America/Sao_Paulo">Brasília (GMT-03:00)</option>
                      <option value="America/Manaus">Manaus (GMT-04:00)</option>
                      <option value="America/Noronha">Fernando de Noronha (GMT-02:00)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  {horarios.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl transition-all ${item.ativo ? "bg-white border border-gray-200 shadow-sm" : "bg-gray-50 border border-gray-100 opacity-70"}`}
                    >
                      {/* Dia e Toggle */}
                      <div className="md:col-span-4 flex items-center justify-between">
                         <span className={`font-semibold ${item.ativo ? "text-gray-800" : "text-gray-400"}`}>{item.dia}</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={item.ativo} 
                              onChange={() => {
                                const newHorarios = [...horarios];
                                newHorarios[index].ativo = !newHorarios[index].ativo;
                                setHorarios(newHorarios);
                                setUnsavedChanges(true);
                              }} 
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                      </div>

                      {/* Inputs de Hora */}
                      {item.ativo ? (
                        <div className="md:col-span-6 flex items-center gap-3">
                           <div className="flex items-center gap-2 flex-1">
                             <input 
                               type="time" 
                               value={item.inicio}
                               onChange={(e) => {
                                 const newHorarios = [...horarios];
                                 newHorarios[index].inicio = e.target.value;
                                 setHorarios(newHorarios);
                                 setUnsavedChanges(true);
                               }}
                               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                             />
                           </div>
                           <span className="text-gray-400 font-medium">-</span>
                           <div className="flex items-center gap-2 flex-1">
                             <input 
                               type="time" 
                               value={item.fim}
                               onChange={(e) => {
                                 const newHorarios = [...horarios];
                                 newHorarios[index].fim = e.target.value;
                                 setHorarios(newHorarios);
                                 setUnsavedChanges(true);
                               }}
                               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                             />
                           </div>
                        </div>
                      ) : (
                        <div className="md:col-span-6 text-sm text-gray-400 italic flex items-center">
                          <FaTimes className="mr-2 text-red-300"/> Fechado neste dia
                        </div>
                      )}

                      {/* Ações (Copiar e Excluir) */}
                      <div className="md:col-span-2 flex justify-end gap-2">
                        {item.ativo && (
                          <button 
                             onClick={() => openDeleteModal(item, 'schedule')}
                             title="Limpar horários"
                             className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                        {index === 0 && (
                          <button 
                            onClick={() => handleCopySchedule(index)}
                            title="Copiar este horário para todos os dias"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase cursor-pointer"
                          >
                             <FaCopy size={14}/> <span className="hidden md:inline">Replicar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA PAUSAS ================= */}
          {activeTab === "pausa" && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                     <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaCoffee className="text-orange-500" /> Pausas e Feriados
                    </h3>
                    <p className="text-sm text-gray-500">Programe fechamentos temporários, férias coletivas ou feriados.</p>
                  </div>
                  <button 
                    onClick={openCreatePausaModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FaPlus size={12}/> Adicionar Pausa
                  </button>
                </div>

                {pausas.length > 0 ? (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                     <table className="w-full text-sm text-left">
                       <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                         <tr>
                           <th className="px-6 py-3">Motivo / Nome</th>
                           <th className="px-6 py-3">Início</th>
                           <th className="px-6 py-3">Fim</th>
                           <th className="px-6 py-3 text-right">Ações</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                         {pausas.map((pausa) => (
                           <tr key={pausa.id} className="hover:bg-gray-50 transition-colors duration-200">
                             <td className="px-6 py-4 font-medium text-gray-800">{pausa.nome}</td>
                             <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                               <FaCalendarAlt className="text-gray-400" /> {formatDate(pausa.inicio)}
                             </td>
                             <td className="px-6 py-4 text-gray-600">
                               {formatDate(pausa.fim)}
                             </td>
                             <td className="px-6 py-4 flex justify-end gap-2">
                               <button onClick={() => openEditModal(pausa, 'pausa')} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" title="Editar"><FaEdit size={16}/></button>
                               <button onClick={() => openDeleteModal(pausa, 'pausa')} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Excluir"><FaTrash size={16}/></button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-200">
                      <FaCoffee size={20} />
                    </div>
                    <h4 className="text-gray-800 font-medium">Nenhuma pausa programada</h4>
                    <p className="text-sm text-gray-500 mt-1">Sua loja funcionará normalmente conforme os horários definidos.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= ABA CUPONS (NOVA) ================= */}
          {activeTab === "cupom" && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                     <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaTicketAlt className="text-blue-600" /> Cupons de Desconto
                    </h3>
                    <p className="text-sm text-gray-500">Crie códigos promocionais para seus clientes.</p>
                  </div>
                  <button 
                    onClick={openCreateCupomModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FaPlus size={12}/> Adicionar
                  </button>
                </div>

                {cupons.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                     <table className="w-full text-sm text-left">
                       <thead className="bg-gray-800 text-white font-semibold">
                         <tr>
                           <th className="px-4 py-3">CÓDIGO</th>
                           <th className="px-4 py-3">DESCONTO</th>
                           <th className="px-4 py-3">PRAZO EXPIRAÇÃO</th>
                           <th className="px-4 py-3">VR. MÍNIMO COMPRA</th>
                           <th className="px-4 py-3">LIMITE DE USO</th>
                           <th className="px-4 py-3">SALDO</th>
                           <th className="px-4 py-3 text-center">ATIVO</th>
                           <th className="px-4 py-3 text-right">AÇÕES</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 bg-white">
                         {cupons.map((cupom) => (
                           <tr key={cupom.id} className="hover:bg-gray-50 transition-colors duration-200">
                             <td className="px-4 py-4 font-mono font-bold text-gray-700">{cupom.codigo}</td>
                             <td className="px-4 py-4 text-green-600 font-bold">
                               {cupom.tipoDesconto === 'porcentagem' ? `${cupom.valor}%` : formatCurrency(cupom.valor)}
                             </td>
                             <td className="px-4 py-4 text-gray-600">
                               {formatDate(cupom.validade)}
                             </td>
                             <td className="px-4 py-4 text-gray-600">
                               {formatCurrency(cupom.minimoCompra)}
                             </td>
                             <td className="px-4 py-4 text-gray-600 text-center">
                               {cupom.limiteUso}
                             </td>
                             <td className="px-4 py-4 text-gray-600 text-center">
                               {cupom.saldoDisponivel}
                             </td>
                             <td className="px-4 py-4 text-center">
                               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cupom.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                 {cupom.ativo ? "Sim" : "Não"}
                               </span>
                             </td>
                             <td className="px-4 py-4 flex justify-end gap-2">
                               <button onClick={() => openEditModal(cupom, 'cupom')} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer" title="Editar"><FaEdit size={16}/></button>
                               <button onClick={() => openDeleteModal(cupom, 'cupom')} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer" title="Excluir"><FaTrash size={16}/></button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 border border-gray-200">
                      <FaTicketAlt size={20} />
                    </div>
                    <h4 className="text-gray-800 font-medium">Nenhum cupom ativo</h4>
                    <p className="text-sm text-gray-500 mt-1">Crie campanhas de desconto para atrair mais clientes.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Placeholder para outras abas */}
          {activeTab !== "geral" && activeTab !== "entrega" && activeTab !== "pagamento" && activeTab !== "horario" && activeTab !== "pausa" && activeTab !== "cupom" && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="text-gray-300 text-6xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
              <h3 className="text-lg font-medium text-gray-600">Configurações de {tabs.find(t => t.id === activeTab)?.label}</h3>
              <p className="text-sm text-gray-400">O conteúdo desta aba seria carregado aqui.</p>
            </div>
          )}
        </div>
      </div>

      {/* BARRA DE SALVAR CONDICIONAL */}
      {unsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] animate-fade-in">
          <div className="max-w-6xl mx-auto flex justify-end items-center gap-4">
              <span className="text-sm text-gray-500 hidden md:inline">Você tem alterações não salvas</span>
              <button 
                onClick={() => setUnsavedChanges(false)} 
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <FaSave /> Salvar Alterações
              </button>
          </div>
        </div>
      )}

      {/* --- MODAL UNIVERSAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          
          {modalType === 'delete' ? (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <FaExclamationTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {modalTarget === 'schedule' ? 'Limpar Horário?' : 'Excluir Item?'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {modalTarget === 'schedule' 
                    ? 'Deseja remover os horários definidos para este dia? Ele será marcado como fechado.' 
                    : 'Tem certeza que deseja remover este item? Esta ação não pode ser desfeita.'}
                </p>
                <div className="flex gap-3 w-full">
                  <button onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer">Cancelar</button>
                  <button onClick={handleDeleteItem} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 cursor-pointer">
                    {modalTarget === 'schedule' ? 'Sim, Limpar' : 'Sim, Excluir'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  {modalType === 'create' ? <FaPlus className="text-blue-600"/> : <FaEdit className="text-blue-600"/>}
                  {modalType === 'create' ? 'Adicionar' : 'Editar'} {
                    modalTarget === 'exception' ? 'Exceção de CEP' : 
                    modalTarget === 'pausa' ? 'Pausa / Feriado' : 
                    modalTarget === 'cupom' ? 'Cupom de Desconto' : 'Regra'
                  }
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"><FaTimes size={18} /></button>
              </div>

              <div className="p-6 space-y-4">
                
                {modalTarget === 'exception' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CEP</label>
                    <input type="text" value={editingItem?.cep} onChange={(e) => setEditingItem({...editingItem, cep: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="00000-000"/>
                    <p className="text-xs text-gray-400 mt-1">Digite o CEP com ou sem traço.</p>
                  </div>
                )}

                {modalTarget === 'pausa' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Evento</label>
                      <input 
                        type="text" 
                        value={editingItem?.nome} 
                        onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})} 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Ex: Férias Coletivas"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Início</label>
                        <input 
                          type="datetime-local" 
                          value={editingItem?.inicio} 
                          onChange={(e) => setEditingItem({...editingItem, inicio: e.target.value})} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fim</label>
                        <input 
                          type="datetime-local" 
                          value={editingItem?.fim} 
                          onChange={(e) => setEditingItem({...editingItem, fim: e.target.value})} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                        />
                      </div>
                    </div>
                  </>
                )}

                {modalTarget === 'cupom' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código do Cupom</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={editingItem?.codigo} 
                            onChange={(e) => setEditingItem({...editingItem, codigo: e.target.value.toUpperCase()})} 
                            className="w-full pl-8 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 uppercase" 
                            placeholder="PROMOCAO10"
                          />
                          <FaTag className="absolute left-3 top-3 text-gray-400" size={12}/>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo de Desconto</label>
                        <select 
                          value={editingItem?.tipoDesconto}
                          onChange={(e) => setEditingItem({...editingItem, tipoDesconto: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                          <option value="porcentagem">Porcentagem (%)</option>
                          <option value="fixo">Valor Fixo (R$)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor do Desconto</label>
                        <input 
                          type="number" 
                          value={editingItem?.valor} 
                          onChange={(e) => setEditingItem({...editingItem, valor: e.target.value})} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mínimo Compra (R$)</label>
                        <input 
                          type="number" 
                          value={editingItem?.minimoCompra} 
                          onChange={(e) => setEditingItem({...editingItem, minimoCompra: e.target.value})} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Limite de Uso</label>
                        <input 
                          type="number" 
                          value={editingItem?.limiteUso} 
                          onChange={(e) => setEditingItem({...editingItem, limiteUso: e.target.value})} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          placeholder="Ex: 100"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prazo de Expiração</label>
                        <input 
                          type="datetime-local" 
                          value={editingItem?.validade} 
                          onChange={(e) => setEditingItem({...editingItem, validade: e.target.value})} 
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                        />
                      </div>

                      <div className="col-span-2 flex items-center justify-between pt-2">
                        <label className="text-sm font-semibold text-gray-700">Cupom Ativo?</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={editingItem?.ativo} 
                            onChange={(e) => setEditingItem({...editingItem, ativo: e.target.checked})} 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {modalTarget === 'rule' && tipoTaxa === 'km' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">KM Inicial</label>
                      <input type="number" value={editingItem?.min} onChange={(e) => setEditingItem({...editingItem, min: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">KM Final</label>
                      <input type="number" value={editingItem?.max} onChange={(e) => setEditingItem({...editingItem, max: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="5"/>
                    </div>
                  </div>
                )}

                {modalTarget === 'rule' && tipoTaxa === 'bairro' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Bairro</label>
                    <input type="text" value={editingItem?.nome} onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Centro"/>
                  </div>
                )}

                {/* CAMPO DE VALOR (COMUM A TODOS EXCETO PAUSA E CUPOM) */}
                {modalTarget !== 'pausa' && modalTarget !== 'cupom' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor {modalTarget === 'exception' ? 'Fixo' : 'da Taxa'}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400 font-bold text-sm">R$</span>
                      <input type="number" value={editingItem?.valor} onChange={(e) => setEditingItem({...editingItem, valor: e.target.value})} className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700" placeholder="0.00"/>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">Cancelar</button>
                <button onClick={handleSaveItem} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all cursor-pointer">Salvar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}