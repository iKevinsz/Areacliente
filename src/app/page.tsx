"use client";

import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Building2, MapPin, Phone, Mail, Globe, 
  Clock, ShoppingBag, Truck, Share2, 
  Save, Upload, User, LayoutGrid, Facebook, Instagram, Youtube, Twitter
} from "lucide-react";

// --- Schema de Validação (Zod) ---
const empresaSchema = z.object({
  // Dados Cadastrais
  cnpj: z.string().min(11, "Documento incompleto"), // Ajustado para aceitar CPF ou CNPJ
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

// Máscara Híbrida (Aceita CPF até 11 dígitos e muda para CNPJ se passar)
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
    .substring(0, 14); // (11) 2222-3333
};

export const normalizeCelular = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15); // (11) 92222-3333
};

// --- Componentes UI Reutilizáveis ---

const Label = ({ icon: Icon, children, htmlFor }: { icon?: React.ElementType, children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5">
    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
    {children}
  </label>
);

// Tipo para as máscaras
type MaskType = "cep" | "cpf" | "cnpj" | "documento" | "phone" | "celular";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mask?: MaskType;
}

const Input = ({ name, mask, className, ...props }: InputProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string;

  // Extraímos o onChange original do register
  const { onChange: formOnChange, ...rest } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Aplica a máscara selecionada
    if (mask === 'cep') value = normalizeCep(value);
    if (mask === 'cpf') value = normalizeCpf(value);
    if (mask === 'cnpj') value = normalizeCnpj(value);
    if (mask === 'documento') value = normalizeDocumento(value);
    if (mask === 'phone') value = normalizePhone(value);
    if (mask === 'celular') value = normalizeCelular(value);

    // Atualiza o valor no input
    e.target.value = value;
    
    // Retorna o valor mascarado para o React Hook Form
    formOnChange(e);
  };
  
  return (
    <div className="w-full">
      <input
        {...rest}
        onChange={handleChange}
        {...props}
        className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-200'} px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${className}`}
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

  const onSubmit = (data: EmpresaFormData) => {
    console.log("Dados salvos:", data);
    alert("Dados da empresa atualizados com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header / Breadcrumb */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-gray-400 font-medium">Meus Dados /</span> Empresa
        </h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* COLUNA ESQUERDA: DADOS CADASTRAIS */}
          <Card title="Dados Cadastrais">
            {/* Logo Upload Area */}
            <div className="mb-8 flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-100 rounded-xl bg-blue-50/30">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-inner">
                {/* Placeholder para imagem */}
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <button type="button" className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-white px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" /> Carregar Logo
              </button>
              <p className="text-xs text-gray-400 mt-2">JPG, BMP ou PNG. Máx 1MB.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Linha 1 */}
              <div className="md:col-span-4">
                <Label icon={Building2}>CNPJ / CPF</Label>
                {/* APLICADO MÁSCARA DE DOCUMENTO (CPF/CNPJ) */}
                <Input name="cnpj" mask="documento" placeholder="00.000.000/0000-00" />
              </div>
              <div className="md:col-span-4">
                <Label>Inscrição Estadual</Label>
                <Input name="ie" />
              </div>
              <div className="md:col-span-4">
                <Label>Inscrição Municipal</Label>
                <Input name="im" />
              </div>

              {/* Linha 2 */}
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

              {/* Linha 3 */}
              <div className="md:col-span-12">
                <Label>Nome Fantasia</Label>
                <Input name="nomeFantasia" />
              </div>

              {/* Endereço */}
              <div className="md:col-span-3">
                <Label icon={MapPin}>CEP</Label>
                {/* APLICADO MÁSCARA DE CEP */}
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
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
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

              {/* Contato */}
              <div className="md:col-span-12 border-t border-gray-100 my-2"></div>

              <div className="md:col-span-4">
                <Label icon={Phone}>Telefone</Label>
                {/* APLICADO MÁSCARA DE TELEFONE FIXO */}
                <Input name="telefone" mask="phone" placeholder="(00) 0000-0000" />
              </div>
              <div className="md:col-span-4">
                <Label>Telefone Comercial</Label>
                <Input name="telefoneComercial" mask="phone" />
              </div>
              <div className="md:col-span-4">
                <Label>Celular</Label>
                {/* APLICADO MÁSCARA DE CELULAR */}
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
                    <option value="Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="Manaus">Manaus (GMT-4)</option>
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
                    <button type="button" className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                  <span className="text-xs font-semibold text-blue-800 uppercase block mb-1">Link do Cardápio Digital:</span>
                  <a href="#" className="text-sm text-blue-600 hover:underline truncate block">
                    https://www.cardapio.datacaixa.com.br/kevinteste
                  </a>
                </div>
              </div>
            </Card>

            <Card title="Redes Sociais">
              <div className="space-y-4">
                <div>
                  <Label icon={Phone}>WhatsApp</Label>
                  {/* APLICADO MÁSCARA DE CELULAR NO WHATSAPP */}
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </button>
            </div>
          </div>

        </form>
      </FormProvider>
    </div>
  );
}