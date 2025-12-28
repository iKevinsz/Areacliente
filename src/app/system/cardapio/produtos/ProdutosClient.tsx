'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation'; 
import { Edit3, Trash2, Search, Package, Plus, X, Save, Upload, AlertTriangle, SlidersHorizontal, ArrowRightLeft, CheckCircle, PlusCircle, DollarSign, Tag, Check, Image as ImageIcon } from 'lucide-react';
import { saveProduct, deleteProduct } from '@/app/actions'; 

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

interface DatabaseProduct {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number; 
  categoria: string | null;
  estoque: number;
  imagem: string | null;
  ativo: boolean;
  permiteComplemento?: boolean; 
  visivelOnline?: boolean;     
  grupoId: number | null;
  criadoEm: Date;
  atualizadoEm: Date;
  variacoes?: { id: number; nome: string; preco: number }[]; 
}

interface DatabaseGroup {
  id: number;
  nome: string;
  variacoes: { id: number; nome: string }[]; 
}

interface ProdutosClientProps {
  produtos: DatabaseProduct[];
  gruposDisponiveis: DatabaseGroup[];
}

export default function ProdutosClient({ produtos, gruposDisponiveis }: ProdutosClientProps) {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false); 

  const convertedProducts: Product[] = produtos.map(dbProduct => ({
    id: dbProduct.id,
    description: dbProduct.nome,
    group: dbProduct.categoria || 'Geral',
    image: dbProduct.imagem || '',
    cost: 0, 
    price: Number(dbProduct.preco),
    hasVariations: dbProduct.variacoes && dbProduct.variacoes.length > 0, 
    variations: dbProduct.variacoes ? dbProduct.variacoes.map(v => ({
        id: v.id.toString(),
        name: v.nome,
        price: Number(v.preco),
        cost: 0
    })) : [],
    active: dbProduct.ativo,
    allowsComplements: dbProduct.permiteComplemento || false,
    isAvailableOnline: dbProduct.estoque > 0,
    isVisibleOnline: dbProduct.visivelOnline !== false 
  }));

  const [products, setProducts] = useState<Product[]>(convertedProducts);
  
  useEffect(() => {
    setProducts(convertedProducts);
  }, [produtos]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [variationToDelete, setVariationToDelete] = useState<string | null>(null);
  const [isVariationDeleteModalOpen, setIsVariationDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState<Product>({
    id: 0, description: '', group: '', image: '',
    cost: 0, price: 0,
    hasVariations: false, variations: [],
    active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true,
  });

  const [errors, setErrors] = useState({ description: '', group: '', price: '' });

  const selectedGroupData = useMemo(() => {
    return gruposDisponiveis.find(g => g.nome === formData.group);
  }, [formData.group, gruposDisponiveis]);

  const availableVariations = selectedGroupData?.variacoes || [];

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroup = e.target.value;
    const groupData = gruposDisponiveis.find(g => g.nome === selectedGroup);
    if (!editingId && groupData && groupData.variacoes && groupData.variacoes.length > 0) {
        setFormData(prev => ({
            ...prev,
            group: selectedGroup,
            hasVariations: true,
            variations: groupData.variacoes.map(v => ({
                id: Math.random().toString(36),
                name: v.nome,
                price: 0,
                cost: 0
            }))
        }));
    } else {
        setFormData(prev => ({ ...prev, group: selectedGroup, variations: [] }));
    }
  };

  const ToggleSwitch = ({ label, checked, onChange, color = "bg-blue-600", disabled = false, small = false }: any) => (
    <div onClick={!disabled ? onChange : undefined} className={`flex items-center justify-between ${small ? 'p-0' : 'py-2'} transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}>
      <span className={`font-medium text-gray-700 ${small ? 'text-xs mr-3' : 'text-sm'}`}>{label}</span>
      <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? color : 'bg-gray-300'}`}>
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
      </div>
    </div>
  );

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getPriceDisplay = (product: Product) => {
    if (product.hasVariations && product.variations.length > 0) {
        const minPrice = Math.min(...product.variations.map(v => v.price));
        return (
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-medium uppercase leading-none mb-1">A partir de</span>
                <span className="font-bold text-gray-900 text-lg leading-none">{formatCurrency(minPrice)}</span>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium uppercase leading-none mb-1">Preço</span>
            <span className="font-bold text-gray-900 text-lg leading-none">{formatCurrency(product.price)}</span>
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

  const addVariation = () => {
    if (availableVariations.length === 0) return;
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

  const handleOpenNew = () => {
    setEditingId(null);
    const defaultGroup = gruposDisponiveis.length > 0 ? gruposDisponiveis[0] : null;
    setFormData({
        id: 0, description: '', group: defaultGroup ? defaultGroup.nome : '', image: '', cost: 0, price: 0,
        hasVariations: false, variations: [], active: true, allowsComplements: false, isAvailableOnline: true, isVisibleOnline: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (idToDelete !== null) {
      setIsLoading(true);
      await deleteProduct(idToDelete); 
      router.refresh(); 
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { description: '', group: '', price: '' };

    if (!formData.description.trim()) { newErrors.description = 'O nome é obrigatório.'; isValid = false; }
    if (!formData.group) { newErrors.group = 'Selecione uma categoria.'; isValid = false; }
    
    if (formData.hasVariations) {
        if (formData.variations.length === 0) {
            newErrors.price = 'Adicione ao menos uma variação.'; isValid = false;
        }
        const hasInvalidVariation = formData.variations.some(v => !v.name);
        if (hasInvalidVariation) {
            alert("Selecione o tamanho/tipo para todas as variações.");
            return false;
        }
    } else {
        if (formData.price <= 0) {
            newErrors.price = 'Defina um preço.'; isValid = false;
        }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await saveProduct(formData);

    if (result.success) {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
        router.refresh(); 
    } else {
        alert("Erro ao salvar.");
    }
    setIsLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.group.toLowerCase().includes(searchTerm.toLowerCase())
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
            <input type="text" placeholder="Buscar por nome ou grupo..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
          <button onClick={handleOpenNew} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0 cursor-pointer">
            <Plus size={20} /> <span className="hidden sm:inline font-medium text-sm">Novo Produto</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-[99999]">
            <div className="h-full bg-blue-600 animate-pulse w-1/3 mx-auto"></div>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full ${!product.active ? 'opacity-70 grayscale-[0.5]' : ''}`}>
            <div className="w-full h-56 relative overflow-hidden bg-gray-100 shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.description} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-300"><Package size={48} /></div>
              )}
              <div className="absolute top-3 left-3">
                 <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/90 text-blue-600 shadow-sm backdrop-blur-sm">{product.group}</span>
              </div>
              <div className="absolute top-3 right-3">
                 <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${product.active ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>{product.active ? 'Ativo' : 'Inativo'}</span>
              </div>
              <div className="absolute bottom-3 left-3">
                 {product.hasVariations && (
                    <div className="bg-blue-600/90 text-white text-[10px] px-2 py-1 rounded-lg shadow-lg flex items-center gap-1.5 font-bold backdrop-blur-sm uppercase"><ArrowRightLeft size={12} /> Variações</div>
                 )}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-gray-800 text-base mb-4 line-clamp-2 leading-tight" title={product.description}>{product.description}</h3>
              <div className="mt-auto flex justify-between items-end gap-2">
                {getPriceDisplay(product)}
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(product)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 cursor-pointer"><Edit3 size={16} /></button>
                  <button onClick={() => { setIsDeleteModalOpen(true); setIdToDelete(product.id); }} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 cursor-pointer"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* MODAL DE CADASTRO/EDIÇÃO DE PRODUTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Header do Modal */}
            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  {editingId ? <Edit3 size={18} className="text-blue-600"/> : <Plus size={18} className="text-blue-600"/>}
                  {editingId ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Preencha os detalhes do item abaixo.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Modal (Scrollável) */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-8">
                
                {/* Seção 1: Dados Básicos e Imagem */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Coluna da Esquerda (Inputs) */}
                  <div className="md:col-span-8 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do Produto <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${errors.description ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium`}
                          placeholder="Ex: X-Bacon Artesanal"
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                        <Tag className="absolute left-3.5 top-3 text-gray-400" size={16}/>
                      </div>
                      {errors.description && <span className="text-xs text-red-500 mt-1">{errors.description}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoria <span className="text-red-500">*</span></label>
                        <select 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium cursor-pointer appearance-none" 
                          value={formData.group} 
                          onChange={handleGroupChange}
                        >
                          <option value="">Selecione...</option>
                          {gruposDisponiveis.map((g) => (<option key={g.id} value={g.nome}>{g.nome}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preço Base <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-gray-500 font-bold text-sm">R$</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            disabled={formData.hasVariations}
                            className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${errors.price ? 'border-red-300' : 'border-gray-200'} rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium ${formData.hasVariations ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`} 
                            value={isNaN(formData.price) ? '' : formData.price} 
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna da Direita (Upload de Imagem) */}
                  <div className="md:col-span-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Imagem</label>
                    <div className="relative h-40 w-full border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer overflow-hidden bg-gray-50">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageUpload}/>
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-blue-500 transition-colors">
                          <ImageIcon size={32} strokeWidth={1.5} />
                          <span className="text-xs font-medium mt-2">Enviar Foto</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Seção 2: Configurações (Toggles) */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-blue-600"/> Configurações de Exibição
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <ToggleSwitch label="Produto Ativo" checked={formData.active} onChange={() => setFormData({...formData, active: !formData.active})} color="bg-green-500" />
                    <ToggleSwitch label="Permitir Complementos" checked={formData.allowsComplements} onChange={() => setFormData({...formData, allowsComplements: !formData.allowsComplements})} />
                    <ToggleSwitch label="Controlar Estoque" checked={formData.isAvailableOnline} onChange={() => setFormData({...formData, isAvailableOnline: !formData.isAvailableOnline})} />
                    <ToggleSwitch label="Visível no Cardápio Online" checked={formData.isVisibleOnline} onChange={() => setFormData({...formData, isVisibleOnline: !formData.isVisibleOnline})} />
                  </div>
                </div>

                {/* Seção 3: Variações */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${formData.hasVariations ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                        <ArrowRightLeft size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">Variações de Preço</h3>
                        <p className="text-[10px] text-gray-500 leading-none">Ex: Pequeno, Médio, Grande</p>
                      </div>
                    </div>
                    <ToggleSwitch small label={formData.hasVariations ? "Ativado" : "Desativado"} checked={formData.hasVariations} onChange={() => setFormData({...formData, hasVariations: !formData.hasVariations})} />
                  </div>

                  {formData.hasVariations && (
                    <div className="p-5 animate-in slide-in-from-top-2 duration-300">
                      {availableVariations.length === 0 ? (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-700 flex gap-3 items-center">
                          <AlertTriangle size={18} className="shrink-0 text-amber-500"/> 
                          <span>Este grupo não possui variações cadastradas. Vá até a tela de <strong>Grupos</strong> para padronizar os tamanhos.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-4 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg text-xs text-blue-700">
                          <AlertTriangle size={14} className="shrink-0"/> 
                          <span>Selecione os tamanhos definidos no grupo.</span>
                        </div>
                      )}

                      <div className="space-y-3 mt-4">
                        {formData.variations.map((item) => (
                          <div key={item.id} className="flex gap-3 items-end bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-white transition-all group">
                            <div className="flex-1">
                              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 mb-1 block tracking-wider">Tamanho / Tipo</label>
                              <div className="relative">
                                <select 
                                  className="w-full bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer font-medium text-gray-700 shadow-sm"
                                  value={item.name}
                                  onChange={(e) => updateVariation(item.id, 'name', e.target.value)}
                                >
                                  <option value="" disabled>Escolher...</option>
                                  {availableVariations.map(v => (
                                    <option key={v.id} value={v.nome}>{v.nome}</option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                  <ArrowRightLeft size={14} className="rotate-90" />
                                </div>
                              </div>
                            </div>

                            <div className="w-32">
                              <label className="text-[10px] uppercase font-bold text-gray-400 ml-1 mb-1 block tracking-wider">Preço</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">R$</span>
                                <input 
                                  type="number" step="0.01"
                                  className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800 shadow-sm"
                                  value={isNaN(item.price) ? '' : item.price}
                                  onChange={(e) => updateVariation(item.id, 'price', parseFloat(e.target.value))}
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            <button 
                              type="button" 
                              onClick={() => openVariationDeleteModal(item.id)}
                              className="mb-1 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button 
                        type="button" 
                        onClick={addVariation}
                        disabled={availableVariations.length === 0}
                        className={`w-full mt-4 py-3 border-2 border-dashed rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all 
                          ${availableVariations.length === 0 
                            ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed' 
                            : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'}`}
                      >
                        <PlusCircle size={18} /> 
                        {availableVariations.length === 0 ? "Grupo sem variações padronizadas" : "Adicionar Variação"}
                      </button>
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* Footer do Modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="productForm"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Salvando...' : <><Save size={18} /> Salvar Produto</>}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modais Secundários (Sucesso, Delete, etc) permanecem iguais */}
      {isSuccessModalOpen && (<div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"><div className="bg-white rounded-2xl p-8 text-center shadow-2xl"><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle size={32}/></div><h3 className="font-bold text-xl text-gray-900">Sucesso!</h3><p className="text-gray-500 mt-2 mb-6">Produto salvo com sucesso.</p><button onClick={() => setIsSuccessModalOpen(false)} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-lg">OK, Entendido</button></div></div>)}
      
      {isDeleteModalOpen && (<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95"><div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center"><div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-600" size={32} /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Excluir Produto?</h3><p className="text-sm text-gray-500 mb-6">Esta ação não pode ser desfeita.</p><div className="flex gap-3 justify-center"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancelar</button><button onClick={confirmDeleteProduct} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors cursor-pointer">Sim, Excluir</button></div></div></div>)}

      {isVariationDeleteModalOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Remover Variação?</h3>
            <p className="text-gray-500 text-sm mb-6">Tem certeza que deseja remover esta opção de preço?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsVariationDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Cancelar</button>
              <button onClick={confirmRemoveVariation} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors cursor-pointer">Sim, Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}