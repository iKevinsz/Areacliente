'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Switch } from '@headlessui/react';
import { NumericFormat } from 'react-number-format';
import { PhotoIcon } from '@heroicons/react/24/solid';

// --- Schema de Validação Zod ---
const productSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  grupo: z.string().min(1, 'Selecione um grupo'),
  ativo: z.boolean(),
  disponivelCardapio: z.boolean(),
  permiteComplemento: z.boolean(),
  imagem: z.any().optional(),
  custo: z.string().min(1, 'Informe o custo'),
  venda: z.string().min(1, 'Informe o valor de venda'),
  // Novo campo de estoque. Usamos string para facilitar integração com NumericFormat
  // Se precisar apenas de inteiros, a validação pode ser ajustada.
  estoque: z.string().min(1, 'Informe o estoque inicial'),
});

type ProductFormData = z.infer<typeof productSchema>;

// Dados simulados de grupos
const initialGroups = [
  { id: '1', name: 'BOLACHAS E DOCES' },
  { id: '2', name: 'CIGARRO' },
  { id: '3', name: 'INSUMOS' },
];

// Componente Reutilizável para o Switch
type SwitchFieldProps = {
  control: any;
  name: keyof ProductFormData;
  label: string;
};

const SwitchField = ({ control, name, label }: SwitchFieldProps) => (
  <div className="flex items-center justify-between py-2">
    <span className="flex-grow flex flex-col">
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </span>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Switch
          checked={value as boolean}
          onChange={onChange}
          className={`${
            value ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden="true"
            className={`${
              value ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      )}
    />
  </div>
);


