"use client";

import React, { useState, useRef } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2, MapPin, Phone, Mail, Globe,
  Clock, ShoppingBag, Truck, Share2,
  Save, Upload, User, LayoutGrid, Facebook, Instagram, Youtube, Twitter,
  CheckCircle, X
} from "lucide-react";

// --- IMPORT DA ACTION ---
import { updateEmpresaSettings } from "@/app/actions/empresa";

// --- Constantes ---
const ESTADOS_BRASILEIROS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const FUSOS_HORARIOS = [
  { value: "Sao_Paulo", label: "São Paulo / Brasília (GMT-3)" },
  { value: "Manaus", label: "Manaus / Amazonas (GMT-4)" },
  { value: "Rio_Branco", label: "Rio Branco / Acre (GMT-5)" },
  { value: "Fernando_de_Noronha", label: "Fernando de Noronha (GMT-2)" }
];

// --- Schema de Validação (Zod) ---
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

type EmpresaFormData = z.infer<typeof empresaSchema>;

// --- Funções de Normalização ---
export const normalizeCep = (v: string | undefined) => v?.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9) || "";
export const normalizeDocumento = (v: string | undefined) => {
  const r = v?.replace(/\D/g, "") || "";
  return r.length <= 11 ? r.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : r.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};
export const normalizePhone = (v: string | undefined) => v?.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2").substring(0, 14) || "";
export const normalizeCelular = (v: string | undefined) => v?.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 15) || "";
export const normalizeNumbersOnly = (v: string | undefined) => v?.replace(/\D/g, "") || "";

const Label = ({ icon: Icon, children, htmlFor }: any) => (
  <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
    {children}
  </label>
);

const Input = ({ name, mask, className, ...props }: any) => {
  const { register, setValue, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;
  const { onChange, ...rest } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (mask === 'cep') val = normalizeCep(val);
    if (mask === 'documento') val = normalizeDocumento(val);
    if (mask === 'phone') val = normalizePhone(val);
    if (mask === 'celular') val = normalizeCelular(val);
    if (mask === 'ie' || mask === 'im') val = normalizeNumbersOnly(val);
    
    setValue(name, val);
    onChange(e);
  };

  return (
    <div className="w-full">
      <input
        {...rest}
        onChange={handleChange}
        {...props}
        className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

const Card = ({ title, children, className }: any) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h2 className="text-lg font-semibold text-gray-800">{title}</h2></div>
    <div className="p-6">{children}</div>
  </div>
);

export default function EmpresaSettingsPage({ empresaInicial }: { empresaInicial: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(empresaInicial?.logo || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const methods = useForm({
    defaultValues: empresaInicial
  });

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

  const linkLojaWatch = methods.watch("linkLoja");

  return (
    <FormProvider {...methods}>
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="w-12 h-12 text-green-600" /></div>
            <h3 className="text-xl font-bold text-gray-900">Sucesso!</h3>
            <p className="text-gray-500 text-sm">Os dados da empresa foram salvos corretamente.</p>
            <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg cursor-pointer">Entendido</button>
          </div>
        </div>
      )}

      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 relative p-4">
        <Card title="Dados Cadastrais">
          <div className="mb-8 flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50/30">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm">
              {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-gray-400" />}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size <= 1024 * 1024) {
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"><Upload className="w-4 h-4" /> Alterar Logo</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4"><Label icon={Building2}>CNPJ / CPF</Label><Input name="cnpj" mask="documento" disabled /></div>
            <div className="md:col-span-4"><Label>Inscrição Estadual</Label><Input name="ie" mask="ie" /></div>
            <div className="md:col-span-4"><Label>Inscrição Municipal</Label><Input name="im" mask="im" /></div>
            <div className="md:col-span-8"><Label>Razão Social</Label><Input name="razaoSocial" /></div>
            <div className="md:col-span-4"><Label>Segmento</Label>
              <select {...methods.register("segmento")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 cursor-pointer"><option value="SORVETERIA">SORVETERIA</option><option value="RESTAURANTE">RESTAURANTE</option><option value="VAREJO">VAREJO</option></select>
            </div>
            <div className="md:col-span-12"><Label>Nome Fantasia</Label><Input name="nomeFantasia" /></div>
            <div className="md:col-span-3"><Label icon={MapPin}>CEP</Label><Input name="cep" mask="cep" /></div>
            <div className="md:col-span-7"><Label>Endereço</Label><Input name="endereco" /></div>
            <div className="md:col-span-2"><Label>Número</Label><Input name="numero" /></div>
            <div className="md:col-span-4"><Label>Complemento</Label><Input name="complemento" /></div>
            <div className="md:col-span-4"><Label>Bairro</Label><Input name="bairro" /></div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2">
              <div className="col-span-1"><Label>UF</Label><select {...methods.register("uf")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none cursor-pointer">{ESTADOS_BRASILEIROS.map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
              <div className="col-span-2"><Label>Cidade</Label><Input name="cidade" /></div>
            </div>
            <div className="md:col-span-12 border-t border-gray-100 my-2"></div>
            <div className="md:col-span-4"><Label icon={Phone}>Telefone</Label><Input name="telefone" mask="phone" /></div>
            <div className="md:col-span-4"><Label>Comercial</Label><Input name="telefoneComercial" mask="phone" /></div>
            <div className="md:col-span-4"><Label>Celular</Label><Input name="celular" mask="celular" /></div>
            <div className="md:col-span-6"><Label icon={Mail}>E-mail</Label><Input name="email" type="email" /></div>
            <div className="md:col-span-6"><Label icon={Globe}>Site</Label><Input name="site" /></div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Cardápio Digital">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1"><Label icon={Clock}>Fuso Horário</Label>
                <select {...methods.register("fusoHorario")} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none cursor-pointer">{FUSOS_HORARIOS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
              </div>
              <div className="md:col-span-1"><Label icon={LayoutGrid}>Categorias</Label><Input name="categorias" /></div>
              <div className="md:col-span-1"><Label icon={ShoppingBag}>Tempo Retirada (Min)</Label><Input name="tempoEstimado" type="number" /></div>
              <div className="md:col-span-1"><Label icon={Truck}>Tempo Entrega (Min)</Label><Input name="tempoEntrega" type="number" /></div>
              <div className="md:col-span-2"><Label icon={Share2}>Link da Loja</Label>
                <div className="flex gap-2">
                  <Input name="linkLoja" /><button type="button" className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                <span className="text-xs font-semibold text-blue-800 uppercase block mb-1">Link do Cardápio Digital:</span>
                <a href={`https://www.pededaki.com.br/${linkLojaWatch || 'loja'}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block font-medium cursor-pointer">https://www.pededaki.com.br/{linkLojaWatch || 'loja'}</a>
              </div>
            </div>
          </Card>

          <Card title="Redes Sociais">
            <div className="space-y-4">
              <div><Label icon={Phone}>WhatsApp</Label><Input name="whatsapp" mask="celular" /></div>
              <div><Label icon={Facebook}>Facebook</Label><Input name="facebook" /></div>
              <div><Label icon={Instagram}>Instagram</Label><Input name="instagram" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label icon={Youtube}>YouTube</Label><Input name="youtube" /></div>
                <div><Label icon={Twitter}>Twitter</Label><Input name="twitter" /></div>
              </div>
            </div>
          </Card>

          <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 cursor-pointer">
            {isSaving ? "Salvando..." : <><Save className="w-5 h-5" /> Salvar Alterações</>}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}