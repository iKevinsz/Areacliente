"use client";

import React, { useState } from "react";
import {
  FaStore,
  FaTruck,
  FaCreditCard,
  FaClock,
  FaCoffee,
  FaTicketAlt,
  FaHandshake,
  FaGem,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSave,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaMapMarkedAlt,
  FaCity,
  FaMotorcycle,
  FaPercentage,
  FaMoneyBill,
  FaGlobe,
  FaQrcode,
  FaRegClock,
  FaCalendarAlt,
  FaPlug,
  FaSync,
  FaShoppingBag,
  FaLink,
  FaInfoCircle,
  FaCalculator,
  FaUtensils,
  FaTag,
  FaCopy,
  FaWallet,
} from "react-icons/fa";

// --- COMPONENTES AUXILIARES SIMPLES
const ToggleSwitch = ({ label, description, checked, onChange }: any) => (
  <div className="flex items-start justify-between py-3 gap-3">
    <div className="flex-1">
      <div className="font-medium text-gray-800 text-sm">{label}</div>
      {description && (
        <div className="text-gray-500 text-xs mt-0.5 leading-snug">
          {description}
        </div>
      )}
    </div>
    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const SelectionCard = ({ icon, label, checked, onChange }: any) => (
  <div
    onClick={onChange}
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
      checked
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:bg-gray-50"
    }`}
  >
    <div
      className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border ${
        checked
          ? "bg-blue-600 border-blue-600 text-white"
          : "border-gray-300 text-transparent"
      }`}
    >
      <FaCheckCircle size={12} />
    </div>
    <div className="text-gray-600 shrink-0">{icon}</div>
    <span
      className={`text-sm font-medium leading-tight ${
        checked ? "text-blue-800" : "text-gray-700"
      }`}
    >
      {label}
    </span>
  </div>
);

const RadioOption = ({ label, description, selected, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all mb-2 ${
      selected
        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
        : "border-gray-200 hover:bg-gray-50"
    }`}
  >
    <div
      className={`mt-1 w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${
        selected ? "border-blue-600" : "border-gray-400"
      }`}
    >
      {selected && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
    </div>
    <div>
      <div className="font-bold text-sm text-gray-800">{label}</div>
      <div className="text-xs text-gray-500 leading-tight">{description}</div>
    </div>
  </div>
);

const PaymentOption = ({
  label,
  subLabel,
  icon,
  checked,
  onChange,
  children,
}: any) => (
  <div
    className={`border rounded-xl transition-all ${
      checked ? "border-blue-200 bg-blue-50/30" : "border-gray-200"
    }`}
  >
    <div
      className="flex items-center justify-between p-4 cursor-pointer gap-2"
      onClick={onChange}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 shrink-0 rounded-lg ${
            checked
              ? "bg-white text-blue-600 shadow-sm"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {icon || <FaCreditCard />}
        </div>
        <div>
          <div className="font-bold text-sm text-gray-800 leading-tight">
            {label}
          </div>
          <div className="text-xs text-gray-500">{subLabel}</div>
        </div>
      </div>
      <div
        className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center ${
          checked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
        }`}
      >
        {checked && <FaCheckCircle size={10} />}
      </div>
    </div>
    {checked && children && (
      <div className="px-4 pb-4 pt-0 animate-fade-in">{children}</div>
    )}
  </div>
);

