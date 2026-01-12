"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ShoppingBag,
  Truck,
  Share2,
  Save,
  Upload,
  User,
  LayoutGrid,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  CheckCircle,
  Loader2,
  X,
  Copy,
  ExternalLink,
  Check,
  Plus,
  ImageIcon,
} from "lucide-react";

import { updateEmpresaSettings } from "@/app/actions/empresa";

// --- Constantes ---
const ESTADOS_BRASILEIROS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
const FUSOS_HORARIOS = [
  { value: "Sao_Paulo", label: "São Paulo / Brasília (GMT-3)" },
  { value: "Manaus", label: "Manaus / Amazonas (GMT-4)" },
  { value: "Rio_Branco", label: "Rio Branco / Acre (GMT-5)" },
  { value: "Fernando_de_Noronha", label: "Fernando de Noronha (GMT-2)" },
];

// --- Schema ---
const empresaSchema = z.object({
  cnpj: z.string().min(11, "Documento incompleto"),
  razaoSocial: z.string().min(1, "Razão Social obrigatória"),
  nomeFantasia: z.string().min(1, "Nome Fantasia obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  endereco: z.string().min(1, "Endereço obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  bairro: z.string().min(1, "Bairro obrigatório"),
  uf: z.string().min(2, "UF obrigatória"),
  cidade: z.string().min(1, "Cidade obrigatória"),
  ie: z.string().nullable().optional().or(z.literal("")),
  im: z.string().nullable().optional().or(z.literal("")),
  segmento: z.string().nullable().optional().or(z.literal("")),
  complemento: z.string().nullable().optional().or(z.literal("")),
  telefone: z.string().nullable().optional().or(z.literal("")),
  telefoneComercial: z.string().nullable().optional().or(z.literal("")),
  celular: z.string().nullable().optional().or(z.literal("")),
  contato: z.string().nullable().optional().or(z.literal("")),
  email: z
    .string()
    .email("E-mail inválido")
    .nullable()
    .optional()
    .or(z.literal("")),
  site: z.string().nullable().optional().or(z.literal("")),
  fusoHorario: z.string().nullable().optional().default("Sao_Paulo"),
  categorias: z.string().nullable().optional().or(z.literal("")),
  tempoEstimado: z.preprocess(
    (val) => (val === null ? "" : String(val)),
    z.string().optional()
  ),
  tempoEntrega: z.preprocess(
    (val) => (val === null ? "" : String(val)),
    z.string().optional()
  ),
  linkLoja: z.string().nullable().optional().or(z.literal("")),
  whatsapp: z.string().nullable().optional().or(z.literal("")),
  facebook: z.string().nullable().optional().or(z.literal("")),
  instagram: z.string().nullable().optional().or(z.literal("")),
  youtube: z.string().nullable().optional().or(z.literal("")),
  twitter: z.string().nullable().optional().or(z.literal("")),
});

// --- Utils ---
export const normalizeCep = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
export const normalizeDocumento = (v: string) => {
  const r = v.replace(/\D/g, "");
  return r.length <= 11
    ? r.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    : r.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};
export const normalizePhone = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 14);
export const normalizeCelular = (v: string) =>
  v
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);

// --- Componentes ---

