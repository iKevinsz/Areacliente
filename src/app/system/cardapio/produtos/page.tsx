// app/produtos/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Edit3, Trash2, Search, Package, Plus, X, Save, Upload, AlertTriangle, SlidersHorizontal, ArrowRightLeft, CheckCircle } from 'lucide-react';

// --- INTERFACES ---

interface Variation {
  id: string;
  name: string;
  price: number;
  cost: number;
}

interface Product {
  id: number;
  description: string;
  group: string;
  image: string;
  
  cost: number;
  price: number;

  hasVariations: boolean;
  variations: Variation[];

  active: boolean;
  allowsComplements: boolean;
  isAvailableOnline: boolean;
  isVisibleOnline: boolean;
}

// --- DADOS INICIAIS ---
const initialData: Product[] = [
  { 
    id: 1001, description: 'X-Burguer Clássico', group: 'LANCHES', image: 'https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/7290/64cebbbf5e9386fmo7.webp', 
    cost: 5.50, price: 18.00, hasVariations: false, variations: [],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 1002, description: 'X-Salada', group: 'LANCHES', image: 'https://www.sabornamesa.com.br/media/k2/items/cache/b9ad772005653afce4d4bd46c2efe842_XL.jpg', 
    cost: 6.00, price: 22.00, hasVariations: false, variations: [],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 1003, description: 'X-Bacon Artesanal', group: 'LANCHES', image: 'https://embutidosbonatti.ind.br/temp/xxx-57-1920x1080m1.jpg', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'v1', name: 'Carne 150g', price: 28.00, cost: 9.00 },
        { id: 'v2', name: 'Carne Dupla (300g)', price: 36.00, cost: 14.00 }
    ],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 1004, description: 'X-Tudo Monstro', group: 'LANCHES', image: 'https://img.freepik.com/fotos-gratis/hamburguer-de-vista-frontal-em-um-carrinho_141793-15542.jpg', 
    cost: 12.00, price: 35.00, hasVariations: false, variations: [],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 2001, description: 'Pizza Calabresa', group: 'PIZZAS', image: 'https://cdn0.tudoreceitas.com/pt/posts/9/8/3/pizza_calabresa_e_mussarela_4389_600_square.jpg', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'p1', name: 'Broto (4 fatias)', price: 30.00, cost: 8.00 },
        { id: 'p2', name: 'Média (6 fatias)', price: 42.00, cost: 12.00 },
        { id: 'p3', name: 'Grande (8 fatias)', price: 55.00, cost: 15.00 }
    ],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 2002, description: 'Pizza Portuguesa', group: 'PIZZAS', image: 'https://www.ogastronomo.com.br/upload/389528334-curiosidades-sobre-a-pizza-portuguesa.jpg', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'p4', name: 'Média', price: 45.00, cost: 14.00 },
        { id: 'p5', name: 'Grande', price: 60.00, cost: 18.00 }
    ],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 2003, description: 'Pizza 4 Queijos', group: 'PIZZAS', image: 'https://redefoodservice.com.br/wp-content/uploads/2023/07/Pizza-Quatro-Queijos.jpg', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'p6', name: 'Grande', price: 62.00, cost: 20.00 }
    ],
    active: true, allowsComplements: true, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 3001, description: 'Coca-Cola', group: 'BEBIDAS', image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'b1', name: 'Lata 350ml', price: 6.00, cost: 2.50 },
        { id: 'b2', name: '600ml', price: 9.00, cost: 3.80 },
        { id: 'b3', name: '2 Litros', price: 14.00, cost: 7.00 }
    ],
    active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 3002, description: 'Guaraná Antarctica', group: 'BEBIDAS', image: 'https://io.convertiez.com.br/m/farmaponte/shop/products/images/29484/large/refrigerante-guarana-antarctica-lata-350ml_25905.webp', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'b4', name: 'Lata 350ml', price: 5.50, cost: 2.30 },
        { id: 'b5', name: '2 Litros', price: 12.00, cost: 6.50 }
    ],
    active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true 
  },
  { 
    id: 3003, description: 'Suco de Laranja Natural', group: 'BEBIDAS', image: 'https://static.itdg.com.br/images/640-440/44bee4fafd686bffc939aeeb85022a94/shutterstock-289335989-1-.jpg', 
    cost: 0, price: 0, hasVariations: true,
    variations: [
        { id: 'b6', name: 'Copo 300ml', price: 8.00, cost: 2.00 },
        { id: 'b7', name: 'Jarra 1L', price: 20.00, cost: 5.00 }
    ],
    active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true 
  },
];

