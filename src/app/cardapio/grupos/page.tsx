'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, Edit3, Trash2, X, Save, 
  CheckCircle2, XCircle, Layers, ListChecks, Settings2, PlusCircle,
  GripVertical
} from 'lucide-react';

// --- Interface de Tipos ---

interface Variation {
  id: number;
  name: string;
}

interface Complement {
  id: number;
  name: string;
  price: number; 
  maxQuantity: number;
  required: boolean;
}

interface ProductGroup {
  id: number;
  sequence: number;
  description: string;
  active: boolean;
  variations: Variation[];
  complements: Complement[];
}

const initialGroups: ProductGroup[] = [
  { 
    id: 1, sequence: 1, description: 'AÇAÍ', active: true,
    variations: [{ id: 1, name: '300ml' }, { id: 2, name: '500ml' }],
    complements: [{ id: 1, name: 'Frutas', price: 0, maxQuantity: 2, required: true }]
  },
  { id: 2, sequence: 2, description: "LANCHES", active: true, variations: [], complements: [] },
  { id: 3, sequence: 3, description: 'REFRIGERANTES', active: true, variations: [], complements: [] },
  { id: 4, sequence: 4, description: 'PIZZAS', active: false, variations: [], complements: [] },
];

export default function ProductGroupsPage() {
  const [groups, setGroups] = useState<ProductGroup[]>(initialGroups);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'variacoes' | 'complementos'>('geral');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    sequence: '',
    description: '',
    active: true,
    variations: [] as Variation[],
    complements: [] as Complement[]
  });

  const [tempVariation, setTempVariation] = useState('');
  const [tempComplement, setTempComplement] = useState({ name: '', price: '', max: 1, required: false });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleOpenModal = (group?: ProductGroup) => {
    setActiveTab('geral');
    if (group) {
      setEditingId(group.id);
      setFormData({
        sequence: group.sequence.toString(),
        description: group.description,
        active: group.active,
        variations: group.variations || [],
        complements: group.complements || []
      });
    } else {
      setEditingId(null);
      const nextSeq = groups.length > 0 ? Math.max(...groups.map(g => g.sequence)) + 1 : 1;
      setFormData({ sequence: nextSeq.toString(), description: '', active: true, variations: [], complements: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const groupData = {
      sequence: parseInt(formData.sequence) || 0,
      description: formData.description,
      active: formData.active,
      variations: formData.variations,
      complements: formData.complements
    };

    if (editingId) {
      setGroups(groups.map(g => g.id === editingId ? { ...g, ...groupData } : g).sort((a,b) => a.sequence - b.sequence));
    } else {
      const newId = Math.floor(Math.random() * 10000);
      setGroups([...groups, { id: newId, ...groupData }].sort((a,b) => a.sequence - b.sequence));
    }
    setIsModalOpen(false);
  };

  const addVariation = () => {
    if (!tempVariation.trim()) return;
    const newVar = { id: Math.random(), name: tempVariation };
    setFormData({ ...formData, variations: [...formData.variations, newVar] });
    setTempVariation('');
  };

  const addComplement = () => {
    if (!tempComplement.name.trim()) return;
    const newComp = { 
      id: Math.random(), 
      name: tempComplement.name, 
      price: parseFloat(tempComplement.price) || 0, 
      maxQuantity: tempComplement.max, 
      required: tempComplement.required 
    };
    setFormData({ ...formData, complements: [...formData.complements, newComp] });
    setTempComplement({ name: '', price: '', max: 1, required: false });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grupos de Produtos</h1>
            <p className="text-gray-500 text-sm">Gerencie a organização e regras dos grupos de produtos.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
            <Plus size={20} /> Novo Grupo
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por descrição..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Lista de Grupos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-20 text-center">Seq.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Regras</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groups
                .filter(g => g.description.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((group) => (
                <tr key={group.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                      {group.sequence.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{group.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold uppercase ${group.variations.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        <Layers size={12}/> {group.variations.length} Var.
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold uppercase ${group.complements.length > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                        <ListChecks size={12}/> {group.complements.length} Compl.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${group.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {group.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(group)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {groups.length === 0 && (
          <div className="p-12 text-center text-gray-400">Nenhum grupo encontrado.</div>
        )}
      </div>

      {/* --- MODAL (Atualizado sem Imagem) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Grupo' : 'Novo Grupo'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>

            <div className="flex border-b border-gray-100 px-6 gap-6 bg-white overflow-x-auto scrollbar-hide">
                <button onClick={() => setActiveTab('geral')} className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'geral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    <Settings2 size={16}/> Geral
                </button>
                <button onClick={() => setActiveTab('variacoes')} className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'variacoes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    <Layers size={16}/> Variações <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 rounded-full">{formData.variations.length}</span>
                </button>
                <button onClick={() => setActiveTab('complementos')} className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'complementos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    <ListChecks size={16}/> Complementos <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 rounded-full">{formData.complements.length}</span>
                </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1">
              {activeTab === 'geral' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Seq.</label>
                      <input type="number" required className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-center font-bold" value={formData.sequence} onChange={e => setFormData({...formData, sequence: e.target.value})} />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição do Grupo</label>
                      <input type="text" required placeholder="Ex: Bebidas, Sobremesas..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border p-4 rounded-xl border-gray-100 bg-gray-50/50 transition-all">
                    <div>
                      <p className="text-sm font-bold text-gray-700">Exibir no Cardápio Digital </p>
                      <p className="text-xs text-gray-500">Define se este grupo aparece no cardápio.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'variacoes' && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Ex: 500ml, Grande, Sem Gelo..." 
                          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                          value={tempVariation} 
                          onChange={(e) => setTempVariation(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVariation())} 
                        />
                        <button type="button" onClick={addVariation} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-2 mt-4">
                        {formData.variations.map(vari => (
                            <div key={vari.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                                <span className="text-sm font-bold text-gray-700">{vari.name}</span>
                                <button type="button" onClick={() => setFormData({...formData, variations: formData.variations.filter(v => v.id !== vari.id)})} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              {activeTab === 'complementos' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="col-span-5">
                             <label className="text-[10px] font-bold text-gray-500 uppercase">Nome</label>
                             <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={tempComplement.name} onChange={e => setTempComplement({...tempComplement, name: e.target.value})} />
                        </div>
                        <div className="col-span-3">
                             <label className="text-[10px] font-bold text-gray-500 uppercase">Preço</label>
                             <input type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" value={tempComplement.price} onChange={e => setTempComplement({...tempComplement, price: e.target.value})} />
                        </div>
                        <div className="col-span-2">
                             <label className="text-[10px] font-bold text-gray-500 uppercase">Qtd</label>
                             <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm text-center" value={tempComplement.max} onChange={e => setTempComplement({...tempComplement, max: parseInt(e.target.value)})} />
                        </div>
                        <div className="col-span-2">
                             <button type="button" onClick={addComplement} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center"><PlusCircle size={20}/></button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {formData.complements.map(comp => (
                            <div key={comp.id} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-xl">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-800 text-sm">{comp.name}</p>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold">{formatCurrency(comp.price)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Máx: {comp.maxQuantity} • {comp.required ? 'Obrigatório' : 'Opcional'}</p>
                                </div>
                                <button type="button" onClick={() => setFormData({...formData, complements: formData.complements.filter(c => c.id !== comp.id)})} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold text-sm">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
                  <Save size={18} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}