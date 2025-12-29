"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2, MapPin, Phone, Mail, Globe,
  Clock, ShoppingBag, Truck, Share2,
  Save, Upload, User, LayoutGrid, Facebook, Instagram, Youtube, Twitter,
  CheckCircle, Loader2, X
} from "lucide-react";

import { updateEmpresaSettings } from "@/app/actions/empresa";

// --- Constantes ---
const ESTADOS_BRASILEIROS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const FUSOS_HORARIOS = [
  { value: "Sao_Paulo", label: "São Paulo / Brasília (GMT-3)" },
  { value: "Manaus", label: "Manaus / Amazonas (GMT-4)" },
  { value: "Rio_Branco", label: "Rio Branco / Acre (GMT-5)" },
  { value: "Fernando_de_Noronha", label: "Fernando de Noronha (GMT-2)" }
];

// --- Schema de Validação ---
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
  ie: z.string().nullable().optional().or(z.literal('')),
  im: z.string().nullable().optional().or(z.literal('')),
  segmento: z.string().nullable().optional().or(z.literal('')),
  complemento: z.string().nullable().optional().or(z.literal('')),
  telefone: z.string().nullable().optional().or(z.literal('')),
  telefoneComercial: z.string().nullable().optional().or(z.literal('')),
  celular: z.string().nullable().optional().or(z.literal('')),
  contato: z.string().nullable().optional().or(z.literal('')),
  email: z.string().email("E-mail inválido").nullable().optional().or(z.literal('')),
  site: z.string().nullable().optional().or(z.literal('')),
  fusoHorario: z.string().nullable().optional().default("Sao_Paulo"),
  categorias: z.string().nullable().optional().or(z.literal('')),
  tempoEstimado: z.preprocess((val) => (val === null ? "" : String(val)), z.string().optional()),
  tempoEntrega: z.preprocess((val) => (val === null ? "" : String(val)), z.string().optional()),
  linkLoja: z.string().nullable().optional().or(z.literal('')),
  whatsapp: z.string().nullable().optional().or(z.literal('')),
  facebook: z.string().nullable().optional().or(z.literal('')),
  instagram: z.string().nullable().optional().or(z.literal('')),
  youtube: z.string().nullable().optional().or(z.literal('')),
  twitter: z.string().nullable().optional().or(z.literal('')),
});

// --- Funções de Normalização ---
export const normalizeCep = (v: string) => v.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
export const normalizeDocumento = (v: string) => {
  const r = v.replace(/\D/g, "");
  return r.length <= 11 ? r.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : r.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};
export const normalizePhone = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2").substring(0, 14);
export const normalizeCelular = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15);

const Label = ({ icon: Icon, children, htmlFor }: any) => (
  <label htmlFor={htmlFor} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </label>
);

// --- COMPONENTE CARD ---
const Card = ({ title, children, className }: any) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