// --- COMPONENTE TOGGLE SWITCH ---
const ToggleSwitch = ({ label, checked, onChange, color = "bg-blue-600", disabled = false, small = false }: { label: string, checked: boolean, onChange: () => void, color?: string, disabled?: boolean, small?: boolean }) => (
  <div 
    onClick={!disabled ? onChange : undefined}
    className={`flex items-center justify-between ${small ? 'p-0' : 'p-3 border border-gray-100 bg-gray-50'} rounded-lg transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-80'}`} 
  >
    <span className={`font-medium text-gray-700 ${small ? 'text-xs mr-3' : 'text-sm'}`}>{label}</span>
    <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? color : 'bg-gray-300'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
  </div>
);

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais Principais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Estados de Controle
  const [editingId, setEditingId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Estados para exclusão de variação
  const [variationToDelete, setVariationToDelete] = useState<string | null>(null);
  const [isVariationDeleteModalOpen, setIsVariationDeleteModalOpen] = useState(false);

  // Formulário
  const [formData, setFormData] = useState<Product>({
    id: 0, description: '', group: '', image: '',
    cost: 0, price: 0,
    hasVariations: false, variations: [],
    active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true,
  });

  const [errors, setErrors] = useState({ description: '', group: '', price: '' });

  const uniqueGroups = useMemo(() => {
    const groups = products.map(p => p.group);
    return Array.from(new Set(groups)).sort();
  }, [products]);

  // --- EFEITO: FECHAR MODAL DE SUCESSO AUTOMATICAMENTE ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccessModalOpen) {
      timer = setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 4000); // 4000 milissegundos = 4 segundos
    }
    // Cleanup: Limpa o timer se o componente desmontar ou se o modal fechar antes
    return () => clearTimeout(timer);
  }, [isSuccessModalOpen]);

  // --- HANDLERS ---
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getPriceDisplay = (product: Product) => {
    if (product.hasVariations && product.variations.length > 0) {
      const minPrice = Math.min(...product.variations.map(v => v.price));
      const maxPrice = Math.max(...product.variations.map(v => v.price));
      
      return (
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase">A partir de</span>
            <span className="font-bold text-gray-900 text-lg">{formatCurrency(minPrice)}</span>
            {minPrice !== maxPrice && (
                <span className="text-[10px] text-gray-400">até {formatCurrency(maxPrice)}</span>
            )}
        </div>
      );
    }
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase">Preço</span>
            <span className="font-bold text-gray-900 text-lg">{formatCurrency(product.price)}</span>
        </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // --- LÓGICA DE VARIAÇÕES ---
  const addVariation = () => {
    setFormData(prev => ({
        ...prev,
        variations: [...prev.variations, { id: Math.random().toString(36).substr(2, 9), name: '', price: 0, cost: 0 }]
    }));
  };

  const openVariationDeleteModal = (id: string) => {
    setVariationToDelete(id);
    setIsVariationDeleteModalOpen(true);
  };

  const confirmRemoveVariation = () => {
    if (variationToDelete) {
        setFormData(prev => ({ ...prev, variations: prev.variations.filter(v => v.id !== variationToDelete) }));
        setIsVariationDeleteModalOpen(false);
        setVariationToDelete(null);
    }
  };

  const updateVariation = (id: string, field: keyof Variation, value: string | number) => {
    setFormData(prev => ({
        ...prev,
        variations: prev.variations.map(v => v.id === id ? { ...v, [field]: value } : v)
    }));
  };

  // --- CRUD PRODUTOS ---
  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
        id: 0, description: '', group: '', image: '', cost: 0, price: 0,
        hasVariations: false, variations: [],
        active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true
    });
    setErrors({ description: '', group: '', price: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setErrors({ description: '', group: '', price: '' });
    setIsModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (idToDelete !== null) {
      setProducts(products.filter(p => p.id !== idToDelete));
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { description: '', group: '', price: '' };

    if (!formData.description.trim()) { newErrors.description = 'O nome é obrigatório.'; isValid = false; }
    if (!formData.group.trim()) { newErrors.group = 'Selecione uma categoria.'; isValid = false; }
    
    if (!formData.hasVariations) {
        if (formData.price <= 0) { newErrors.price = 'Preço obrigatório.'; isValid = false; }
    } else {
        if (formData.variations.length === 0) {
            newErrors.price = 'Adicione ao menos uma variação.'; isValid = false;
        } else {
            if (formData.variations.some(v => !v.name || v.price <= 0)) {
                newErrors.price = 'Preencha nome e preço das variações.'; isValid = false;
            }
        }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      setProducts([{ ...formData, id: Math.floor(Math.random() * 10000) }, ...products]);
    }
    setIsModalOpen(false);
    setIsSuccessModalOpen(true); // ABRE MODAL DE SUCESSO
  };

  const filteredProducts = products.filter(p => 
    p.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(
        searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
  );

  return (
    <div className="p-4 md:p-10 font-sans min-h-full relative bg-gray-50/50">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogo de Produtos</h1>
          <p className="text-gray-500 text-sm">Gerencie preços, variações e estoque.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
          >
            <Plus size={20} /> <span className="hidden sm:inline font-medium text-sm">Novo Produto</span>
          </button>
        </div>
      </div>

      {/* GRID LISTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`group bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col ${!product.active ? 'opacity-70 border-gray-200' : 'border-gray-100'}`}>
            <div className="flex justify-between items-start p-3 md:p-4 pb-0">
              <span className="text-xs font-mono text-gray-400">#{product.id}</span>
              <div className="flex gap-1">
                 {!product.isAvailableOnline && <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">Esgotado</span>}
                 <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {product.active ? 'Ativo' : 'Inativo'}
                 </span>
              </div>
            </div>
            
            {/* IMAGEM GRID PADRONIZADA */}
            <div className="w-full h-48 bg-white p-4 flex items-center justify-center relative overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.description} 
                  className={`w-full h-full object-contain transition-transform duration-300 ${product.active ? 'group-hover:scale-105' : 'grayscale'}`} 
                />
              ) : (
                <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center text-gray-300"><Package size={40} /></div>
              )}
              {product.hasVariations && (
                  <div className="absolute bottom-2 left-2 bg-blue-600/90 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <ArrowRightLeft size={10} /> Variações
                  </div>
              )}
            </div>

            <div className="p-3 md:p-4 pt-0 flex-1 flex flex-col">
              <div className="mb-4">
                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">{product.group}</span>
                <h3 className="font-bold text-gray-800 text-base mt-1 leading-tight truncate" title={product.description}>{product.description}</h3>
              </div>
              
              <div className="mt-auto border-t border-gray-50 pt-3 flex justify-between items-end">
                {getPriceDisplay(product)}
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => { setIsDeleteModalOpen(true); setIdToDelete(product.id); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FORMULÁRIO (PRODUTO) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {editingId ? <Edit3 size={20} className="text-blue-600"/> : <Plus size={20} className="text-blue-600"/>}
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto custom-scrollbar">
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.description ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Ex: Pizza Calabresa Especial"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <select 
                        className={`w-full px-4 py-2 border rounded-lg bg-white outline-none ${errors.group ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
                        value={formData.group}
                        onChange={e => setFormData({...formData, group: e.target.value})}
                    >
                        <option value="">Selecione...</option>
                        {uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
                </div>
              </div>

              {/* --- PREÇIFICAÇÃO --- */}
              <div className="border rounded-xl mb-6 bg-white border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-1 rounded"><SlidersHorizontal size={14}/></span> Preçificação
                    </h3>
                    
                    <div className="flex items-center">
                       <ToggleSwitch 
                          small
                          label={formData.hasVariations ? "Com Variações" : "Preço Único"} 
                          checked={formData.hasVariations} 
                          onChange={() => setFormData(prev => ({ ...prev, hasVariations: !prev.hasVariations }))}
                          color="bg-blue-600"
                        />
                    </div>
                </div>

                <div className="p-4">
                  {!formData.hasVariations ? (
                      /* MODO PREÇO ÚNICO */
                      <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Preço Venda *</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-400 text-sm">R$</span>
                                  <input 
                                    type="number" step="0.01"
                                    className={`w-full pl-9 pr-2 py-2 border rounded-lg outline-none ${errors.price ? 'border-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
                                    value={isNaN(formData.price) ? '' : formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                  />
                              </div>
                              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Preço Custo</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-2 text-gray-400 text-sm">R$</span>
                                  <input 
                                    type="number" step="0.01"
                                    className="w-full pl-9 pr-2 py-2 border border-gray-200 rounded-lg outline-none focus:ring-blue-500"
                                    value={isNaN(formData.cost) ? '' : formData.cost}
                                    onChange={e => setFormData({...formData, cost: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                  />
                              </div>
                          </div>
                      </div>
                  ) : (
                      /* MODO VARIAÇÕES */
                      <div className="animate-in slide-in-from-top-2 duration-200 space-y-3">
                          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-700 mb-3 flex gap-2">
                             <AlertTriangle size={14} className="shrink-0 mt-0.5"/> 
                             Defina os tamanhos ou tipos deste produto (Ex: P, M, G ou Lata, 600ml).
                          </div>

                          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                               {formData.variations.map((item) => (
                                  <div key={item.id} className="flex gap-2 items-end bg-white p-2 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                                      <div className="flex-1">
                                          <label className="text-[10px] text-gray-400 font-medium">Nome</label>
                                          <input 
                                              type="text" 
                                              placeholder="Ex: Grande"
                                              className="w-full border-b border-gray-200 py-1 text-sm focus:border-blue-500 outline-none bg-transparent"
                                              value={item.name}
                                              onChange={(e) => updateVariation(item.id, 'name', e.target.value)}
                                          />
                                      </div>
                                      <div className="w-24">
                                          <label className="text-[10px] text-gray-400 font-medium">Preço</label>
                                          <input 
                                              type="number" step="0.01"
                                              className="w-full border-b border-gray-200 py-1 text-sm focus:border-blue-500 outline-none font-medium bg-transparent"
                                              value={isNaN(item.price) ? '' : item.price}
                                              onChange={(e) => {
                                                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                  updateVariation(item.id, 'price', val);
                                              }}
                                          />
                                      </div>
                                      <div className="w-20">
                                          <label className="text-[10px] text-gray-400 font-medium">Custo</label>
                                          <input 
                                              type="number" step="0.01"
                                              className="w-full border-b border-gray-200 py-1 text-sm focus:border-blue-500 outline-none text-gray-500 bg-transparent"
                                              value={isNaN(item.cost) ? '' : item.cost}
                                              onChange={(e) => {
                                                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                  updateVariation(item.id, 'cost', val);
                                              }}
                                          />
                                      </div>
                                      <button 
                                          type="button" 
                                          onClick={() => openVariationDeleteModal(item.id)}
                                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                          title="Remover variação"
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                               ))}
                          </div>
                          
                          {errors.price && <p className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle size={12}/> {errors.price}</p>}

                          <button 
                              type="button" 
                              onClick={addVariation}
                              className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                              <Plus size={16} /> Adicionar Nova Variação
                          </button>
                      </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors relative cursor-pointer group h-48">
                        <div className="space-y-1 text-center flex flex-col items-center justify-center h-full w-full">
                            {formData.image ? (
                                <div className="relative w-full h-full">
                                    <img src={formData.image} alt="Preview" className="mx-auto w-full h-full object-contain" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                        <span className="text-white text-sm font-medium">Trocar Imagem</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <span className="text-sm text-blue-600 font-medium">Clique para enviar</span>
                                </>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload}/>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 border-b pb-1">Configurações</h3>
                    <ToggleSwitch label="Produto Ativo" checked={formData.active} onChange={() => setFormData({...formData, active: !formData.active})} color="bg-green-600"/>
                    <ToggleSwitch label="Permitir Complemento" checked={formData.allowsComplements} onChange={() => setFormData({...formData, allowsComplements: !formData.allowsComplements})} />
                    <ToggleSwitch label="Disponível (Estoque)" checked={formData.isAvailableOnline} onChange={() => setFormData({...formData, isAvailableOnline: !formData.isAvailableOnline})} />
                    <ToggleSwitch label="Visível Online" checked={formData.isVisibleOnline} onChange={() => setFormData({...formData, isVisibleOnline: !formData.isVisibleOnline})} />
                 </div>
              </div>

              {/* Footer */}
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all">
                  <Save size={18} /> Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE SUCESSO --- */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sucesso!</h3>
            <p className="text-gray-500 text-sm mb-6">O produto foi salvo corretamente no catálogo.</p>
            <button 
              onClick={() => setIsSuccessModalOpen(false)} 
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/20"
            >
              OK, Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL EXCLUSÃO DE PRODUTO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Excluir Produto?</h3>
            <p className="text-gray-500 text-sm mb-6">Tem certeza que deseja remover este item do catálogo?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={confirmDeleteProduct} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-600/20 transition-colors">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOVO MODAL: EXCLUSÃO DE VARIAÇÃO --- */}
      {isVariationDeleteModalOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Excluir Variação?</h3>
            <p className="text-gray-500 text-sm mb-6">Tem certeza que deseja remover esta variação de preço?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsVariationDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={confirmRemoveVariation} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-600/20 transition-colors">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}