export default function NewProductPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ativo: true,
      disponivelCardapio: true,
      permiteComplemento: false,
      custo: '',
      venda: '',
      estoque: '0', // Valor padrão para o estoque
    },
  });

  // --- Dropzone para Imagem ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('imagem', file);
      setPreview(URL.createObjectURL(file));
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/bmp': [],
    },
    maxSize: 1024 * 1024, // 1MB
    multiple: false,
  });

  // --- Gerenciamento de Grupos ---
  const handleGroupSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'new-group') {
      setIsCreatingGroup(true);
      setValue('grupo', '');
    } else {
      setIsCreatingGroup(false);
    }
  };

  const handleSaveNewGroup = () => {
    if (newGroupName.trim() === '') {
      alert('Por favor, insira um nome para o grupo.');
      return;
    }
    const newGroup = { id: Date.now().toString(), name: newGroupName };
    setGroups([...groups, newGroup]);
    setValue('grupo', newGroup.id);
    setIsCreatingGroup(false);
    setNewGroupName('');
  };

  const handleCancelCreateGroup = () => {
    setIsCreatingGroup(false);
    setNewGroupName('');
    setValue('grupo', '');
  };

  // --- Submissão do Formulário ---
  const onSubmit = (data: ProductFormData) => {
    // Nota: 'custo', 'venda' e 'estoque' chegam aqui como strings (ex: "1234.56" ou "10").
    // Lembre-se de convertê-los para números antes de enviar ao backend se necessário.
    // Ex: const estoqueNumerico = parseFloat(data.estoque);
    console.log('Dados do Produto:', data);
    alert('Produto salvo com sucesso! Verifique o console.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header e Sidebar simulados baseados nas imagens */}
      <header className="bg-white shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
           <div className="flex items-center gap-4">
            <span className="text-gray-500">Suporte: DATACAIXA TECNOLOGIA</span>
            <span className="text-gray-500">+55 (11) 99999-9999</span>
           </div>
           <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18V15.75ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18V15.75Z" /></svg>
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            </div>
           </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-gray-500 font-normal">Cardápio Digital / Produtos /</span> Novo Produto
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda: Informações do Produto */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Produto</h2>
              <div className="space-y-4">
                {/* Descrição */}
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="descricao"
                    {...register('descricao')}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.descricao ? 'border-red-500' : ''}`}
                    placeholder="Ex: Bolacha Recheada"
                  />
                  {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>}
                </div>

                {/* Grupo (com opção de adicionar novo) */}
                <div>
                  <label htmlFor="grupo" className="block text-sm font-medium text-gray-700">
                    Grupo
                  </label>
                  {isCreatingGroup ? (
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Nome do novo grupo"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNewGroup}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-none border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelCreateGroup}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <select
                      id="grupo"
                      {...register('grupo')}
                      onChange={(e) => {
                        register('grupo').onChange(e);
                        handleGroupSelectChange(e);
                      }}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.grupo ? 'border-red-500' : ''}`}
                    >
                      <option value="">Selecione um grupo</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                      <option value="new-group" className="font-semibold text-blue-600">
                        + Cadastrar novo grupo
                      </option>
                    </select>
                  )}
                  {errors.grupo && <p className="mt-1 text-sm text-red-600">{errors.grupo.message}</p>}
                </div>

                {/* Opções (Switches) */}
                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  <SwitchField control={control} name="ativo" label="Produto Ativo" />
                  <SwitchField control={control} name="disponivelCardapio" label="Disponível no Cardápio Digital" />
                  <SwitchField control={control} name="permiteComplemento" label="Permitir Complementos" />
                </div>
                
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Imagem e Detalhes */}
          <div className="space-y-6">
            {/* Upload de Imagem */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagem</h2>
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image src={preview} alt="Pré-visualização" fill className="object-contain rounded-md" />
                    </div>
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Carregar Imagem</span>
                      <input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">JPG, BMP ou PNG. Máx 1MB.</p>
                </div>
              </div>
            </div>

            {/* Detalhes (Valores e Estoque) */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Custo */}
                <div>
                  <label htmlFor="custo" className="block text-sm font-medium text-gray-700">
                    Custo
                  </label>
                  <Controller
                    control={control}
                    name="custo"
                    render={({ field: { onChange, name, value } }) => (
                      <NumericFormat
                        value={value}
                        onValueChange={(values) => {
                          onChange(values.value);
                        }}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={'R$ '}
                        decimalScale={2}
                        fixedDecimalScale
                        name={name}
                        id="custo"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.custo ? 'border-red-500' : ''}`}
                        placeholder="R$ 0,00"
                      />
                    )}
                  />
                   {errors.custo && <p className="mt-1 text-sm text-red-600">{errors.custo.message}</p>}
                </div>

                {/* Venda */}
                <div>
                  <label htmlFor="venda" className="block text-sm font-medium text-gray-700">
                    Venda
                  </label>
                  <Controller
                    control={control}
                    name="venda"
                    render={({ field: { onChange, name, value } }) => (
                      <NumericFormat
                        value={value}
                        onValueChange={(values) => {
                          onChange(values.value);
                        }}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix={'R$ '}
                        decimalScale={2}
                        fixedDecimalScale
                        name={name}
                        id="venda"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.venda ? 'border-red-500' : ''}`}
                        placeholder="R$ 0,00"
                      />
                    )}
                  />
                  {errors.venda && <p className="mt-1 text-sm text-red-600">{errors.venda.message}</p>}
                </div>

                {/* Estoque (Novo Campo) */}
                <div className="col-span-2">
                  <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">
                    Estoque Inicial
                  </label>
                  <Controller
                    control={control}
                    name="estoque"
                    render={({ field: { onChange, name, value } }) => (
                      <NumericFormat
                        value={value}
                        onValueChange={(values) => {
                          // Salva o valor puro (ex: "1500.50")
                          onChange(values.value);
                        }}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={3} // Permite até 3 casas decimais (ex: Kg, Litros)
                        fixedDecimalScale={false} // Não força os decimais se não forem digitados
                        allowNegative={false}
                        name={name}
                        id="estoque"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.estoque ? 'border-red-500' : ''}`}
                        placeholder="0"
                      />
                    )}
                  />
                  {errors.estoque && <p className="mt-1 text-sm text-red-600">{errors.estoque.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação (Rodapé do Formulário) */}
          <div className="lg:col-span-3 flex justify-end gap-4 border-t border-gray-200 pt-6">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}