// --- COMPONENT PRINCIPAL ---
export default function ParametrosClient({
  dadosIniciais,
}: {
  dadosIniciais: any;
}) {
  const [activeTab, setActiveTab] = useState("geral");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMlWarningModal, setShowMlWarningModal] = useState(false);

  // --- CONTROLE DE MODAL DE EDIÇÃO ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [modalTarget, setModalTarget] = useState<
    "rule" | "exception" | "schedule" | "pausa" | "cupom"
  >("rule");
  const [editingItem, setEditingItem] = useState<any>(null);

  // --- CARREGAMENTO DE DADOS ---
  const [lojaFechada, setLojaFechada] = useState(
    dadosIniciais?.lojaFechada || false
  );
  const [ocultarCardapio, setOcultarCardapio] = useState(
    dadosIniciais?.ocultarCardapio || false
  );
  const [enviarWhatsapp, setEnviarWhatsapp] = useState(
    dadosIniciais?.enviarWhatsapp ?? true
  );
  const [cpfObrigatorio, setCpfObrigatorio] = useState(
    dadosIniciais?.cpfObrigatorio ?? true
  );
  const [cepObrigatorio, setCepObrigatorio] = useState(
    dadosIniciais?.cepObrigatorio || false
  );
  const [calculoPreco, setCalculoPreco] = useState(
    dadosIniciais?.calculoPreco || "media"
  );
  const [valorMinimo, setValorMinimo] = useState(
    dadosIniciais?.valorMinimo ? String(dadosIniciais.valorMinimo) : "0.00"
  );
  const [cepPadrao, setCepPadrao] = useState(dadosIniciais?.cepPadrao || "");

  const confEntrega = dadosIniciais?.configEntrega || {};
  const [metodos, setMetodos] = useState(
    confEntrega.metodos || { delivery: true, retirada: true, local: false }
  );
  const [tipoTaxa, setTipoTaxa] = useState(confEntrega.tipoTaxa || "km");
  const [freteGratis, setFreteGratis] = useState(confEntrega.freteGratis || "");
  const [valorTaxaFixa, setValorTaxaFixa] = useState(
    confEntrega.valorTaxaFixa || "5.00"
  );
  const [percentualTaxa, setPercentualTaxa] = useState(
    confEntrega.percentualTaxa || "10"
  );

  const confPag = dadosIniciais?.configPagamento || {};
  const [pagamento, setPagamento] = useState(
    confPag.opcoes || {
      creditoPos: true,
      debitoPos: true,
      dinheiro: true,
      onlineCredito: false,
      onlinePix: false,
      pixEstatico: true,
      valeRefeicao: false,
    }
  );
  const [gateways, setGateways] = useState(
    confPag.gateways || { credito: "asaas", pix: "asaas" }
  );
  const [chavePix, setChavePix] = useState(confPag.chavePix || "");
  const [bandeirasVale, setBandeirasVale] = useState(
    confPag.bandeirasVale || ""
  );

  // --- CASHBACK ---
  const confFidelidade = dadosIniciais?.fidelidade || {};
  const [fidAtivo, setFidAtivo] = useState(confFidelidade.ativo || false);
  const [fidPorcentagem, setFidPorcentagem] = useState(
    confFidelidade.porcentagem || "5"
  ); // Ex: 5% de volta
  const [fidValidade, setFidValidade] = useState(
    confFidelidade.validadeDias || "30"
  ); // Validade do saldo
  const [fidMinimo, setFidMinimo] = useState(
    confFidelidade.minimoUso || "0.00"
  ); // Mínimo de saldo para poder usar
  const [fidMaximoUso, setFidMaximoUso] = useState(
    confFidelidade.maximoUsoPorcentagem || "100"
  ); // Quanto do pedido pode ser pago com cashback (ex: 50%)

  const mlConfig = dadosIniciais?.integracaoMl || {};
  const [mlAtivo, setMlAtivo] = useState(mlConfig.ativo || false);
  const [mlAppId, setMlAppId] = useState(mlConfig.appId || "");
  const [mlSecretKey, setMlSecretKey] = useState(mlConfig.secretKey || "");
  const [mlSyncEstoque, setMlSyncEstoque] = useState(
    mlConfig.syncEstoque ?? true
  );
  const [mlSyncPreco, setMlSyncPreco] = useState(mlConfig.syncPreco ?? false);
  const [mlFatorPreco, setMlFatorPreco] = useState(mlConfig.fatorPreco || "0");
  const [mlStatusConexao, setMlStatusConexao] = useState<
    "conectado" | "desconectado" | "erro"
  >(mlConfig.token ? "conectado" : "desconectado");

  const [fusoHorario, setFusoHorario] = useState("America/Sao_Paulo");
  const defaultHorarios = [
    { id: 1, dia: "Segunda-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 2, dia: "Terça-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 3, dia: "Quarta-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 4, dia: "Quinta-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 5, dia: "Sexta-feira", ativo: true, inicio: "08:00", fim: "18:00" },
    { id: 6, dia: "Sábado", ativo: true, inicio: "09:00", fim: "14:00" },
    { id: 0, dia: "Domingo", ativo: false, inicio: "00:00", fim: "00:00" },
  ];
  const [horarios, setHorarios] = useState(
    dadosIniciais?.horarios?.length ? dadosIniciais.horarios : defaultHorarios
  );
  const [pausas, setPausas] = useState(dadosIniciais?.pausas || []);
  const [cupons, setCupons] = useState(dadosIniciais?.cupons || []);
  const [bairros, setBairros] = useState(
    dadosIniciais?.regrasFrete
      ?.filter((r: any) => r.tipo === "bairro")
      .map((r: any) => ({
        id: r.id,
        nome: r.nomeBairro,
        valor: Number(r.valor),
      })) || []
  );
  const [regrasKm, setRegrasKm] = useState(
    dadosIniciais?.regrasFrete
      ?.filter((r: any) => r.tipo === "km")
      .map((r: any) => ({
        id: r.id,
        min: Number(r.kmMin),
        max: Number(r.kmMax),
        valor: Number(r.valor),
      })) || []
  );
  const [excecoesCep, setExcecoesCep] = useState(
    dadosIniciais?.excecoesFrete?.map((e: any) => ({
      id: e.id,
      cep: e.cep,
      valor: Number(e.valor),
    })) || []
  );

  const tabs = [
    { id: "geral", label: "Geral", icon: <FaStore /> },
    { id: "entrega", label: "Entrega", icon: <FaTruck /> },
    { id: "pagamento", label: "Pagamento", icon: <FaCreditCard /> },
    { id: "horario", label: "Horários", icon: <FaClock /> },
    { id: "pausa", label: "Pausas", icon: <FaCoffee /> },
    { id: "cupom", label: "Cupons", icon: <FaTicketAlt /> },
    { id: "fidelidade", label: "Fidelidade", icon: <FaGem /> },
    { id: "integracao", label: "Mercado Livre", icon: <FaHandshake /> },
  ];

  // --- SAVE ---
  const handleSaveAll = async () => {
    setIsSaving(true);
    const payload = {
      geral: {
        lojaFechada,
        ocultarCardapio,
        enviarWhatsapp,
        cpfObrigatorio,
        cepObrigatorio,
        calculoPreco,
        valorMinimo,
        cepPadrao,
      },
      entrega: {
        metodos,
        tipoTaxa,
        freteGratis,
        valorTaxaFixa,
        percentualTaxa,
      },
      pagamento: { opcoes: pagamento, gateways, chavePix, bandeirasVale },
      fidelidade: {
        ativo: fidAtivo,
        tipo: "cashback", // Define explicitamente que é cashback
        porcentagem: fidPorcentagem,
        validadeDias: fidValidade,
        minimoUso: fidMinimo,
        maximoUsoPorcentagem: fidMaximoUso,
      },

      integracaoMl: {
        ativo: mlAtivo,
        appId: mlAppId,
        secretKey: mlSecretKey,
        syncEstoque: mlSyncEstoque,
        syncPreco: mlSyncPreco,
        fatorPreco: mlFatorPreco,
      },
      horarios,
      pausas,
      cupons,
      bairros,
      regrasKm,
      excecoesCep,
    };

    console.log("Salvando:", payload);
    setTimeout(() => {
      setUnsavedChanges(false);
      setShowSuccessModal(true);
      setIsSaving(false);
    }, 1000);
  };

  const handleConnectML = () => {
    if (!mlAppId || !mlSecretKey) {
      setShowMlWarningModal(true);
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setMlStatusConexao("conectado");
      setMlAtivo(true);
      setIsSaving(false);
      setUnsavedChanges(true);
    }, 1500);
  };

  // --- FUNÇÕES AUXILIARES ---
  const handleCopySchedule = (sourceIndex: number) => {
    const source = horarios[sourceIndex];
    const newSchedule = horarios.map((h: any) => {
      if (h.id === source.id) return h;
      return {
        ...h,
        ativo: source.ativo,
        inicio: source.inicio,
        fim: source.fim,
      };
    });
    setHorarios(newSchedule);
    setUnsavedChanges(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // --- MODAIS ---
  const openCreateRuleModal = () => {
    setModalTarget("rule");
    setModalType("create");
    setEditingItem(
      tipoTaxa === "km"
        ? { min: "", max: "", valor: "" }
        : { nome: "", valor: "" }
    );
    setModalOpen(true);
  };
  const openCreateExceptionModal = () => {
    setModalTarget("exception");
    setModalType("create");
    setEditingItem({ cep: "", valor: "" });
    setModalOpen(true);
  };
  const openCreatePausaModal = () => {
    setModalTarget("pausa");
    setModalType("create");
    setEditingItem({ nome: "", inicio: "", fim: "" });
    setModalOpen(true);
  };
  const openCreateCupomModal = () => {
    setModalTarget("cupom");
    setModalType("create");
    setEditingItem({
      codigo: "",
      tipoDesconto: "porcentagem",
      valor: "",
      minimoCompra: "",
      limiteUso: "",
      validade: "",
      ativo: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: any, target: any) => {
    setModalTarget(target);
    setModalType("edit");
    setEditingItem({ ...item });
    setModalOpen(true);
  };
  const openDeleteModal = (item: any, target: any) => {
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
    if (modalTarget === "exception") {
      const newItem = {
        id: editingItem.id || Date.now(),
        cep: editingItem.cep,
        valor: Number(editingItem.valor),
      };
      if (modalType === "create") setExcecoesCep([...excecoesCep, newItem]);
      else
        setExcecoesCep(
          excecoesCep.map((item: any) =>
            item.id === editingItem.id ? newItem : item
          )
        );
    } else if (modalTarget === "pausa") {
      const newItem = {
        id: editingItem.id || Date.now(),
        nome: editingItem.nome,
        inicio: editingItem.inicio,
        fim: editingItem.fim,
      };
      if (modalType === "create") setPausas([...pausas, newItem]);
      else
        setPausas(
          pausas.map((item: any) =>
            item.id === editingItem.id ? newItem : item
          )
        );
    } else if (modalTarget === "cupom") {
      const newItem = {
        id: editingItem.id || Date.now(),
        codigo: editingItem.codigo,
        tipoDesconto: editingItem.tipoDesconto,
        valor: Number(editingItem.valor),
        minimoCompra: Number(editingItem.minimoCompra),
        limiteUso: Number(editingItem.limiteUso),
        validade: editingItem.validade,
        ativo: editingItem.ativo,
        saldoDisponivel: 0,
      };
      if (modalType === "create") setCupons([...cupons, newItem]);
      else
        setCupons(
          cupons.map((item: any) =>
            item.id === editingItem.id ? newItem : item
          )
        );
    } else {
      if (tipoTaxa === "km") {
        const newItem = {
          id: editingItem.id || Date.now(),
          min: Number(editingItem.min),
          max: Number(editingItem.max),
          valor: Number(editingItem.valor),
        };
        if (modalType === "create") setRegrasKm([...regrasKm, newItem]);
        else
          setRegrasKm(
            regrasKm.map((item: any) =>
              item.id === editingItem.id ? newItem : item
            )
          );
      } else if (tipoTaxa === "bairro") {
        const newItem = {
          id: editingItem.id || Date.now(),
          nome: editingItem.nome,
          valor: Number(editingItem.valor),
        };
        if (modalType === "create") setBairros([...bairros, newItem]);
        else
          setBairros(
            bairros.map((item: any) =>
              item.id === editingItem.id ? newItem : item
            )
          );
      }
    }
    closeModal();
    setUnsavedChanges(true);
  };

  const handleDeleteItem = () => {
    if (modalTarget === "exception")
      setExcecoesCep(
        excecoesCep.filter((item: any) => item.id !== editingItem.id)
      );
    else if (modalTarget === "pausa")
      setPausas(pausas.filter((item: any) => item.id !== editingItem.id));
    else if (modalTarget === "cupom")
      setCupons(cupons.filter((item: any) => item.id !== editingItem.id));
    else if (modalTarget === "schedule") {
      const newHorarios = [...horarios];
      const index = newHorarios.findIndex((h: any) => h.id === editingItem.id);
      if (index >= 0) {
        newHorarios[index].inicio = "";
        newHorarios[index].fim = "";
        newHorarios[index].ativo = false;
        setHorarios(newHorarios);
      }
    } else {
      if (tipoTaxa === "km")
        setRegrasKm(regrasKm.filter((item: any) => item.id !== editingItem.id));
      else if (tipoTaxa === "bairro")
        setBairros(bairros.filter((item: any) => item.id !== editingItem.id));
    }
    closeModal();
    setUnsavedChanges(true);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen pb-24 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Parâmetros do Sistema
          </h1>
          <p className="text-gray-500 text-sm">
            Configure as regras de negócio do seu cardápio digital.
          </p>
        </div>

        {/* NAVEGAÇÃO - Scroll Horizontal no Mobile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="space-y-6 animate-fade-in">
          {/* GERAL */}
          {activeTab === "geral" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaStore className="text-blue-600" /> Visibilidade e Status
                  </h3>
                  <div className="divide-y divide-gray-100">
                    <ToggleSwitch
                      label="Loja Fechada Temporariamente"
                      description="Impede novos pedidos informando que a loja está fechada."
                      checked={lojaFechada}
                      onChange={() => {
                        setLojaFechada(!lojaFechada);
                        setUnsavedChanges(true);
                      }}
                    />
                    <ToggleSwitch
                      label="Ocultar Cardápio Digital"
                      description="O link do cardápio ficará inacessível para os clientes."
                      checked={ocultarCardapio}
                      onChange={() => {
                        setOcultarCardapio(!ocultarCardapio);
                        setUnsavedChanges(true);
                      }}
                    />
                    <ToggleSwitch
                      label="Enviar Pedido para WhatsApp"
                      description="Ao finalizar, o cliente será redirecionado para o WhatsApp."
                      checked={enviarWhatsapp}
                      onChange={() => {
                        setEnviarWhatsapp(!enviarWhatsapp);
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" /> Dados
                    Obrigatórios
                  </h3>
                  <div className="divide-y divide-gray-100">
                    <ToggleSwitch
                      label="Exigir CPF na nota"
                      checked={cpfObrigatorio}
                      onChange={() => {
                        setCpfObrigatorio(!cpfObrigatorio);
                        setUnsavedChanges(true);
                      }}
                    />
                    <ToggleSwitch
                      label="Exigir CEP no cadastro"
                      checked={cepObrigatorio}
                      onChange={() => {
                        setCepObrigatorio(!cepObrigatorio);
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalculator className="text-blue-600" /> Regras de Valores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Valor Mínimo (R$)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">
                          R$
                        </span>
                        <input
                          type="number"
                          value={valorMinimo}
                          onChange={(e) => {
                            setValorMinimo(e.target.value);
                            setUnsavedChanges(true);
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        CEP Padrão
                      </label>
                      <input
                        type="text"
                        value={cepPadrao}
                        onChange={(e) => {
                          setCepPadrao(e.target.value);
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cálculo para produtos com mais de 1 sabor
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <div
                        onClick={() => {
                          setCalculoPreco("media");
                          setUnsavedChanges(true);
                        }}
                        className={`cursor-pointer p-3 border rounded-lg flex items-center gap-3 transition-all ${
                          calculoPreco === "media"
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            calculoPreco === "media"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {calculoPreco === "media" && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-800">
                            Preço Médio
                          </span>
                          <span className="text-xs text-gray-500">
                            Soma dos sabores ÷ qtd
                          </span>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setCalculoPreco("maior");
                          setUnsavedChanges(true);
                        }}
                        className={`cursor-pointer p-3 border rounded-lg flex items-center gap-3 transition-all ${
                          calculoPreco === "maior"
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            calculoPreco === "maior"
                              ? "border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {calculoPreco === "maior" && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-gray-800">
                            Maior Valor
                          </span>
                          <span className="text-xs text-gray-500">
                            Considera o sabor mais caro
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENTREGA */}
          {activeTab === "entrega" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                    Métodos Aceitos
                  </h3>
                  <div className="space-y-3">
                    <SelectionCard
                      icon={<FaMotorcycle />}
                      label="Delivery (Entrega)"
                      checked={metodos.delivery}
                      onChange={() => {
                        setMetodos({ ...metodos, delivery: !metodos.delivery });
                        setUnsavedChanges(true);
                      }}
                    />
                    <SelectionCard
                      icon={<FaStore />}
                      label="Retirar no Local"
                      checked={metodos.retirada}
                      onChange={() => {
                        setMetodos({ ...metodos, retirada: !metodos.retirada });
                        setUnsavedChanges(true);
                      }}
                    />
                    <SelectionCard
                      icon={<FaUtensils />}
                      label="Consumir no Local"
                      checked={metodos.local}
                      onChange={() => {
                        setMetodos({ ...metodos, local: !metodos.local });
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                    Cálculo do Frete
                  </h3>
                  <RadioOption
                    label="Taxa Fixa"
                    description="Valor único para qualquer endereço"
                    selected={tipoTaxa === "fixa"}
                    onClick={() => {
                      setTipoTaxa("fixa");
                      setUnsavedChanges(true);
                    }}
                  />
                  <RadioOption
                    label="Taxa por Bairro"
                    description="Defina valores para bairros específicos"
                    selected={tipoTaxa === "bairro"}
                    onClick={() => {
                      setTipoTaxa("bairro");
                      setUnsavedChanges(true);
                    }}
                  />
                  <RadioOption
                    label="Taxa por KM"
                    description="Calculado via Google Maps"
                    selected={tipoTaxa === "km"}
                    onClick={() => {
                      setTipoTaxa("km");
                      setUnsavedChanges(true);
                    }}
                  />
                  <RadioOption
                    label="Percentual do Pedido"
                    description="Cobrar % sobre o total da compra"
                    selected={tipoTaxa === "percentual"}
                    onClick={() => {
                      setTipoTaxa("percentual");
                      setUnsavedChanges(true);
                    }}
                  />
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Frete Grátis a partir de:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">
                        R$
                      </span>
                      <input
                        type="number"
                        value={freteGratis}
                        onChange={(e) => {
                          setFreteGratis(e.target.value);
                          setUnsavedChanges(true);
                        }}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {tipoTaxa === "km" && (
                          <>
                            <FaMapMarkedAlt className="text-blue-600" /> Tabela
                            por KM
                          </>
                        )}
                        {tipoTaxa === "bairro" && (
                          <>
                            <FaCity className="text-blue-600" /> Tabela de
                            Bairros
                          </>
                        )}
                        {tipoTaxa === "fixa" && (
                          <>
                            <FaMotorcycle className="text-blue-600" /> Taxa
                            Única
                          </>
                        )}
                        {tipoTaxa === "percentual" && (
                          <>
                            <FaPercentage className="text-blue-600" /> Taxa
                            Percentual
                          </>
                        )}
                      </h3>
                    </div>
                    {(tipoTaxa === "km" || tipoTaxa === "bairro") && (
                      <button
                        onClick={openCreateRuleModal}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <FaPlus size={12} /> Adicionar
                      </button>
                    )}
                  </div>

                  {tipoTaxa === "fixa" && (
                    <div className="animate-fade-in space-y-6">
                      <div className="max-w-xs">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Valor da Entrega
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400 font-bold">
                            R$
                          </span>
                          <input
                            type="number"
                            value={valorTaxaFixa}
                            onChange={(e) => {
                              setValorTaxaFixa(e.target.value);
                              setUnsavedChanges(true);
                            }}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-2">
                          Simulação:
                        </h4>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Pedido Exemplo</span>
                          <span>R$ 45,00</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-blue-600 mb-2">
                          <span>+ Taxa</span>
                          <span>R$ {Number(valorTaxaFixa).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-gray-800">
                          <span>Total</span>
                          <span>
                            R$ {(45 + Number(valorTaxaFixa)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {tipoTaxa === "percentual" && (
                    <div className="animate-fade-in space-y-6">
                      <div className="max-w-xs">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Porcentagem
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={percentualTaxa}
                            onChange={(e) => {
                              setPercentualTaxa(e.target.value);
                              setUnsavedChanges(true);
                            }}
                            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <span className="absolute right-4 top-3.5 text-gray-400 font-bold">
                            %
                          </span>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h4 className="text-sm font-bold text-orange-800 mb-2">
                          Simulação (R$ 100,00):
                        </h4>
                        <div className="flex justify-between text-sm font-bold text-orange-600 mb-2">
                          <span>+ Taxa ({percentualTaxa}%)</span>
                          <span>
                            R${" "}
                            {(100 * (Number(percentualTaxa) / 100)).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-gray-800">
                          <span>Total</span>
                          <span>
                            R${" "}
                            {(
                              100 +
                              100 * (Number(percentualTaxa) / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TABELA DE BAIRROS - SCROLL MOBILE */}
                  {tipoTaxa === "bairro" && (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-sm text-left min-w-[500px]">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3">Bairro</th>
                            <th className="px-6 py-3">Valor</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {bairros.map((b: any) => (
                            <tr
                              key={b.id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4">{b.nome}</td>
                              <td className="px-6 py-4 font-bold text-green-600">
                                R$ {b.valor.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 flex justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(b, "rule")}
                                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(b, "rule")}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TABELA KM - SCROLL MOBILE */}
                  {tipoTaxa === "km" && (
                    <div className="animate-fade-in">
                      <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
                        <table className="w-full text-sm text-left min-w-[500px]">
                          <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3">KM Inicial</th>
                              <th className="px-6 py-3">KM Final</th>
                              <th className="px-6 py-3">Valor</th>
                              <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {regrasKm.map((r: any) => (
                              <tr
                                key={r.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="px-6 py-4">{r.min} km</td>
                                <td className="px-6 py-4">{r.max} km</td>
                                <td className="px-6 py-4 font-bold text-green-600">
                                  R$ {r.valor.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(r, "rule")}
                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                  >
                                    <FaEdit size={16} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(r, "rule")}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <FaExclamationTriangle className="text-orange-500" />
                            <h4 className="font-bold text-gray-800">
                              Exceções de CEP
                            </h4>
                          </div>
                          <button
                            onClick={openCreateExceptionModal}
                            className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <FaPlus size={10} /> Cadastrar Exceção
                          </button>
                        </div>
                        {excecoesCep.length > 0 ? (
                          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[400px]">
                              <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-2">CEP</th>
                                  <th className="px-4 py-2">Valor Fixo</th>
                                  <th className="px-4 py-2 text-right">
                                    Ações
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {excecoesCep.map((ex: any) => (
                                  <tr
                                    key={ex.id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                  >
                                    <td className="px-4 py-2 font-mono text-gray-600">
                                      {ex.cep}
                                    </td>
                                    <td className="px-4 py-2 font-bold text-green-600">
                                      R$ {ex.valor.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 flex justify-end gap-2">
                                      <button
                                        onClick={() =>
                                          openEditModal(ex, "exception")
                                        }
                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                      >
                                        <FaEdit size={14} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          openDeleteModal(ex, "exception")
                                        }
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                      >
                                        <FaTrash size={14} />
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

          {/* PAGAMENTO */}
          {activeTab === "pagamento" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-blue-600" /> Habilitar Formas
                    de Pagamento
                  </h3>
                  <div className="space-y-3">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                        Pagamento na Entrega / Retirada
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <PaymentOption
                          label="Cartão de Crédito"
                          subLabel="Maquininha (POS)"
                          checked={pagamento.creditoPos}
                          onChange={() => {
                            setPagamento({
                              ...pagamento,
                              creditoPos: !pagamento.creditoPos,
                            });
                            setUnsavedChanges(true);
                          }}
                        />
                        <PaymentOption
                          label="Cartão de Débito"
                          subLabel="Maquininha (POS)"
                          checked={pagamento.debitoPos}
                          onChange={() => {
                            setPagamento({
                              ...pagamento,
                              debitoPos: !pagamento.debitoPos,
                            });
                            setUnsavedChanges(true);
                          }}
                        />
                        <PaymentOption
                          label="Dinheiro"
                          subLabel="Permite solicitar troco"
                          icon={<FaMoneyBill className="text-green-600" />}
                          checked={pagamento.dinheiro}
                          onChange={() => {
                            setPagamento({
                              ...pagamento,
                              dinheiro: !pagamento.dinheiro,
                            });
                            setUnsavedChanges(true);
                          }}
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 my-4"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                      Pagamento Digital
                    </p>
                    <PaymentOption
                      label="Pagamento Online"
                      subLabel="Cartão de Crédito direto no App"
                      icon={<FaGlobe className="text-blue-500" />}
                      checked={pagamento.onlineCredito}
                      onChange={() => {
                        setPagamento({
                          ...pagamento,
                          onlineCredito: !pagamento.onlineCredito,
                        });
                        setUnsavedChanges(true);
                      }}
                    >
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Gateway Processador
                        </label>
                        <select
                          value={gateways.credito}
                          onChange={(e) => {
                            setGateways({
                              ...gateways,
                              credito: e.target.value,
                            });
                            setUnsavedChanges(true);
                          }}
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
                      icon={<FaQrcode className="text-teal-600" />}
                      checked={pagamento.onlinePix}
                      onChange={() => {
                        setPagamento({
                          ...pagamento,
                          onlinePix: !pagamento.onlinePix,
                        });
                        setUnsavedChanges(true);
                      }}
                    >
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Gateway Pix
                        </label>
                        <select
                          value={gateways.pix}
                          onChange={(e) => {
                            setGateways({ ...gateways, pix: e.target.value });
                            setUnsavedChanges(true);
                          }}
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
                      icon={<FaQrcode className="text-gray-600" />}
                      checked={pagamento.pixEstatico}
                      onChange={() => {
                        setPagamento({
                          ...pagamento,
                          pixEstatico: !pagamento.pixEstatico,
                        });
                        setUnsavedChanges(true);
                      }}
                    >
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Chave PIX
                        </label>
                        <input
                          type="text"
                          value={chavePix}
                          onChange={(e) => {
                            setChavePix(e.target.value);
                            setUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                          placeholder="CNPJ, Email ou Telefone"
                        />
                      </div>
                    </PaymentOption>
                    <PaymentOption
                      label="Vale Refeição"
                      subLabel="Sodexo, Alelo, VR..."
                      icon={<FaTicketAlt className="text-orange-500" />}
                      checked={pagamento.valeRefeicao}
                      onChange={() => {
                        setPagamento({
                          ...pagamento,
                          valeRefeicao: !pagamento.valeRefeicao,
                        });
                        setUnsavedChanges(true);
                      }}
                    >
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          Bandeiras Aceitas
                        </label>
                        <textarea
                          rows={2}
                          value={bandeirasVale}
                          onChange={(e) => {
                            setBandeirasVale(e.target.value);
                            setUnsavedChanges(true);
                          }}
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
                      <h4 className="font-bold text-blue-900 text-sm mb-1">
                        Como funciona o Pix?
                      </h4>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        <strong>Pix Online:</strong> O cliente paga e o sistema
                        aprova o pedido automaticamente na hora. Requer conta em
                        Gateway.
                        <br />
                        <br />
                        <strong>Pix Estático:</strong> O cliente faz a
                        transferência e precisa enviar o comprovante via
                        WhatsApp para você aprovar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HORÁRIOS - Ajustado Mobile */}
          {activeTab === "horario" && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaRegClock className="text-blue-600" /> Funcionamento e
                      Fusos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Defina os horários de abertura e fechamento para cada dia
                      da semana.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <FaGlobe className="text-gray-400" />
                    <select
                      value={fusoHorario}
                      onChange={(e) => {
                        setFusoHorario(e.target.value);
                        setUnsavedChanges(true);
                      }}
                      className="bg-transparent text-sm text-gray-700 font-medium outline-none cursor-pointer"
                    >
                      <option value="America/Sao_Paulo">
                        Brasília (GMT-03:00)
                      </option>
                      <option value="America/Manaus">Manaus (GMT-04:00)</option>
                      <option value="America/Noronha">
                        Fernando de Noronha (GMT-02:00)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  {horarios.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 rounded-xl transition-all ${
                        item.ativo
                          ? "bg-white border border-gray-200 shadow-sm"
                          : "bg-gray-50 border border-gray-100 opacity-70"
                      }`}
                    >
                      <div className="md:col-span-4 flex items-center justify-between">
                        <span
                          className={`font-semibold ${
                            item.ativo ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {item.dia}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.ativo}
                            onChange={() => {
                              const newHorarios = [...horarios];
                              newHorarios[index].ativo =
                                !newHorarios[index].ativo;
                              setHorarios(newHorarios);
                              setUnsavedChanges(true);
                            }}
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
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
                          <FaTimes className="mr-2 text-red-300" /> Fechado
                          neste dia
                        </div>
                      )}
                      <div className="md:col-span-2 flex justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                        {item.ativo && (
                          <button
                            onClick={() => openDeleteModal(item, "schedule")}
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
                            <FaCopy size={14} />{" "}
                            <span className="inline">Replicar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAUSAS */}
          {activeTab === "pausa" && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaCoffee className="text-orange-500" /> Pausas e Feriados
                    </h3>
                    <p className="text-sm text-gray-500">
                      Programe fechamentos temporários, férias coletivas ou
                      feriados.
                    </p>
                  </div>
                  <button
                    onClick={openCreatePausaModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FaPlus size={12} /> Adicionar Pausa
                  </button>
                </div>
                {pausas.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left min-w-[600px]">
                      <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3">Motivo / Nome</th>
                          <th className="px-6 py-3">Início</th>
                          <th className="px-6 py-3">Fim</th>
                          <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pausas.map((pausa: any) => (
                          <tr
                            key={pausa.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {pausa.nome}
                            </td>
                            <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" />{" "}
                              {formatDate(pausa.inicio)}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {formatDate(pausa.fim)}
                            </td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(pausa, "pausa")}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(pausa, "pausa")}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <FaTrash size={16} />
                              </button>
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
                    <h4 className="text-gray-800 font-medium">
                      Nenhuma pausa programada
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Sua loja funcionará normalmente conforme os horários
                      definidos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUPONS */}
          {activeTab === "cupom" && (
            <div className="grid grid-cols-1 gap-6 animate-fade-in">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaTicketAlt className="text-blue-600" /> Cupons de
                      Desconto
                    </h3>
                    <p className="text-sm text-gray-500">
                      Crie códigos promocionais para seus clientes.
                    </p>
                  </div>
                  <button
                    onClick={openCreateCupomModal}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <FaPlus size={12} /> Adicionar
                  </button>
                </div>
                {cupons.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left min-w-[900px]">
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
                        {cupons.map((cupom: any) => (
                          <tr
                            key={cupom.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="px-4 py-4 font-mono font-bold text-gray-700">
                              {cupom.codigo}
                            </td>
                            <td className="px-4 py-4 text-green-600 font-bold">
                              {cupom.tipoDesconto === "porcentagem"
                                ? `${cupom.valor}%`
                                : formatCurrency(cupom.valor)}
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
                              {cupom.saldoDisponivel || 0}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  cupom.ativo
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {cupom.ativo ? "Sim" : "Não"}
                              </span>
                            </td>
                            <td className="px-4 py-4 flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(cupom, "cupom")}
                                className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(cupom, "cupom")}
                                className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <FaTrash size={16} />
                              </button>
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
                    <h4 className="text-gray-800 font-medium">
                      Nenhum cupom ativo
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Crie campanhas de desconto para atrair mais clientes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FIDELIDADE - CASHBACK */}
          {activeTab === "fidelidade" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><FaWallet className="text-green-600" /> Cashback Próprio</h3>
                            <p className="text-sm text-gray-500">O cliente ganha uma porcentagem do valor gasto como saldo para a próxima compra.</p>
                        </div>
                        <label className="flex items-center cursor-pointer bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <span className="mr-3 text-sm font-medium text-gray-700">{fidAtivo ? 'Habilitado' : 'Desabilitado'}</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={fidAtivo} onChange={() => {setFidAtivo(!fidAtivo); setUnsavedChanges(true)}} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </div>
                        </label>
                    </div>

                    <div className={`space-y-6 transition-opacity ${!fidAtivo ? 'opacity-50 pointer-events-none' : ''}`}>
                        
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-start gap-3">
                            <FaInfoCircle className="text-green-600 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-bold text-green-900 text-sm">Como funciona?</h4>
                                <p className="text-xs text-green-800 mt-1">
                                    O cashback devolve dinheiro real (crédito) na carteira do cliente dentro do seu Cardápio Digital. 
                                    Se você configurar <strong>10%</strong>, num pedido de R$ 100,00 o cliente ganha <strong>R$ 10,00</strong> de saldo.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Porcentagem de Cashback</label>
                                <p className="text-xs text-gray-500 mb-2">Quanto do pedido volta para o cliente?</p>
                                <div className="relative">
                                    <input type="number" step="1" max="100" value={fidPorcentagem} onChange={(e) => {setFidPorcentagem(e.target.value); setUnsavedChanges(true)}} className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg text-gray-800" placeholder="10" />
                                    <span className="absolute right-4 top-3.5 text-gray-500 font-bold">%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Validade do Saldo</label>
                                <p className="text-xs text-gray-500 mb-2">Em quantos dias o saldo expira?</p>
                                <div className="relative">
                                    <input type="number" value={fidValidade} onChange={(e) => {setFidValidade(e.target.value); setUnsavedChanges(true)}} className="w-full pr-14 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-lg text-gray-800" placeholder="30" />
                                    <span className="absolute right-4 top-4 text-xs font-bold text-gray-400 uppercase">DIAS</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase">Regras de Utilização</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Saldo Mínimo para usar</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">R$</span>
                                        <input type="number" value={fidMinimo} onChange={(e) => {setFidMinimo(e.target.value); setUnsavedChanges(true)}} className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">O cliente precisa acumular esse valor para poder abater na compra.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Limite de uso por pedido (%)</label>
                                    <div className="relative">
                                        <input type="number" max="100" value={fidMaximoUso} onChange={(e) => {setFidMaximoUso(e.target.value); setUnsavedChanges(true)}} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                        <span className="absolute right-3 top-2.5 text-gray-400 font-bold text-sm">%</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Ex: Se 50%, o cliente só pode pagar metade do pedido com saldo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 p-6 rounded-xl lg:sticky lg:top-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FaCalculator className="text-gray-400" /> Simulação</h4>
                    <div className="space-y-4 text-sm">
                        <div className="pb-3 border-b border-gray-100">
                            <p className="text-gray-500 mb-1">Se o cliente gastar:</p>
                            <span className="text-2xl font-bold text-gray-800">R$ 100,00</span>
                        </div>
                        <div className="pb-3 border-b border-gray-100">
                            <p className="text-gray-500 mb-1">Ele recebe de volta:</p>
                            <span className="text-3xl font-bold text-green-600">R$ {((100 * Number(fidPorcentagem)) / 100).toFixed(2)}</span>
                            <div className="text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded mt-1 font-semibold">{fidPorcentagem}% de Cashback</div>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-2 text-xs">Na próxima compra, ele poderá usar este saldo como desconto direto no carrinho.</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRAÇÃO MERCADO LIVRE */}
          {activeTab === "integracao" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {/* COLUNA 1: CREDENCIAIS E STATUS */}
              <div className="space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-yellow-500 bg-blue-900 p-1.5 rounded-full shrink-0">
                      <FaHandshake size={14} />
                    </span>
                    Mercado Livre
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Conecte sua conta para sincronizar estoque e receber pedidos
                    automaticamente.
                  </p>

                  <div
                    className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      mlStatusConexao === "conectado"
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          mlStatusConexao === "conectado"
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <div>
                        <span className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                          {mlStatusConexao === "conectado"
                            ? "Conectado"
                            : "Desconectado"}
                        </span>
                        {mlStatusConexao === "conectado" && (
                          <span className="text-xs text-green-700">
                            Sincronizando dados
                          </span>
                        )}
                      </div>
                    </div>
                    {mlStatusConexao === "conectado" && (
                      <button
                        onClick={() => {
                          setMlStatusConexao("desconectado");
                          setMlAtivo(false);
                          setUnsavedChanges(true);
                        }}
                        className="text-xs text-red-600 hover:underline font-semibold cursor-pointer ml-auto sm:ml-0"
                      >
                        Desconectar
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        App ID
                      </label>
                      <input
                        type="text"
                        value={mlAppId}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMlAppId(val);
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all"
                        placeholder="Ex: 123456789"
                        disabled={mlStatusConexao === "conectado"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        value={mlSecretKey}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMlSecretKey(val);
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all"
                        placeholder="••••••••••••••••"
                        disabled={mlStatusConexao === "conectado"}
                      />
                    </div>

                    {mlStatusConexao !== "conectado" && (
                      <button
                        onClick={handleConnectML}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                      >
                        <FaLink /> Conectar Conta
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* COLUNA 2: REGRAS DE SINCRONIZAÇÃO */}
              <div className="space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 h-full relative">
                  {mlStatusConexao !== "conectado" && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 mx-4">
                        <FaPlug className="text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-500 text-center">
                          Conecte sua conta para configurar
                        </span>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaSync className="text-blue-600" /> Regras de Sincronização
                  </h3>

                  <div className="divide-y divide-gray-100">
                    <ToggleSwitch
                      label="Sincronizar Estoque"
                      description="Atualiza o saldo no ML quando houver venda no sistema."
                      checked={mlSyncEstoque}
                      onChange={() => {
                        setMlSyncEstoque(!mlSyncEstoque);
                        setUnsavedChanges(true);
                      }}
                    />

                    <ToggleSwitch
                      label="Sincronizar Preços"
                      description="Atualiza o preço no ML conforme tabela do sistema."
                      checked={mlSyncPreco}
                      onChange={() => {
                        setMlSyncPreco(!mlSyncPreco);
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>

                  {mlSyncPreco && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Ajuste de Preço (%)
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Acrescente um percentual ao preço para cobrir taxas do
                        marketplace.
                      </p>
                      <div className="relative">
                        <input
                          type="number"
                          value={mlFatorPreco}
                          onChange={(e) => {
                            setMlFatorPreco(e.target.value);
                            setUnsavedChanges(true);
                          }}
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 font-bold text-gray-800"
                        />
                        <span className="absolute right-4 top-2.5 text-gray-500 font-bold">
                          %
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaShoppingBag className="text-blue-600" /> Importação de
                      Pedidos
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">
                      Pedidos novos do Mercado Livre serão importados
                      automaticamente com status "Pendente".
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100">
                      <FaCheckCircle /> Webhook Ativo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BARRA DE SALVAR FLUTUANTE */}
      {unsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] animate-fade-in">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-end items-center gap-3 md:gap-4">
            <span className="text-sm text-gray-500 hidden md:inline">
              Você tem alterações não salvas
            </span>
            <div className="flex w-full md:w-auto gap-3">
              <button
                onClick={() => setUnsavedChanges(false)}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 md:border-transparent"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="flex-1 md:flex-none flex justify-center items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  "Salvando..."
                ) : (
                  <>
                    <FaSave /> Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sucesso!</h3>
            <p className="text-gray-500 text-sm">
              As configurações foram salvas corretamente!
            </p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE AVISO ML */}
      {showMlWarningModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95 border-t-4 border-yellow-500">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <FaExclamationTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Campos Obrigatórios
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Para realizar a integração, você precisa preencher o{" "}
              <strong>App ID</strong> e o <strong>Secret Key</strong> do Mercado
              Livre.
            </p>
            <button
              type="button"
              onClick={() => setShowMlWarningModal(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Voltar e Preencher
            </button>
          </div>
        </div>
      )}

      {/* MODAL UNIVERSAL (EDITAR/CRIAR/DELETAR) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          {modalType === "delete" ? (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <FaExclamationTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {modalTarget === "schedule"
                    ? "Limpar Horário?"
                    : "Excluir Item?"}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {modalTarget === "schedule"
                    ? "Deseja remover os horários definidos para este dia? Ele será marcado como fechado."
                    : "Tem certeza que deseja remover este item? Esta ação não pode ser desfeita."}
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteItem}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 cursor-pointer"
                  >
                    {modalTarget === "schedule"
                      ? "Sim, Limpar"
                      : "Sim, Excluir"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  {modalType === "create" ? (
                    <FaPlus className="text-blue-600" />
                  ) : (
                    <FaEdit className="text-blue-600" />
                  )}{" "}
                  {modalType === "create" ? "Adicionar" : "Editar"}{" "}
                  {modalTarget === "exception"
                    ? "Exceção de CEP"
                    : modalTarget === "pausa"
                    ? "Pausa / Feriado"
                    : modalTarget === "cupom"
                    ? "Cupom"
                    : "Regra"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                {modalTarget === "exception" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={editingItem?.cep}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, cep: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="00000-000"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Digite o CEP com ou sem traço.
                    </p>
                  </div>
                )}

                {/* Ajustado para Mobile: Stack no mobile, Grid no Desktop */}
                {modalTarget === "pausa" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Nome do Evento
                      </label>
                      <input
                        type="text"
                        value={editingItem?.nome}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            nome: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ex: Férias Coletivas"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Início
                        </label>
                        <input
                          type="datetime-local"
                          value={editingItem?.inicio}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              inicio: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Fim
                        </label>
                        <input
                          type="datetime-local"
                          value={editingItem?.fim}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              fim: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Ajustado para Mobile: Stack no mobile, Grid no Desktop */}
                {modalTarget === "cupom" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Código do Cupom
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={editingItem?.codigo}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                codigo: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full pl-8 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 uppercase"
                            placeholder="PROMOCAO10"
                          />
                          <FaTag
                            className="absolute left-3 top-3 text-gray-400"
                            size={12}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Tipo de Desconto
                        </label>
                        <select
                          value={editingItem?.tipoDesconto}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              tipoDesconto: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                          <option value="porcentagem">Porcentagem (%)</option>
                          <option value="fixo">Valor Fixo (R$)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Valor do Desconto
                        </label>
                        <input
                          type="number"
                          value={editingItem?.valor}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              valor: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Mínimo Compra (R$)
                        </label>
                        <input
                          type="number"
                          value={editingItem?.minimoCompra}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              minimoCompra: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Limite de Uso
                        </label>
                        <input
                          type="number"
                          value={editingItem?.limiteUso}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              limiteUso: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Ex: 100"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                          Prazo de Expiração
                        </label>
                        <input
                          type="datetime-local"
                          value={editingItem?.validade}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              validade: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between pt-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Cupom Ativo?
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={editingItem?.ativo}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                ativo: e.target.checked,
                              })
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {modalTarget === "rule" && tipoTaxa === "km" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        KM Inicial
                      </label>
                      <input
                        type="number"
                        value={editingItem?.min}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            min: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        KM Final
                      </label>
                      <input
                        type="number"
                        value={editingItem?.max}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            max: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="5"
                      />
                    </div>
                  </div>
                )}
                {modalTarget === "rule" && tipoTaxa === "bairro" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Nome do Bairro
                    </label>
                    <input
                      type="text"
                      value={editingItem?.nome}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, nome: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: Centro"
                    />
                  </div>
                )}
                {modalTarget !== "pausa" && modalTarget !== "cupom" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Valor {modalTarget === "exception" ? "Fixo" : "da Taxa"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400 font-bold text-sm">
                        R$
                      </span>
                      <input
                        type="number"
                        value={editingItem?.valor}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            valor: e.target.value,
                          })
                        }
                        className="w-full pl-9 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
