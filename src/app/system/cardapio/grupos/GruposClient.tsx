'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Plus, Edit3, Trash2, X, Save, 
  CheckCircle2, Layers, ListChecks, Settings2, PlusCircle,
  AlertTriangle, Filter // Adicionado Filter aqui
} from 'lucide-react';
import { saveGroup, deleteGroup } from '@/app/actions'; 

// --- INTERFACES ---

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

// Interface visual do componente
interface ProductGroup {
  id: number;
  sequence: number;
  description: string;
  active: boolean;
  variations: Variation[];
  complements: Complement[];
}

// Interface que vem do Banco de Dados (Prisma)
interface DatabaseGroup {
  id: number;
  nome: string;
  ordem: number;
  ativo: boolean;
  variacoes?: { id: number; nome: string }[];
  complementos?: { id: number; nome: string; preco: string | number; maxQtd: number; obrigatorio: boolean }[];
  grupovariacao?: { id: number; nome: string }[];
  grupocomplemento?: { id: number; nome: string; preco: string | number; maxQtd: number; obrigatorio: boolean }[];
  produtos?: any[]; 
}

export default function GruposClient({ grupos = [] }: { grupos: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // CONVERSÃO DE DADOS
  const processGroups = (rawGroups: any[]): ProductGroup[] => {
    if (!Array.isArray(rawGroups)) return [];
    
    return rawGroups.map((dbGroup: DatabaseGroup) => {
      const rawVariations = dbGroup.variacoes || dbGroup.grupovariacao || [];
      const rawComplements = dbGroup.complementos || dbGroup.grupocomplemento || [];

      return {
        id: dbGroup.id,
        sequence: dbGroup.ordem || 0,
        description: dbGroup.nome || 'Sem nome',
        active: dbGroup.ativo ?? true,
        variations: Array.isArray(rawVariations) 
          ? rawVariations.map((v: any) => ({ id: v.id, name: v.nome }))
          : [],
        complements: Array.isArray(rawComplements)
          ? rawComplements.map((c: any) => ({ 
              id: c.id, 
              name: c.nome, 
              price: Number(c.preco) || 0, 
              maxQuantity: c.maxQtd || 1, 
              required: !!c.obrigatorio 
            }))
          : []
      };
    });
  };

  const [groups, setGroups] = useState<ProductGroup[]>(processGroups(grupos));
  
  useEffect(() => {
    setGroups(processGroups(grupos));
  }, [grupos]);

  // STATES DE FILTRO
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all'); // NOVO STATE

  // Estados do Modal Principal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'variacoes' | 'complementos'>('geral');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estado do Modal de Confirmação de Exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'variation' | 'complement' | 'group', id: number } | null>(null);

  // Estado Modal de Sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        variations: group.variations ? [...group.variations] : [],
        complements: group.complements ? [...group.complements] : []
      });
    } else {
      setEditingId(null);
      const nextSeq = groups.length > 0 ? Math.max(...groups.map(g => g.sequence)) + 1 : 1;
      setFormData({ sequence: nextSeq.toString(), description: '', active: true, variations: [], complements: [] });
    }
    setIsModalOpen(true);
  };

  // --- AÇÃO DE SALVAR NO BANCO ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      id: editingId || 0,
      sequence: Number(formData.sequence) || 0,
      description: formData.description,
      active: formData.active,
      variations: formData.variations, 
      complements: formData.complements
    };

    try {
      const result = await saveGroup(dataToSend);

      if (result.success) {
          setIsModalOpen(false);
          setShowSuccessModal(true);
          router.refresh(); 
      } else {
          alert("Erro ao salvar: " + (result.error || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      alert("Erro de conexão ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MANIPULAÇÃO VISUAL DE VARIAÇÕES ---
  const addVariation = () => {
    if (!tempVariation.trim()) return;
    const newVar = { id: -Date.now(), name: tempVariation }; 
    setFormData({ ...formData, variations: [...formData.variations, newVar] });
    setTempVariation('');
  };

  // --- MANIPULAÇÃO VISUAL DE COMPLEMENTOS ---
  const addComplement = () => {
    if (!tempComplement.name.trim()) return;
    const newComp = { 
      id: -Date.now(), 
      name: tempComplement.name, 
      price: parseFloat(tempComplement.price) || 0, 
      maxQuantity: tempComplement.max, 
      required: tempComplement.required 
    };
    setFormData({ ...formData, complements: [...formData.complements, newComp] });
    setTempComplement({ name: '', price: '', max: 1, required: false });
  };

  const requestDelete = (type: 'variation' | 'complement' | 'group', id: number) => {
    setDeleteTarget({ type, id });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'group') {
      setIsLoading(true);
      try {
        const result = await deleteGroup(deleteTarget.id);
        if (result.success) {
           setDeleteTarget(null);
           router.refresh();
        } else {
           alert(result.error || "Erro ao excluir grupo.");
           setDeleteTarget(null);
        }
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao tentar excluir.");
      } finally {
        setIsLoading(false);
      }

    } else if (deleteTarget.type === 'variation') {
      setFormData({
        ...formData,
        variations: formData.variations.filter(v => v.id !== deleteTarget.id)
      });
      setDeleteTarget(null);

    } else {
      setFormData({
        ...formData,
        complements: formData.complements.filter(c => c.id !== deleteTarget.id)
      });
      setDeleteTarget(null);
    }
  };

  // --- LÓGICA DE FILTRAGEM ATUALIZADA ---
  const filteredGroups = groups
    .filter(g => {
        const matchesSearch = g.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (filterStatus === 'active') matchesStatus = g.active === true;
        if (filterStatus === 'inactive') matchesStatus = g.active === false;

        return matchesSearch && matchesStatus;
    })
    .sort((a,b) => a.sequence - b.sequence);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grupos de Produtos</h1>
            <p className="text-gray-500 text-sm">Gerencie a organização e regras dos grupos de produtos.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer"
          >
            <Plus size={20} /> Novo Grupo
          </button>
        </div>

        {/* Barra de Ferramentas (Filtro + Busca) */}
        <div className="flex flex-col md:flex-row gap-3">
            
            {/* Dropdown Status */}
            <div className="relative shrink-0 md:w-48">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full pl-11 pr-8 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer shadow-sm text-gray-700 font-medium"
                >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                </select>
                <div className="absolute right-3 top-4 pointer-events-none border-l-4 border-l-transparent border-t-4 border-t-gray-400 border-r-4 border-r-transparent"></div>
            </div>

            {/* Barra de Busca */}
            <div className="relative flex-1">
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
              {filteredGroups.map((group) => (
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
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => requestDelete('group', group.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGroups.length === 0 && (
          <div className="p-12 text-center text-gray-400">
             {searchTerm || filterStatus !== 'all' ? 'Nenhum grupo encontrado com os filtros atuais.' : 'Nenhum grupo encontrado.'}
          </div>
        )}
      </div>

      {/* --- MODAL PRINCIPAL (Formulário) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Grupo' : 'Novo Grupo'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={24} /></button>
            </div>

            <div className="flex border-b border-gray-100 px-6 gap-6 bg-white overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('geral')} 
                    className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'geral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Settings2 size={16}/> Geral
                </button>
                <button 
                    onClick={() => setActiveTab('variacoes')} 
                    className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'variacoes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Layers size={16}/> Variações <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 rounded-full">{formData.variations.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('complementos')} 
                    className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'complementos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
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
                        <button type="button" onClick={addVariation} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-2 mt-4 max-h-48 overflow-y-auto">
                        {formData.variations.map(vari => (
                            <div key={vari.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                                <span className="text-sm font-bold text-gray-700">{vari.name}</span>
                                <button type="button" onClick={() => requestDelete('variation', vari.id)} className="text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={16}/></button>
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
                             <button type="button" onClick={addComplement} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center cursor-pointer"><PlusCircle size={20}/></button>
                        </div>
                        <div className="col-span-12 flex items-center gap-2">
                            <input type="checkbox" id="comp-required" checked={tempComplement.required} onChange={e => setTempComplement({...tempComplement, required: e.target.checked})} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="comp-required" className="text-xs text-gray-600 font-medium">Obrigatório</label>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {formData.complements.map(comp => (
                            <div key={comp.id} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-xl">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-800 text-sm">{comp.name}</p>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold">{formatCurrency(comp.price)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Máx: {comp.maxQuantity} • {comp.required ? 'Obrigatório' : 'Opcional'}</p>
                                </div>
                                <button type="button" onClick={() => requestDelete('complement', comp.id)} className="text-gray-300 hover:text-red-500 cursor-pointer"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold text-sm cursor-pointer">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer">
                  <Save size={18} /> {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Item?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Você tem certeza que deseja remover {deleteTarget.type === 'group' ? 'este grupo' : deleteTarget.type === 'variation' ? 'esta variação' : 'este complemento'}? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-red-600 rounded-lg font-bold text-white hover:bg-red-700 text-sm transition-colors cursor-pointer"
                >
                  {isLoading ? 'Excluindo...' : 'Sim, Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE SUCESSO PADRONIZADO --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-300 flex flex-col items-center">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Ícone de Sucesso */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-600 w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sucesso!</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
              O grupo foi salvo com sucesso.
            </p>

            {/* Botão Entendido */}
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95 cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}