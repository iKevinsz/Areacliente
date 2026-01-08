"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Check,
  X,
  Zap,
  BarChart3,
  Layers,
  CreditCard,
  Loader2,
  QrCode,
  Lock,
  Shield,
  HelpCircle,
  Trophy,
  AlertCircle,
  Barcode,
  Calendar,
  ImageIcon,
  Maximize2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MdPointOfSale } from "react-icons/md";

// --- CONFIGURAÇÃO DOS CICLOS ---
const CYCLES = {
  monthly: { label: "Mensal", months: 1 },
  quarterly: { label: "Trimestral", months: 3 },
  semiannual: { label: "Semestral", months: 6 },
  yearly: { label: "Anual", months: 12 },
  biennial: { label: "Bienal", months: 24 },
};

// --- DADOS DOS PRODUTOS ---
const PRODUCTS = [
  {
    id: "pdv",
    name: "Sistema PDV",
    description: "Frente de caixa ágil e robusta para o dia a dia.",
    icon: MdPointOfSale,
    images: [
      "/img/pdv.jpg",
      "/img/mesa.jpg",
      "/img/monitor-de-preparo-para-cozinha.png",
      "/img/novo-comanda.png",
    ],
    features: [
      "Emissor de NFC-e Modelo 65",
      "Cardápio Digital",
      "App Comanda Mobile",
      "Monitor de Preparo de Pedidos",
      "Dashboard Online",
      "Gestão de Delivery e Pedidos",
      "Integração com iFood e Mercado Pago",
      "Integração com TEF PayGo",
      "Gráficos e Relatórios Gerenciais",
      "Sem Limite de Usuários e Dispositivos",
      "Backup em Nuvem",
      "Atendimento 7 Dias por Semana",
    ],
    notIncluded: ["Emissão de NF-e (Modelo 55)", "Gestão Financeira Completa"],
    highlight: false,
    prices: {
      monthly: null,
      quarterly: { total: 239.0, discountLabel: "10% OFF" },
      semiannual: { total: 449.0, discountLabel: "15% OFF" },
      yearly: { total: 749.0, discountLabel: "30% OFF" },
      biennial: { total: 1249.0, discountLabel: "40% OFF" },
    },
  },
  {
    id: "gestao",
    name: "Sistema Gestão",
    description: "Controle total da sua empresa, do estoque ao financeiro.",
    icon: BarChart3,
    images: [
      "/img/nota-fiscal-eletronica.jpg",
      "/img/balanco-mensal-1.jpg",
      "/img/Baixar-XML-Atual-com-o-Manifesto-Tela.jpg",
    ],
    features: [
      "Emissor de NF-e Modelo 55",
      "Emissor de NFS-e e Boletos",
      "Gestão de Compras e Vendas",
      "Gestão Financeira Completa",
      "Gestão de Estoque e Orçamentos",
      "Faturamento de Contratos",
      "Contas a Pagar e Receber",
      "Gráficos e Relatórios Gerenciais",
      "Sem Limite de Usuários",
      "Sem Limite de Computadores",
      "Backup em Nuvem",
      "Atendimento 7 Dias por Semana",
    ],
    notIncluded: ["Frente de Caixa (PDV)", "Cardápio Digital"],
    highlight: false,
    prices: {
      monthly: null,
      quarterly: { total: 319.0, discountLabel: "10% OFF" },
      semiannual: { total: 569.0, discountLabel: "20% OFF" },
      yearly: { total: 999.0, discountLabel: "30% OFF" },
      biennial: { total: 1699.0, discountLabel: "40% OFF" },
    },
  },
  {
    id: "combo",
    name: "Datacaixa PDV + Gestão",
    description: "A potência máxima: PDV + Gestão integrados.",
    icon: Layers,
    images: ["/img/kit-pdv-e-gestao.png"],
    features: [
      "Venda Balcão, Mesas, Comandas, Pedidos e Delivery",
      "Cardápio Digital",
      "Aplicativo Datacaixa Garçom para Android e iOS",
      "Monitor de Pedidos para Cozinha (KDS)",
      "Gestão de Compras, Vendas, Estoque e Financeiro",
      "Emissor de Nota Fiscal de Consumidor Eletrônica (NFC-e)",
      "Emissor de Nota Fiscal Eletrônica (NF-e)",
      "Emissor de Nota Fiscal de Serviços Eletrônica (NFS-e)",
      "E muito mais!",
    ],
    notIncluded: [],
    highlight: true,
    prices: {
      monthly: { total: 129.0, discountLabel: "" },
      quarterly: { total: 369.0, discountLabel: "Economia" },
      semiannual: { total: 699.0, discountLabel: "Economia" },
      yearly: { total: 1099.0, discountLabel: "Super Oferta" },
      biennial: { total: 1799.0, discountLabel: "Max. Desconto" },
    },
  },
];

// --- COMPONENTE CARROSSEL ATUALIZADO ---

