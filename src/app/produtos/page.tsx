// app/produtos/page.tsx
'use client';

import React, { useState } from 'react';
import { Edit3, Trash2, Search, Package, Filter, Plus, X, Save, Upload, AlertCircle, AlertTriangle } from 'lucide-react';

// 1. Definição do Tipo Produto
interface Product {
  id: number;
  description: string;
  group: string;
  image: string; 
  cost: number;
  price: number;
  active: boolean;
}

// 2. Dados de Exemplo (Mock Inicial)
const initialData: Product[] = [
  { id: 1315, description: 'X-Burguer', group: 'LANCHES', image: 'https://thumb-cdn.soluall.net/prod/shp_products/sp1280fw/5d41dff8-9c08-46e2-abae-5e55ac1e023c/5d41dff8-8e1c-4562-a6b6-5e55ac1e023c.png', cost: 3.26, price: 5.00, active: true },
  { id: 1314, description: 'X-Bacon', group: 'LANCHES', image: 'https://imagens.jotaja.com/produtos/15399aa8-5d10-4941-92b5-6f52a7c6b200.jpg', cost: 0.55, price: 1.00, active: true },
  { id: 1313, description: 'X-Salada', group: 'LANCHES', image: 'https://static.codepill.com.br/domains/7e4e09e5-31af-44d5-bd1e-428319709832/products/gallery_6a868b45-ddf4-4a4f-b030-dd9172b363fb.jpg', cost: 3.49, price: 0.00, active: true },
  { id: 1312, description: 'X-Frango', group: 'LANCHES', image: 'https://sachefmio.blob.core.windows.net/fotos/x-frango-73524.jpg', cost: 8.28, price: 9.00, active: true },
  { id: 1311, description: 'X-Egg', group: 'LANCHES', image: 'https://imagens.jotaja.com/produtos/118/E18A6769A90343220835A84A08159D24F9E236BE33D1FBB0EE60ADA658FA4183.jpeg', cost: 7.36, price: 8.00, active: false },
  { id: 1310, description: 'Coca Cola', group: 'REFRIGERANTES', image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg', cost: 8.29, price: 9.00, active: true },
  { id: 1309, description: 'Guaraná Antártica', group: 'REFRIGERANTES', image: 'https://anossadrogaria.vtexassets.com/arquivos/ids/3997667/982898_00.webp?v=638890731879970000', cost: 8.98, price: 9.75, active: true },
  { id: 1308, description: 'Pepsi', group: 'REFRIGERANTES', image: 'https://zaffari.vtexassets.com/arquivos/ids/279550/1045475-00.jpg?v=638845699815630000', cost: 11.05, price: 12.00, active: true },
];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Controles de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Estados de Controle de Edição/Exclusão
  const [editingId, setEditingId] = useState<number | null>(null); // Se tiver ID, é edição. Se null, é novo.
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    description: '',
    group: '',
    cost: '',
    price: '',
    image: ''
  });

  // Estado de Erros
  const [errors, setErrors] = useState({
    description: '',
    group: '',
    price: ''
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const normalizeText = (text: string) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- AÇÕES DO USUÁRIO ---

  // 1. Abrir modal para NOVO produto
  const handleOpenNew = () => {
    setEditingId(null); // Garante que não é edição
    setFormData({ description: '', group: '', cost: '', price: '', image: '' }); // Limpa form
    setErrors({ description: '', group: '', price: '' });
    setIsModalOpen(true);
  };

  // 2. Abrir modal para EDITAR produto
  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id); // Salva o ID que estamos editando
    setFormData({
      description: product.description,
      group: product.group,
      cost: product.cost.toString(),
      price: product.price.toString(),
      image: product.image
    });
    setErrors({ description: '', group: '', price: '' });
    setIsModalOpen(true);
  };

  // 3. Abrir modal para EXCLUIR produto
  const handleOpenDelete = (id: number) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 4. Confirmar EXCLUSÃO
  const confirmDelete = () => {
    if (idToDelete !== null) {
      setProducts(products.filter(p => p.id !== idToDelete));
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  // 5. Validação do Form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { description: '', group: '', price: '' };

    if (!formData.description.trim()) { newErrors.description = 'O nome é obrigatório.'; isValid = false; }
    if (!formData.group.trim()) { newErrors.group = 'A categoria é obrigatória.'; isValid = false; }
    if (!formData.price || parseFloat(formData.price) <= 0) { newErrors.price = 'Preço obrigatório.'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  // 6. SALVAR (Serve tanto para Criar quanto para Editar)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Dados base do formulário
    const productData = {
      description: formData.description,
      group: formData.group,
      image: formData.image,
      cost: parseFloat(formData.cost) || 0,
      price: parseFloat(formData.price),
      active: true
    };

    if (editingId) {
      // --- MODO EDIÇÃO: Atualiza o item existente ---
      setProducts(products.map(p => 
        p.id === editingId ? { ...p, ...productData } : p
      ));
    } else {
      // --- MODO CRIAÇÃO: Adiciona novo item ---
      const newId = Math.floor(Math.random() * 10000);
      setProducts([{ id: newId, ...productData }, ...products]);
    }

    setIsModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const filteredProducts = products.filter(p => {
    const normalizedDescription = normalizeText(p.description);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedDescription.includes(normalizedSearch);
  });

  return (
    <div className="p-4 md:p-10 font-sans min-h-full relative">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Produtos Cadastrados</h1>
          <p className="text-gray-500 text-xs md:text-sm">Gerencie seus produtos</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar produto..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm shrink-0">
            <Filter size={18} />
          </button>

          <button 
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
          >
            <Plus size={20} />
            <span className="hidden sm:inline font-medium text-sm">Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            <div className="flex justify-between items-start p-3 md:p-4 pb-0">
              <span className="text-xs font-mono text-gray-400">#{product.id}</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="h-28 md:h-32 w-full flex items-center justify-center p-4">
              {product.image ? (
                <img src={product.image} alt={product.description} className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center text-gray-300"><Package size={32} /></div>
              )}
            </div>
            <div className="p-3 md:p-4 pt-0 flex-1 flex flex-col">
              <div className="mb-4">
                <span className="text-[10px] md:text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{product.group}</span>
                <h3 className="font-bold text-gray-800 text-base md:text-lg mt-2 leading-tight truncate" title={product.description}>{product.description}</h3>
              </div>
              <div className="mt-auto border-t border-gray-50 pt-3 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-xs text-gray-400">Custo: {formatCurrency(product.cost)}</span>
                  <span className="font-bold text-gray-900 text-base md:text-lg">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex gap-1 md:gap-2">
                  {/* BOTÃO EDITAR */}
                  <button 
                    onClick={() => handleOpenEdit(product)}
                    className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  {/* BOTÃO EXCLUIR */}
                  <button 
                    onClick={() => handleOpenDelete(product.id)}
                    className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

       {/* Paginação */}
       <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 pb-8">
        <p>Mostrando {filteredProducts.length} registros</p>
        <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 bg-white">Anterior</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 bg-white">Próximo</button>
        </div>
      </div>

      {/* --- MODAL DE FORMULÁRIO (CRIAR / EDITAR) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.description ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.group ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
                    value={formData.group}
                    onChange={e => handleInputChange('group', e.target.value)}
                  />
                  {errors.group && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.group}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Venda <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 text-sm">R$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className={`w-full pl-9 pr-4 py-2 border rounded-lg outline-none transition-all ${errors.price ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
                          value={formData.price}
                          onChange={e => handleInputChange('price', e.target.value)}
                        />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Custo</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 text-sm">R$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.cost}
                          onChange={e => handleInputChange('cost', e.target.value)}
                        />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative cursor-pointer group">
                    <div className="space-y-1 text-center">
                        {formData.image ? (
                            <div className="relative">
                                <img src={formData.image} alt="Preview" className="mx-auto h-32 object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                    <span className="text-white text-sm font-medium">Trocar Imagem</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                        <span>Clique para enviar</span>
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF até 5MB</p>
                            </>
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload}/>
                    </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                  <Save size={18} />
                  {editingId ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center">
            
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Excluir Produto?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Você tem certeza que deseja remover este item? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20"
              >
                Sim, Excluir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}