const Label = ({ icon: Icon, children, htmlFor }: any) => (
  <label
    htmlFor={htmlFor}
    className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1"
  >
    {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
    {children}
  </label>
);

const Card = ({ title, icon: Icon, children, className }: any) => (
  <div
    className={`bg-[#F8FAFC] rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    <div className="px-6 py-5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
          {title}
        </h2>
      </div>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </div>
);

const Input = ({ name, mask, className, isLoading, ...props }: any) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className="w-full relative">
      <input
        {...register(name, {
          onChange: (e) => {
            let val = e.target.value;
            if (mask === "cep") val = normalizeCep(val);
            if (mask === "documento") val = normalizeDocumento(val);
            if (mask === "phone") val = normalizePhone(val);
            if (mask === "celular") val = normalizeCelular(val);
            setValue(name, val);
          },
        })}
        {...props}
        className={`w-full h-11 rounded-xl border ${
          error ? "border-red-500" : "border-gray-200"
        } bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500 placeholder:text-gray-300 ${className}`}
      />
      {isLoading && (
        <div className="absolute right-3 top-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      )}
      {error && (
        <span className="text-[10px] text-red-500 font-bold mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---

export default function EmpresaSettingsPage({
  empresaInicial,
}: {
  empresaInicial: any;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    empresaInicial?.logo || null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isCopied, setIsCopied] = useState(false);
  const [showExtraSocials, setShowExtraSocials] = useState(
    !!empresaInicial?.youtube || !!empresaInicial?.twitter
  );

  const methods = useForm({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresaInicial,
  });

  const { setValue, watch, handleSubmit, setFocus, setError, clearErrors } = methods;
  const cepValue = watch("cep");

  // CEP Logic
 useEffect(() => {
    const cleanCep = cepValue?.replace(/\D/g, "");
    if (cleanCep?.length === 8) {
      setIsSearchingCep(true);
      // Limpa erros anteriores de CEP se o usuário estiver digitando
      clearErrors("cep");
      const fetchAddress = async () => {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await res.json();

          if (!data.erro) {
            // Preenche os campos e avisa o Zod que eles estão válidos (shouldValidate: true)
            setValue("endereco", data.logradouro, { shouldValidate: true });
            setValue("bairro", data.bairro, { shouldValidate: true });
            setValue("cidade", data.localidade, { shouldValidate: true });
            setValue("uf", data.uf, { shouldValidate: true });
            
            // Tenta preencher complemento se vier (muitas das vezes não vem)
            if(data.complemento) {
                setValue("complemento", data.complemento, { shouldValidate: true });
            }

            // UX: Move o foco do cursor para o campo "Número" automaticamente
            setFocus("numero");
          } else {
            // CEP válido em formato, mas inexistente na base
            setError("cep", { 
              type: "manual", 
              message: "CEP não encontrado." 
            });
          }
        } catch (e) {
          console.error("Erro ao buscar CEP", e);
          setError("cep", { 
            type: "manual", 
            message: "Erro ao buscar CEP." 
          });
        } finally {
          setIsSearchingCep(false);
        }
      };

      fetchAddress();
    }
  }, [cepValue, setValue, setFocus, setError, clearErrors]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const res = await updateEmpresaSettings(empresaInicial.id, {
        ...data,
        logo: logoPreview,
      });
      if (res.success) setShowSuccessModal(true);
      else alert(res.error || "Erro ao salvar.");
    } catch (error) {
      alert("Erro crítico ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const linkLojaWatch = watch("linkLoja");
  const fullLinkUrl = `https://www.pededaki.com.br/${linkLojaWatch || "loja"}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullLinkUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <FormProvider {...methods}>
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase">
              Sucesso!
            </h3>
            <p className="text-gray-500 text-sm">Dados salvos corretamente.</p>
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 p-4 md:p-8"
      >
        {/* === COLUNA 1: DADOS CADASTRAIS === */}
        <Card title="Dados Cadastrais" icon={Building2}>
          {/* LOGO AREA */}
          <div className="mb-8 flex flex-col sm:flex-row items-center gap-6 p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
            <div
              className="relative group w-32 h-32 shrink-0 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-md cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}

              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ImageIcon className="text-white w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  Alterar
                </span>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-3 flex-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Upload Logo
              </button>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500">Recomendado:</p>
                <p className="text-[11px] text-gray-400">
                  Dimensões: 500x500px (Quadrado)
                </p>
                <p className="text-[11px] text-gray-400">
                  Formatos: JPG, PNG ou WEBP
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.size <= 2 * 1024 * 1024) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setLogoPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    alert("Arquivo muito grande. Máximo 2MB.");
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-5">
            <div className="md:col-span-4">
              <Label icon={Building2}>CNPJ / CPF</Label>
              <Input name="cnpj" mask="documento" disabled />
            </div>
            <div className="md:col-span-4">
              <Label>Inscrição Estadual</Label>
              <Input name="ie" />
            </div>
            <div className="md:col-span-4">
              <Label>Inscrição Municipal</Label>
              <Input name="im" />
            </div>

            <div className="md:col-span-8">
              <Label>Razão Social</Label>
              <Input name="razaoSocial" />
            </div>
            <div className="md:col-span-4">
              <Label>Segmento</Label>
              <select
                {...methods.register("segmento")}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none text-gray-700"
              >
                <option value="SORVETERIA">SORVETERIA</option>
                <option value="RESTAURANTE">RESTAURANTE</option>
                <option value="VAREJO">VAREJO</option>
              </select>
            </div>

            <div className="md:col-span-12">
              <Label>Nome Fantasia</Label>
              <Input name="nomeFantasia" />
            </div>

            <div className="md:col-span-12 border-t border-gray-100 my-2"></div>

            <div className="md:col-span-3">
              <Label icon={MapPin}>CEP</Label>
              <Input
                name="cep"
                mask="cep"
                isLoading={isSearchingCep}
                placeholder="00000-000"
              />
            </div>
            <div className="md:col-span-7">
              <Label>Endereço</Label>
              <Input name="endereco" />
            </div>
            <div className="md:col-span-2">
              <Label>Número</Label>
              <Input name="numero" />
            </div>

            <div className="md:col-span-4">
              <Label>Complemento</Label>
              <Input name="complemento" />
            </div>
            <div className="md:col-span-4">
              <Label>Bairro</Label>
              <Input name="bairro" />
            </div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Label>UF</Label>
                <select
                  {...methods.register("uf")}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700"
                >
                  {ESTADOS_BRASILEIROS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Label>Cidade</Label>
                <Input name="cidade" />
              </div>
            </div>

            <div className="md:col-span-12 border-t border-gray-100 my-2"></div>

            <div className="md:col-span-4">
              <Label icon={Phone}>Telefone</Label>
              <Input name="telefone" mask="phone" />
            </div>
            <div className="md:col-span-4">
              <Label>Comercial</Label>
              <Input name="telefoneComercial" mask="phone" />
            </div>
            <div className="md:col-span-4">
              <Label>Celular</Label>
              <Input name="celular" mask="celular" />
            </div>
            <div className="md:col-span-6">
              <Label icon={Mail}>E-mail de Contato</Label>
              <Input name="email" type="email" />
            </div>
            <div className="md:col-span-6">
              <Label icon={Globe}>Site Oficial</Label>
              <Input name="site" />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          {/* === CARD CARDÁPIO DIGITAL === */}
          <Card title="Cardápio Digital" icon={ShoppingBag}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
              <div className="md:col-span-1">
                <Label icon={Clock}>Fuso Horário</Label>
                <select
                  {...methods.register("fusoHorario")}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700"
                >
                  {FUSOS_HORARIOS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <Label icon={LayoutGrid}>Categorias</Label>
                <Input name="categorias" placeholder="Ex: Bebidas, Lanches" />
              </div>

              <div className="md:col-span-1">
                <Label icon={ShoppingBag}>Tempo Retirada (Min)</Label>
                <Input
                  name="tempoEstimado"
                  type="number"
                  placeholder="Ex: 20"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1 font-medium">
                  Tempo médio para retirar no balcão.
                </p>
              </div>

              <div className="md:col-span-1">
                <Label icon={Truck}>Tempo Entrega (Min)</Label>
                <Input name="tempoEntrega" type="number" placeholder="Ex: 40" />
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1 font-medium">
                  Tempo médio para a entrega chegar.
                </p>
              </div>

              <div className="md:col-span-2 border-t border-gray-100 my-1"></div>

              <div className="md:col-span-2">
                <Label icon={Share2}>Link da Loja</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-3 text-gray-400 text-sm select-none flex items-center h-5">
                      pededaki.com.br/
                    </span>
                    <Input
                      name="linkLoja"
                      placeholder="minha-loja"
                      className=""
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 ml-1 font-medium">
                  Nome único na URL (ex: /sua-loja).
                </p>
              </div>

              {/* AREA DE PREVIEW */}
              <div className="md:col-span-2">
                <div className="relative group overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/50 p-5 transition-all hover:bg-blue-50 hover:border-blue-300">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Link de Acesso (Preview)
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <a
                      href={fullLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-lg font-bold text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      {fullLinkUrl}
                    </a>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-blue-600 cursor-pointer border border-gray-100 active:scale-95"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        <span>{isCopied ? "Copiado!" : "Copiar"}</span>
                      </button>
                      <a
                        href={fullLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer active:scale-95"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Abrir</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* === CARD REDES SOCIAIS === */}
          <Card title="Redes Sociais" icon={Share2}>
            <div className="space-y-5">
              <div>
                <Label icon={Phone}>WhatsApp</Label>
                <Input
                  name="whatsapp"
                  mask="celular"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label icon={Facebook}>Facebook</Label>
                  <Input name="facebook" placeholder="Cole o link do perfil" />
                </div>
                <div>
                  <Label icon={Instagram}>Instagram</Label>
                  <Input name="instagram" placeholder="@seu_usuario" />
                </div>
              </div>

              {/* ÁREA CONDICIONAL (TWITTER/YOUTUBE) */}
              <div
                className={`space-y-5 overflow-hidden transition-all duration-500 ease-in-out ${
                  showExtraSocials
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                  <div>
                    <Label icon={Youtube}>YouTube</Label>
                    <Input name="youtube" placeholder="Canal ou Vídeo" />
                  </div>
                  <div>
                    <Label icon={Twitter}>Twitter / X</Label>
                    <Input name="twitter" placeholder="@usuario" />
                  </div>
                </div>
              </div>

              {/* BOTÃO TOGGLE */}
              {!showExtraSocials && (
                <button
                  type="button"
                  onClick={() => setShowExtraSocials(true)}
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Adicionar outras redes (YouTube,
                  Twitter)
                </button>
              )}
            </div>
          </Card>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}{" "}
            Salvar Todas as Alterações
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