const ProductCarousel = ({
  images,
  onExpand,
}: {
  images: string[];
  onExpand: (imgs: string[], idx: number) => void;
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  return (
    <div
      className="relative w-full h-56 bg-gray-100 group cursor-zoom-in"
      onClick={() => onExpand(images, current)}
    >
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />

          <div className="hidden absolute inset-0 bg-slate-200 flex flex-col items-center justify-center text-slate-400">
            <ImageIcon size={40} className="mb-2 opacity-50" />
            <span className="text-[10px] font-bold uppercase">
              Imagem não encontrada
            </span>
          </div>
        </div>
      ))}

      {/* Indicador de Expandir (Hover) */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
          <Maximize2 size={12} /> Ampliar
        </div>
      </div>

      {/* Indicadores (Bolinhas) */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${
                idx === current ? "bg-white w-3" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE LIGHTBOX (Visualização Expandida com Navegação) ---
const ImageLightbox = ({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Navegar para próxima
  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % images.length);
    },
    [images.length]
  );

  // Navegar para anterior
  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [images.length]
  );

  // Suporte a Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Botão Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
      >
        <XCircle size={40} />
      </button>

      {/* Botão Anterior (Só mostra se tiver > 1 imagem) */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 group"
        >
          <ChevronLeft
            size={32}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
      )}

      {/* Área da Imagem */}
      <div
        className="relative max-w-7xl w-full h-full p-4 md:p-10 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Fullscreen view ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
        />

        {/* Contador de Imagens */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Botão Próximo (Só mostra se tiver > 1 imagem) */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 group"
        >
          <ChevronRight
            size={32}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      )}
    </div>
  );
};