// --- COMPONENTE INPUT (FUNDO BRANCO) ---
const Input = ({ name, mask, className, isLoading, ...props }: any) => {
  const { register, setValue, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div className="w-full relative">
      <input
        {...register(name, {
          onChange: (e) => {
            let val = e.target.value;
            if (mask === 'cep') val = normalizeCep(val);
            if (mask === 'documento') val = normalizeDocumento(val);
            if (mask === 'phone') val = normalizePhone(val);
            if (mask === 'celular') val = normalizeCelular(val);
            setValue(name, val); 
          }
        })}
        {...props}
        className={`w-full rounded-xl border ${error ? 'border-red-500' : 'border-gray-200'} bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
      />
      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      )}
      {error && <span className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error}</span>}
    </div>
  );
};

export default function EmpresaSettingsPage({ empresaInicial }: { empresaInicial: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(empresaInicial?.logo || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const methods = useForm({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresaInicial
  });

  const { setValue, watch, handleSubmit } = methods;
  const cepValue = watch("cep");

  // --- LÓGICA DE CEP ---
  useEffect(() => {
    const cleanCep = cepValue?.replace(/\D/g, "");
    if (cleanCep?.length === 8) {
      const handler = setTimeout(async () => {
        setIsSearchingCep(true);
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setValue("endereco", data.logradouro);
            setValue("bairro", data.bairro);
            setValue("cidade", data.localidade);
            setValue("uf", data.uf);
          }
        } catch (e) {
          console.error("Erro CEP", e);
        } finally {
          setIsSearchingCep(false);
        }
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [cepValue, setValue]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const res = await updateEmpresaSettings(empresaInicial.id, { ...data, logo: logoPreview });
      if (res.success) setShowSuccessModal(true);
      else alert(res.error || "Erro ao salvar.");
    } catch (error) {
      alert("Erro crítico ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const linkLojaWatch = watch("linkLoja");

  return (
    <FormProvider {...methods}>
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase">Sucesso!</h3>
            <p className="text-gray-500 text-sm">Dados salvos corretamente.</p>
            <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl cursor-pointer">Entendido</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 p-4 md:p-8">
        
        <Card title="Dados Cadastrais">
          <div className="mb-8 flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-50 rounded-3xl bg-blue-50/20">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
              {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-gray-300" />}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size <= 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 bg-white px-5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 transition-all shadow-sm cursor-pointer">
              <Upload className="w-4 h-4" /> Alterar Logo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4"><Label icon={Building2}>CNPJ / CPF</Label><Input name="cnpj" mask="documento" disabled /></div>
            <div className="md:col-span-4"><Label>Inscrição Estadual</Label><Input name="ie" /></div>
            <div className="md:col-span-4"><Label>Inscrição Municipal</Label><Input name="im" /></div>
            <div className="md:col-span-8"><Label>Razão Social</Label><Input name="razaoSocial" /></div>
            <div className="md:col-span-4"><Label>Segmento</Label>
              <select {...methods.register("segmento")} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"><option value="SORVETERIA">SORVETERIA</option><option value="RESTAURANTE">RESTAURANTE</option><option value="VAREJO">VAREJO</option></select>
            </div>
            <div className="md:col-span-12"><Label>Nome Fantasia</Label><Input name="nomeFantasia" /></div>
            <div className="md:col-span-3"><Label icon={MapPin}>CEP</Label><Input name="cep" mask="cep" isLoading={isSearchingCep} placeholder="00000-000" /></div>
            <div className="md:col-span-7"><Label>Endereço</Label><Input name="endereco" /></div>
            <div className="md:col-span-2"><Label>Número</Label><Input name="numero" /></div>
            <div className="md:col-span-4"><Label>Complemento</Label><Input name="complemento" /></div>
            <div className="md:col-span-4"><Label>Bairro</Label><Input name="bairro" /></div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2">
              <div className="col-span-1"><Label>UF</Label><select {...methods.register("uf")} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">{ESTADOS_BRASILEIROS.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
              <div className="col-span-2"><Label>Cidade</Label><Input name="cidade" /></div>
            </div>
            <div className="md:col-span-12 border-t border-gray-100 my-4"></div>
            <div className="md:col-span-4"><Label icon={Phone}>Telefone</Label><Input name="telefone" mask="phone" /></div>
            <div className="md:col-span-4"><Label>Comercial</Label><Input name="telefoneComercial" mask="phone" /></div>
            <div className="md:col-span-4"><Label>Celular</Label><Input name="celular" mask="celular" /></div>
            <div className="md:col-span-6"><Label icon={Mail}>E-mail de Contato</Label><Input name="email" type="email" /></div>
            <div className="md:col-span-6"><Label icon={Globe}>Site Oficial</Label><Input name="site" /></div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Cardápio Digital">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1"><Label icon={Clock}>Fuso Horário</Label>
                <select {...methods.register("fusoHorario")} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">{FUSOS_HORARIOS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
              </div>
              <div className="md:col-span-1"><Label icon={LayoutGrid}>Categorias</Label><Input name="categorias" /></div>
              <div className="md:col-span-1"><Label icon={ShoppingBag}>Tempo Retirada (Min)</Label><Input name="tempoEstimado" type="number" /></div>
              <div className="md:col-span-1"><Label icon={Truck}>Tempo Entrega (Min)</Label><Input name="tempoEntrega" type="number" /></div>
              <div className="md:col-span-2"><Label icon={Share2}>Link da Loja</Label>
                <div className="flex gap-2">
                  <Input name="linkLoja" /><button type="button" className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="md:col-span-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">URL Pública:</span>
                <a href={`https://www.pededaki.com.br/${linkLojaWatch || 'loja'}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block font-bold">https://www.pededaki.com.br/{linkLojaWatch || 'loja'}</a>
              </div>
            </div>
          </Card>

          <Card title="Redes Sociais">
            <div className="space-y-4">
              <div><Label icon={Phone}>WhatsApp Business</Label><Input name="whatsapp" mask="celular" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label icon={Facebook}>Facebook</Label><Input name="facebook" /></div>
                <div><Label icon={Instagram}>Instagram</Label><Input name="instagram" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label icon={Youtube}>YouTube</Label><Input name="youtube" /></div>
                <div><Label icon={Twitter}>Twitter</Label><Input name="twitter" /></div>
              </div>
            </div>
          </Card>

          <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 cursor-pointer">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Salvar Todas as Alterações
          </button>
        </div>
      </form>
    </FormProvider>
  );
}