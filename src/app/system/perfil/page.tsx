"use client";

import React, { useState, useRef } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Building2, MapPin, Phone, Mail, Globe, 
  Clock, ShoppingBag, Truck, Share2, 
  Save, Upload, User, LayoutGrid, Facebook, Instagram, Youtube, Twitter
} from "lucide-react";

// --- Lista de Estados (UFs) ---
const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

// --- Lista de Fusos Horários ---
const FUSOS_HORARIOS = [
  { value: "Sao_Paulo", label: "São Paulo / Brasília (GMT-3)" },
  { value: "Manaus", label: "Manaus / Amazonas (GMT-4)" },
  { value: "Rio_Branco", label: "Rio Branco / Acre (GMT-5)" },
  { value: "Fernando_de_Noronha", label: "Fernando de Noronha (GMT-2)" },
];

// --- Schema de Validação (Zod) ---
const empresaSchema = z.object({
  // Dados Cadastrais
  cnpj: z.string().min(11, "Documento incompleto"), 
  ie: z.string().optional(),
  im: z.string().optional(),
  segmento: z.string().optional(),
  razaoSocial: z.string().min(1, "Razão Social obrigatória"),
  nomeFantasia: z.string().min(1, "Nome Fantasia obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  endereco: z.string().min(1, "Endereço obrigatório"),
  numero: z.string().min(1, "Número obrigatório"),
  bairro: z.string().min(1, "Bairro obrigatório"),
  complemento: z.string().optional(),
  uf: z.string().min(2, "UF obrigatória"),
  cidade: z.string().min(1, "Cidade obrigatória"),
  telefone: z.string().optional(),
  telefoneComercial: z.string().optional(),
  celular: z.string().optional(),
  contato: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  site: z.string().optional(),

  // Cardápio Digital
  fusoHorario: z.string(),
  categorias: z.string().optional(),
  tempoEstimado: z.string().optional(),
  tempoEntrega: z.string().optional(),
  linkLoja: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;


// --- Funções de Normalização (Máscaras) ---

export const normalizeCep = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

export const normalizeCpf = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const normalizeCnpj = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

export const normalizeDocumento = (value: string | undefined) => {
  if (!value) return "";
  const rawValue = value.replace(/\D/g, "");
  
  if (rawValue.length <= 11) {
    return normalizeCpf(value);
  }
  return normalizeCnpj(value);
};

export const normalizePhone = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 14); 
};

export const normalizeCelular = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15); 
};

// --- Componentes UI Reutilizáveis ---

const Label = ({ icon: Icon, children, htmlFor }: { icon?: React.ElementType, children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
    {children}
  </label>
);

type MaskType = "cep" | "cpf" | "cnpj" | "documento" | "phone" | "celular";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mask?: MaskType;
}

