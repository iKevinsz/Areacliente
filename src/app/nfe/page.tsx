"use client";

import React, { useState } from "react";
import { 
  useForm, 
  FormProvider, 
  useFormContext, 
  useFieldArray 
} from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// --- Componentes de UI Reutilizáveis ---

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  mask?: "cep" | "cnpj"; 
}

const Input = ({ name, className, mask, ...props }: InputProps) => {
  const { register } = useFormContext();
  
  const { onChange, ...rest } = register(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (mask === "cep") value = normalizeCep(value);
    if (mask === "cnpj") value = normalizeCnpj(value);

    e.target.value = value;
    onChange(e);
  };

  return (
    <input
      {...rest}
      onChange={handleChange}
      {...props}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
}

const Select = ({ name, className, children, ...props }: SelectProps) => {
  const { register } = useFormContext();
  return (
    <select
      {...register(name)}
      {...props}
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    >
      {children}
    </select>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 mb-4 flex items-center">
    {children}
  </h3>
);

// --- Funções Utilitárias de Máscara ---

const normalizeCep = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

const normalizeCnpj = (value: string | undefined) => {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

// --- Componentes da Página de NF-e ---

function TabDestinatario() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <SectionTitle>
          <span className="bg-blue-100 text-blue-800 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">1</span>
          Dados da Operação
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Tipo de Operação</Label>
            <Select name="tipoOperacao">
              <option value="saida">Saída (Venda)</option>
              <option value="entrada">Entrada (Devolução)</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Natureza da Operação</Label>
            <Select name="cfop">
              <option value="5102">5.102 - Venda de mercadoria adquirida de terceiros</option>
              <option value="5405">5.405 - Venda de mercadoria (ST)</option>
            </Select>
          </div>
          <div>
            <Label>Data de Emissão</Label>
            <Input name="dataEmissao" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <SectionTitle>
           <span className="bg-blue-100 text-blue-800 w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">2</span>
           Destinatário / Remetente
        </SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-3">
            <Label>CPF / CNPJ</Label>
             <div className="flex">
              <Input name="destinatario.documento" mask="cnpj" placeholder="00.000.000/0000-00" className="rounded-r-none" />
              <button type="button" className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-2 rounded-r-md text-sm hover:bg-gray-200">🔍</button>
             </div>
          </div>
           <div className="md:col-span-5">
            <Label>Nome / Razão Social</Label>
            <Input name="destinatario.nome" placeholder="Nome do Cliente SA" />
          </div>
          <div className="md:col-span-4">
            <Label>Inscrição Estadual</Label>
            <Input name="destinatario.ie" placeholder="Isento ou número" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-2">
            <Label>CEP</Label>
            <Input name="endereco.cep" mask="cep" placeholder="00000-000" />
          </div>
          <div className="md:col-span-6">
            <Label>Logradouro</Label>
            <Input name="endereco.logradouro" />
          </div>
          <div className="md:col-span-2">
            <Label>Número</Label>
            <Input name="endereco.numero" />
          </div>
           <div className="md:col-span-2">
            <Label>Complemento</Label>
            <Input name="endereco.complemento" />
          </div>
        </div>
        
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <Label>Bairro</Label>
            <Input name="endereco.bairro" />
          </div>
           <div className="md:col-span-2">
            <Label>UF</Label>
            <Select name="endereco.uf">
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              <option value="MG">MG</option>
            </Select>
          </div>
          <div className="md:col-span-6">
            <Label>Município</Label>
            <Select name="endereco.municipio">
              <option value="">Selecione a UF primeiro...</option>
               <option value="Sao Paulo">São Paulo</option>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}

function TabProdutos() {
  const { control, register } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens"
  });

  const adicionarProduto = () => {
    append({ codigo: "", descricao: "", ncm: "", qtd: 1, valorUnit: 0, total: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
           <SectionTitle>Itens da Nota</SectionTitle>
           <button 
             type="button" 
             onClick={adicionarProduto}
             className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
           >
             + Adicionar Produto
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">NCM</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vlr. Unit.</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-2 py-2 w-24">
                    <input {...register(`itens.${index}.codigo`)} className="w-full border rounded p-1 text-sm" />
                  </td>
                  <td className="px-2 py-2">
                    <input {...register(`itens.${index}.descricao`)} className="w-full border rounded p-1 text-sm" />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input {...register(`itens.${index}.ncm`)} className="w-full border rounded p-1 text-sm" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <input type="number" {...register(`itens.${index}.qtd`)} className="w-full border rounded p-1 text-right text-sm" />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input type="number" step="0.01" {...register(`itens.${index}.valorUnit`)} className="w-full border rounded p-1 text-right text-sm" />
                  </td>
                  <td className="px-2 py-2 text-center w-20">
                    <button type="button" onClick={() => remove(index)} className="text-red-600 hover:text-red-900 text-sm font-bold">
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded mt-2">
              Nenhum produto adicionado. Clique no botão azul acima.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TotaisSidebar() {
  const SummaryRow = ({ label, value, highlight = false, negative = false }: { label: string; value: string; highlight?: boolean; negative?: boolean }) => (
    <div className={`flex justify-between items-center py-2 ${highlight ? 'text-lg font-bold border-t-2 border-gray-300 mt-2 pt-4' : 'text-sm border-b border-gray-100'}`}>
      <span className={`${highlight ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
      <span className={`${highlight ? 'text-blue-800' : negative ? 'text-red-600' : 'text-gray-900'}`}>{negative && "- "}{value}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100 h-fit sticky top-8">
      <h3 className="text-md font-bold text-gray-800 mb-4 uppercase tracking-wide pb-2 border-b">Resumo da Nota</h3>
      <div className="space-y-1">
        <SummaryRow label="Total dos Produtos" value="R$ 0,00" />
        <SummaryRow label="Frete" value="R$ 0,00" />
      </div>
      <SummaryRow label="Valor Total da Nota" value="R$ 0,00" highlight />

      <div className="mt-8 flex flex-col gap-3">
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-bold text-lg shadow-sm transition-all flex items-center justify-center">
          Transmitir NF-e
        </button>
      </div>
    </div>
  );
}

// Schema de validação
const nfeSchema = z.object({
  destinatario: z.object({
    documento: z.string().min(14, "CNPJ inválido"),
    nome: z.string().nonempty("Razão social é obrigatória"),
  }),
  itens: z.array(z.object({
    descricao: z.string().nonempty("Descrição obrigatória"),
    valorUnit: z.coerce.number().min(0.01, "Valor deve ser maior que 0"), 
  })).min(1, "Adicione pelo menos um produto"),
});

// --- Página Principal ---
export default function NfeCreationPage() {
  const [activeTab, setActiveTab] = useState<'destinatario' | 'produtos' | 'pagamento'>('destinatario');

  const methods = useForm({
    resolver: zodResolver(nfeSchema),
    defaultValues: {
      tipoOperacao: "saida",
      itens: []
    }
  });
  
  const onSubmit = (data: any) => {
    console.log("Dados do formulário VÁLIDOS:", data);
    alert("Sucesso! Verifique o console.");
  };

  const onError = (errors: any) => {
    console.log("Erros de validação:", errors);
    alert("Existem erros no formulário. Verifique os campos.");
  };

  const tabTriggerClass = (tabName: string) =>
    `pb-3 px-1 border-b-2 font-medium text-sm transition-all ${
      activeTab === tabName
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nova Nota Fiscal Eletrônica (NF-e)</h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button type="button" onClick={() => setActiveTab('destinatario')} className={tabTriggerClass('destinatario')}>
                    1. Destinatário e Dados
                  </button>
                  <button type="button" onClick={() => setActiveTab('produtos')} className={tabTriggerClass('produtos')}>
                    2. Produtos e Impostos
                  </button>
                  <button type="button" onClick={() => setActiveTab('pagamento')} className={tabTriggerClass('pagamento')}>
                    3. Transporte e Pagamento
                  </button>
                </nav>
              </div>

              <div className="mb-8">
                {activeTab === 'destinatario' && <TabDestinatario />}
                {activeTab === 'produtos' && <TabProdutos />}
                {activeTab === 'pagamento' && <div className="p-8 bg-white text-center text-gray-500">Aba de pagamento...</div>}
              </div>

               <div className="flex justify-between mt-4 py-4 border-t border-gray-200">
                  <button type="button" onClick={() => setActiveTab('destinatario')} className="px-4 py-2 border border-gray-300 rounded-md bg-white">
                    ← Anterior
                  </button>
                  <button type="button" onClick={() => setActiveTab('produtos')} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Próximo Passo →
                  </button>
               </div>
            </div>

            <div className="lg:col-span-1">
               <TotaisSidebar />
            </div>
            
          </form>
        </FormProvider>
      </main>
    </div>
  );
}