export default function LicencasPage() {
  const [selectedCycle, setSelectedCycle] =
    useState<keyof typeof CYCLES>("yearly");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Estado modificado para guardar array de imagens e o index inicial
  const [lightboxState, setLightboxState] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const handleSelectPlan = (product: any, priceData: any) => {
    setSelectedPlan({
      ...product,
      priceData,
      cycle: CYCLES[selectedCycle],
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Lightbox Global */}
      {lightboxState && (
        <ImageLightbox
          images={lightboxState.images}
          initialIndex={lightboxState.index}
          onClose={() => setLightboxState(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Escolha o plano ideal para seu negócio!
          </h1>
          <p>Instalação e configuração inclusas em todos os planos</p>
          <p className="text-slate-500 font-black text-lg">
            Tudo em até 12x SEM JUROS no Cartão de Crédito, ou à vista no Pix ou
            Boleto Bancário.
          </p>
        </div>

        {/* SELETOR DE CICLOS */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex flex-wrap justify-center gap-1">
            {Object.entries(CYCLES).map(([key, cycle]) => {
              const isSelected = selectedCycle === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCycle(key as keyof typeof CYCLES)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-transparent
                    ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                >
                  {cycle.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GRIDS DE PRODUTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {PRODUCTS.map((product) => {
            const priceData = product.prices[selectedCycle];
            const isAvailable = !!priceData;

            return (
              <div
                key={product.id}
                className={`relative bg-white rounded-3xl transition-all duration-300 flex flex-col h-full border overflow-hidden group/card
                  ${
                    product.highlight
                      ? "border-blue-600 shadow-2xl scale-100 lg:scale-105 z-10"
                      : "border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white"
                  }
                  ${!isAvailable ? "opacity-70 grayscale-[0.5]" : ""}
                `}
              >
                {/* CARROSSEL DE IMAGENS */}
                <ProductCarousel
                  images={product.images}
                  onExpand={(imgs, idx) =>
                    setLightboxState({ images: imgs, index: idx })
                  }
                />

                {product.highlight && isAvailable && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-20 pointer-events-none">
                    <Trophy size={10} className="text-yellow-300" /> Recomendado
                  </div>
                )}

                <div className="p-6 pb-0 flex-1">
                  {/* Cabeçalho */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 rounded-xl ${
                        product.highlight
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <product.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">
                        {product.name}
                      </h3>
                      {isAvailable && priceData.discountLabel && (
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                          {priceData.discountLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="mb-6 pb-6 border-b border-slate-100 min-h-[100px] flex flex-col justify-center">
                    {isAvailable ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-slate-400">
                            R$
                          </span>
                          <span className="text-4xl font-black text-slate-900">
                            {(
                              priceData.total / CYCLES[selectedCycle].months
                            ).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-slate-400 font-bold text-xs">
                            /mês
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-slate-500 font-medium">
                            Total:{" "}
                            <strong>
                              R${" "}
                              {priceData.total.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </strong>
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <AlertCircle className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs font-bold text-slate-600">
                          Plano Indisponível
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lista de Features */}
                  <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {product.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 min-w-[16px] rounded-full p-0.5 ${
                            product.highlight
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {product.notIncluded.map((feature: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 opacity-40"
                      >
                        <div className="mt-0.5 min-w-[16px]">
                          <X className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-xs text-slate-500">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 pt-0 mt-auto">
                  <button
                    onClick={() =>
                      isAvailable && handleSelectPlan(product, priceData)
                    }
                    disabled={!isAvailable}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                      ${
                        !isAvailable
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                          : product.highlight
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer"
                          : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200 cursor-pointer"
                      }`}
                  >
                    {isAvailable ? "Contratar Agora" : "Indisponível"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* GARANTIA */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-full text-green-600">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Garantia Incondicional de 7 Dias
              </h3>
              <p className="text-slate-500 text-sm">
                Teste qualquer sistema sem riscos.
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2">
              <Lock size={14} /> Pagamento Seguro
            </span>
            <span className="flex items-center gap-2">
              <HelpCircle size={14} /> Suporte Incluso
            </span>
          </div>
        </div>
      </div>

      {/* --- MODAL DE CHECKOUT --- */}
      {isCheckoutOpen && selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}

// --- SUBCOMPONENTE: MODAL DE CHECKOUT (MINI CARRINHO) ---
function CheckoutModal({ plan, onClose }: any) {
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "pix" | "boleto"
  >("credit_card");
  const [installments, setInstallments] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"payment" | "success">("payment");

  const totalPrice = plan.priceData.total;

  const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 2000);
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white -z-10"></div>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Check className="w-10 h-10 text-green-600 stroke-[3]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Pedido Confirmado!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm">
            A licença <strong>{plan.name}</strong> foi ativada. Um e-mail de
            confirmação foi enviado.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            Acessar Sistema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
        {/* Lado Esquerdo: Resumo do Carrinho */}
        <div className="bg-slate-50 p-8 md:w-5/12 border-r border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-slate-400">
            <AlertCircle size={16} />
            <span className="text-xs font-black uppercase tracking-widest">
              Resumo da Compra
            </span>
          </div>

          <div className="flex-1 space-y-6">
            {/* Item do Carrinho */}
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit">
                <plan.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">
                  {plan.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Plano {plan.cycle.label}
                </p>
                <div className="mt-2 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded w-fit">
                  {plan.priceData.discountLabel
                    ? `${plan.priceData.discountLabel} Aplicado`
                    : "Melhor Preço"}
                </div>
              </div>
            </div>

            {/* Detalhes de Pagamento */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Valor do Plano</span>
                <span>
                  R${" "}
                  {totalPrice.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Taxas</span>
                <span>R$ 0,00</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                <span className="font-black text-slate-900 text-lg">Total</span>
                <div className="text-right">
                  <span className="block font-black text-blue-600 text-xl">
                    R${" "}
                    {totalPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  {paymentMethod === "credit_card" && installments > 1 && (
                    <span className="text-xs text-slate-400 font-medium">
                      em {installments}x de R${" "}
                      {(totalPrice / installments).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-[10px] text-slate-400 text-center">
            <p>Renovação automática ao final do período.</p>
            <p>Cancele quando quiser no painel.</p>
          </div>
        </div>

        {/* Lado Direito: Checkout */}
        <div className="p-8 md:w-7/12 bg-white overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Como você quer pagar?
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setPaymentMethod("credit_card")}
              className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all font-bold text-xs cursor-pointer ${
                paymentMethod === "credit_card"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-100 hover:border-slate-200 text-slate-500"
              }`}
            >
              <CreditCard size={20} /> Cartão
            </button>
            <button
              onClick={() => setPaymentMethod("pix")}
              className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all font-bold text-xs cursor-pointer ${
                paymentMethod === "pix"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-slate-100 hover:border-slate-200 text-slate-500"
              }`}
            >
              <QrCode size={20} /> PIX
            </button>
            <button
              onClick={() => setPaymentMethod("boleto")}
              className={`py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all font-bold text-xs cursor-pointer ${
                paymentMethod === "boleto"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-100 hover:border-slate-200 text-slate-500"
              }`}
            >
              <Barcode size={20} /> Boleto
            </button>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Parcelamento
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white cursor-pointer"
                >
                  {installmentOptions.map((i) => (
                    <option key={i} value={i}>
                      {i}x de R${" "}
                      {(totalPrice / i).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      sem juros
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Número do Cartão
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                  <CreditCard className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Validade
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    />
                    <Calendar className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    />
                    <Lock className="absolute right-3 top-3.5 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  placeholder="Como impresso no cartão"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {paymentMethod === "pix" && (
            <div className="flex flex-col items-center justify-center py-6 animate-in fade-in text-center bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
                <QrCode size={140} className="text-slate-800" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Pagamento Instantâneo
              </p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Abra o app do seu banco e escaneie o QR Code. A liberação é
                imediata.
              </p>
            </div>
          )}

          {paymentMethod === "boleto" && (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in text-center bg-slate-50 rounded-2xl border border-slate-100">
              <Barcode size={64} className="text-slate-400 mb-4" />
              <p className="text-sm font-bold text-slate-800">
                Pagamento via Boleto
              </p>
              <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
                A liberação ocorre em até 1 dia útil após o pagamento.
              </p>
              <button className="text-xs font-bold text-blue-600 hover:underline">
                Gerar Boleto PDF
              </button>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Lock size={18} />
            )}
            {isProcessing
              ? "Processando..."
              : `Pagar R$ ${totalPrice.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`}
          </button>

          <p className="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
            <Shield size={10} /> Compra 100% Segura
          </p>
        </div>
      </div>
    </div>
  );
}