const Input = ({ name, mask, className, ...props }: InputProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;
  const { onChange: formOnChange, ...rest } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (mask === 'cep') value = normalizeCep(value);
    if (mask === 'cpf') value = normalizeCpf(value);
    if (mask === 'cnpj') value = normalizeCnpj(value);
    if (mask === 'documento') value = normalizeDocumento(value);
    if (mask === 'phone') value = normalizePhone(value);
    if (mask === 'celular') value = normalizeCelular(value);
    e.target.value = value;
    formOnChange(e);
  };
  
  return (
    <div className="w-full">
      <input
        {...rest}
        onChange={handleChange}
        {...props}
        className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

const Select = ({ name, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { name: string }) => {
  const { register } = useFormContext();
  return (
    <div className="relative">
      <select
        {...register(name)}
        {...props}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  );
};

const Card = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// --- Componente Principal ---

export default function EmpresaSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const methods = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      uf: "SP",
      cidade: "Guaratinguetá",
      fusoHorario: "Sao_Paulo",
      segmento: "SORVETERIA",
      razaoSocial: "KEVIN RODRIGO",
      nomeFantasia: "KEVIN-TESTE"
    }
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("A imagem deve ter no máximo 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EmpresaFormData) => {
    // Adiciona o logoPreview ao objeto final se houver imagem carregada
    const finalData = { ...data, logo: logoPreview };
    console.log("Dados salvos:", finalData);
    alert("Dados da empresa atualizados com sucesso!");
  };

  return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* COLUNA ESQUERDA: DADOS CADASTRAIS */}
          <Card title="Dados Cadastrais">
            <div className="mb-8 flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50/30">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-inner border-2 border-white">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              
              {/* Input file oculto */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/png, image/jpeg, image/bmp"
                onChange={handleLogoUpload}
              />

              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" /> 
                {logoPreview ? "Alterar Logo" : "Carregar Logo"}
              </button>
              <p className="text-xs text-gray-400 mt-2">JPG, BMP ou PNG. Máx 1MB.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <Label icon={Building2}>CNPJ / CPF</Label>
                <Input 
                  name="cnpj" 
                  mask="documento" 
                  placeholder="14.356.429/0001-20"
                  disabled 
                />
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
                <Select name="segmento">
                  <option value="SORVETERIA">AÇAITERIA / SORVETERIA</option>
                  <option value="RESTAURANTE">RESTAURANTE</option>
                  <option value="VAREJO">VAREJO</option>
                </Select>
              </div>

              <div className="md:col-span-12">
                <Label>Nome Fantasia</Label>
                <Input name="nomeFantasia" />
              </div>

              <div className="md:col-span-3">
                <Label icon={MapPin}>CEP</Label>
                <Input name="cep" mask="cep" placeholder="00000-000" />
              </div>
              <div className="md:col-span-7">
                <Label>Endereço</Label>
                <Input name="endereco" placeholder="Rua..." />
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
                  <Select name="uf">
                    <option value="" disabled>Selecione</option>
                    {ESTADOS_BRASILEIROS.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Cidade</Label>
                  <Select name="cidade">
                    <option value="Guaratinguetá">Guaratinguetá</option>
                    <option value="São Paulo">São Paulo</option>
                  </Select>
                </div>
              </div>

              <div className="md:col-span-12 border-t border-gray-100 my-2"></div>

              <div className="md:col-span-4">
                <Label icon={Phone}>Telefone</Label>
                <Input name="telefone" mask="phone" placeholder="(00) 0000-0000" />
              </div>
              <div className="md:col-span-4">
                <Label>Telefone Comercial</Label>
                <Input name="telefoneComercial" mask="phone" />
              </div>
              <div className="md:col-span-4">
                <Label>Celular</Label>
                <Input name="celular" mask="celular" placeholder="(00) 90000-0000" />
              </div>

              <div className="md:col-span-6">
                <Label icon={Mail}>E-mail</Label>
                <Input name="email" type="email" />
              </div>
              <div className="md:col-span-6">
                <Label icon={Globe}>Site</Label>
                <Input name="site" placeholder="www.seusite.com.br" />
              </div>
            </div>
          </Card>

          {/* COLUNA DIREITA: CARDÁPIO DIGITAL & REDES SOCIAIS */}
          <div className="flex flex-col gap-6">
            <Card title="Cardápio Digital">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <Label icon={Clock}>Fuso Horário</Label>
                  <Select name="fusoHorario">
                    {FUSOS_HORARIOS.map((fuso) => (
                      <option key={fuso.value} value={fuso.value}>{fuso.label}</option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Label icon={LayoutGrid}>Categorias de Produtos</Label>
                  <Input name="categorias" placeholder="Ex: Bebidas, Lanches..." />
                </div>

                <div className="md:col-span-1">
                  <Label icon={ShoppingBag}>Tempo Retirada (Min)</Label>
                  <Input name="tempoEstimado" type="number" placeholder="0" />
                </div>
                <div className="md:col-span-1">
                  <Label icon={Truck}>Tempo Entrega (Min)</Label>
                  <Input name="tempoEntrega" type="number" placeholder="0" />
                </div>

                <div className="md:col-span-2">
                  <Label icon={Share2}>Link da Loja</Label>
                  <div className="flex gap-2">
                    <Input name="linkLoja" placeholder="loja-teste" />
                    <button type="button" className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                <span className="text-xs font-semibold text-blue-800 uppercase block mb-1">Link do Cardápio Digital:</span>
                <a 
                  href="https://www.pededaki.com.br/kevinteste" 
                  target="_blank"               // Abre em nova aba
                  rel="noopener noreferrer"     // Segurança recomendada
                  className="text-sm text-blue-600 hover:underline truncate block font-medium"
                >
                  https://www.pededaki.com.br/kevinteste
                </a>
              </div>
              </div>
            </Card>

            <Card title="Redes Sociais">
              <div className="space-y-4">
                <div>
                  <Label icon={Phone}>WhatsApp</Label>
                  <Input name="whatsapp" mask="celular" placeholder="Apenas números" />
                </div>
                <div>
                  <Label icon={Facebook}>Facebook</Label>
                  <Input name="facebook" placeholder="Link do perfil" />
                </div>
                <div>
                  <Label icon={Instagram}>Instagram</Label>
                  <Input name="instagram" placeholder="Link do perfil" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label icon={Youtube}>YouTube</Label>
                        <Input name="youtube" />
                    </div>
                    <div>
                        <Label icon={Twitter}>X (Twitter)</Label>
                        <Input name="twitter" />
                    </div>
                </div>
              </div>
            </Card>

            <div className="mt-auto">
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </button>
            </div>
          </div>

        </form>
      </FormProvider>
  );
}