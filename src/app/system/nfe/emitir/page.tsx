'use client';

import React, { useState } from 'react';
import { 
  Search, FileText, User, MapPin, Calculator, 
  ChevronLeft, ChevronRight, CheckCircle2, 
  Package, Percent, Truck, CreditCard, Plus, Trash2,
  Loader2
} from 'lucide-react';

export default function NfeEmissaoPage() {
  const [step, setStep] = useState(1);

  // --- ESTADOS DO FORMULÁRIO ---
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cep, setCep] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [valorFrete, setValorFrete] = useState('');
  const [valorPago, setValorPago] = useState('250,00');

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    uf: '',
    municipio: '',
    numero: '',
    complemento: ''
  });

  // --- NAVEGAÇÃO DO STEPPER ---
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- FUNÇÕES DE MÁSCARA ---

  // 1. Máscara CPF/CNPJ Dinâmica
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    
    if (value.length <= 11) {
      // Máscara de CPF
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Máscara de CNPJ
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    setCpfCnpj(value.substring(0, 18));
  };

  // 2. Máscara de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value.substring(0, 9));
  };

  // 3. Máscara de Dinheiro (Moeda)
  const applyMoneyMask = (value: string) => {
    let v = value.replace(/\D/g, ''); // Remove não números
    if (!v) return '';
    v = (parseInt(v, 10) / 100).toFixed(2); // Divide por 100 para ter as casas decimais
    v = v.replace('.', ','); // Troca ponto por vírgula
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Adiciona os pontos de milhar
    return v;
  };

  // --- INTEGRAÇÃO VIACEP ---
  const buscarCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setEndereco(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          uf: data.uf || '',
          municipio: data.localidade || ''
        }));
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao consultar o ViaCEP:", error);
      alert("Erro ao buscar o CEP. Tente novamente.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-8 font-sans text-slate-800">
      
      {/* HEADER DA PÁGINA */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Nova Nota Fiscal Eletrônica (NF-e)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Preencha os dados abaixo para emitir sua nota.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* COLUNA ESQUERDA (FORMULÁRIO) */}
        <div className="flex-1 w-full flex flex-col">
          
          {/* STEPPER */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 mb-6 bg-white rounded-t-2xl px-2 pt-2 md:px-4 shadow-sm">
            <button onClick={() => setStep(1)} className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${step === 1 ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] transition-colors ${step >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>1</span>
              Destinatário e Dados
            </button>
            <button onClick={() => setStep(2)} className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${step === 2 ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] transition-colors ${step >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>2</span>
              Produtos e Impostos
            </button>
            <button onClick={() => setStep(3)} className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${step === 3 ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] transition-colors ${step === 3 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>3</span>
              Transporte e Pagamento
            </button>
          </div>

          {/* CONTEÚDO DINÂMICO DOS PASSOS */}
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            
            {/* ======================= PASSO 1 ======================= */}
            {step === 1 && (
              <>
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                    <h2 className="text-base md:text-lg font-bold text-slate-800">Dados da Operação</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tipo de Operação</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>Saída (Venda)</option>
                        <option>Entrada</option>
                      </select>
                    </div>

                    <div className="md:col-span-6 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Natureza da Operação</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>5.102 - Venda de mercadoria adquirida</option>
                        <option>5.101 - Venda de produção</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Data de Emissão</label>
                      <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 cursor-pointer"/>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
                    <h2 className="text-base md:text-lg font-bold text-slate-800">Destinatário / Remetente</h2>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* CAMPO CPF/CNPJ COM MÁSCARA DINÂMICA */}
                      <div className="md:col-span-4 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">CPF / CNPJ</label>
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                          <input 
                            type="text" 
                            placeholder="000.000.000-00" 
                            value={cpfCnpj}
                            onChange={handleCpfCnpjChange}
                            className="w-full p-2.5 bg-transparent text-sm outline-none font-medium text-slate-700"
                          />
                          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border-l border-slate-200 cursor-pointer"><Search size={18} /></button>
                        </div>
                      </div>
                      
                      <div className="md:col-span-5 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Razão Social / Nome</label>
                        <input type="text" placeholder="Nome do Cliente SA" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700"/>
                      </div>
                      
                      <div className="md:col-span-3 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Insc. Estadual</label>
                        <input type="text" placeholder="Isento" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700"/>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-slate-500">
                      <MapPin size={16} />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Endereço</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* CAMPO CEP COM MÁSCARA E VIACEP */}
                      <div className="md:col-span-1 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">CEP</label>
                        <div className="relative flex items-center">
                          <input 
                            type="text" 
                            placeholder="00000-000" 
                            value={cep}
                            onChange={handleCepChange}
                            onBlur={buscarCep}
                            className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"
                          />
                          {isLoadingCep && <Loader2 size={16} className="absolute right-3 text-blue-500 animate-spin" />}
                        </div>
                      </div>
                      <div className="md:col-span-3 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Logradouro</label>
                        <input type="text" placeholder="Rua, Avenida, etc." value={endereco.logradouro} onChange={(e) => setEndereco({...endereco, logradouro: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bairro</label>
                        <input type="text" placeholder="Bairro" value={endereco.bairro} onChange={(e) => setEndereco({...endereco, bairro: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"/>
                      </div>
                      <div className="md:col-span-1 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Número</label>
                        <input type="text" placeholder="S/N" value={endereco.numero} onChange={(e) => setEndereco({...endereco, numero: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"/>
                      </div>
                      <div className="md:col-span-1 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Complemento</label>
                        <input type="text" placeholder="Sala, Apto..." value={endereco.complemento} onChange={(e) => setEndereco({...endereco, complemento: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">UF</label>
                        <select value={endereco.uf} onChange={(e) => setEndereco({...endereco, uf: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700 cursor-pointer">
                          <option value="">UF</option>
                          {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(est => (
                            <option key={est} value={est}>{est}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-3 flex flex-col gap-1.5">
                        <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Município</label>
                        <input type="text" placeholder="Cidade" value={endereco.municipio} onChange={(e) => setEndereco({...endereco, municipio: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"/>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ======================= PASSO 2 ======================= */}
            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package size={20} /></div>
                      <h2 className="text-base md:text-lg font-bold text-slate-800">Itens da Nota</h2>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Buscar Produto</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Nome ou código..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"/>
                      </div>
                    </div>
                    <div className="w-full md:w-24 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Qtd</label>
                      <input type="number" defaultValue="1" className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 text-center font-bold text-slate-700"/>
                    </div>
                    
                    {/* CAMPO VALOR UNITÁRIO COM MÁSCARA */}
                    <div className="w-full md:w-32 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">V. Unit (R$)</label>
                      <input 
                        type="text" 
                        placeholder="0,00" 
                        value={valorUnitario}
                        onChange={(e) => setValorUnitario(applyMoneyMask(e.target.value))}
                        className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium text-slate-700 text-right"
                      />
                    </div>
                    
                    <div className="w-full md:w-auto flex items-end">
                      <button className="w-full md:w-auto p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 font-bold cursor-pointer">
                        <Plus size={18} /> <span className="md:hidden">Adicionar Item</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de Produtos (Mock) */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 grid grid-cols-12 gap-2 text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-6 md:col-span-5">Produto</div>
                      <div className="col-span-2 hidden md:block">NCM</div>
                      <div className="col-span-3 md:col-span-2 text-center">Qtd</div>
                      <div className="col-span-3 md:col-span-2 text-right">V. Unit</div>
                      <div className="col-span-3 md:col-span-1 text-right">Total</div>
                    </div>
                    <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-12 gap-2 items-center text-sm">
                      <div className="col-span-6 md:col-span-5 font-bold text-slate-700 truncate">Teclado Mecânico RGB</div>
                      <div className="col-span-2 hidden md:block text-slate-500 text-xs">8471.60.52</div>
                      <div className="col-span-3 md:col-span-2 text-center font-medium bg-slate-100 rounded-md py-1">1</div>
                      <div className="col-span-3 md:col-span-2 text-right text-slate-600">250,00</div>
                      <div className="col-span-3 md:col-span-1 text-right font-bold text-slate-800">250,00</div>
                      <div className="col-span-12 md:col-span-1 flex justify-end mt-2 md:mt-0">
                        <button className="text-red-400 hover:text-red-600 p-1 cursor-pointer"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Percent size={20} /></div>
                    <h2 className="text-base md:text-lg font-bold text-slate-800">Tributação e Impostos Gerais</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Regime Tributário</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>Simples Nacional</option>
                        <option>Lucro Presumido</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">CSOSN / CST Padrão</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>102 - Tributada pelo Simples s/ permissão de crédito</option>
                        <option>101 - Tributada pelo Simples c/ permissão de crédito</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aliquota ICMS (%)</label>
                      <input type="text" placeholder="0,00" disabled className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none font-medium text-slate-400 cursor-not-allowed"/>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ======================= PASSO 3 ======================= */}
            {step === 3 && (
              <>
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Truck size={20} /></div>
                    <h2 className="text-base md:text-lg font-bold text-slate-800">Transporte e Frete</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Modalidade do Frete</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>0 - Contratação do Frete por conta do Remetente (CIF)</option>
                        <option>1 - Contratação do Frete por conta do Destinatário (FOB)</option>
                        <option>9 - Sem Ocorrência de Transporte</option>
                      </select>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transportadora (CNPJ/Nome)</label>
                      <input type="text" placeholder="Buscar..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700"/>
                    </div>

                    {/* CAMPO FRETE COM MÁSCARA */}
                    <div className="md:col-span-3 flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Valor do Frete (R$)</label>
                      <input 
                        type="text" 
                        placeholder="0,00" 
                        value={valorFrete}
                        onChange={(e) => setValorFrete(applyMoneyMask(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-blue-600 text-right"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CreditCard size={20} /></div>
                    <h2 className="text-base md:text-lg font-bold text-slate-800">Cobrança e Pagamento</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Forma de Pagamento</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>0 - Pagamento à Vista</option>
                        <option>1 - Pagamento a Prazo</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Meio de Pagamento</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-700 cursor-pointer">
                        <option>17 - PIX</option>
                        <option>01 - Dinheiro</option>
                        <option>03 - Cartão de Crédito</option>
                        <option>15 - Boleto Bancário</option>
                      </select>
                    </div>
                    
                    {/* CAMPO VALOR PAGO COM MÁSCARA */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Valor Pago (R$)</label>
                      <input 
                        type="text" 
                        placeholder="0,00"
                        value={valorPago}
                        onChange={(e) => setValorPago(applyMoneyMask(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-emerald-600 text-right"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* NAVEGAÇÃO BOTTOM */}
          <div className="flex items-center justify-between pt-8 pb-10">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 md:px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl flex items-center gap-1 md:gap-2 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} /> Anterior
            </button>
            
            {step < 3 ? (
              <button 
                onClick={nextStep}
                className="px-4 md:px-6 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1 md:gap-2 hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98] cursor-pointer"
              >
                Próximo Passo <ChevronRight size={18} />
              </button>
            ) : (
              <button className="px-4 md:px-6 py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md active:scale-[0.98] cursor-pointer">
                Revisar Resumo
              </button>
            )}
          </div>

        </div>

        {/* COLUNA DIREITA (RESUMO LATERAL FIXO) */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6">
            
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Calculator size={20} className="text-slate-400" />
              <h3 className="font-bold text-slate-800">Resumo da Nota</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total dos Produtos</span>
                <span className="font-bold">R$ 250,00</span>
              </div>
              
              <div className="flex justify-between items-center text-slate-600">
                <span>Frete</span>
                <span className="font-bold">R$ {valorFrete || '0,00'}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Descontos</span>
                <span className="font-bold text-red-500">- R$ 0,00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-end">
              <span className="font-bold text-slate-800">Valor Total</span>
              <span className="text-2xl font-black text-blue-600 leading-none">R$ 250,00</span>
            </div>

            <button className="w-full mt-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] cursor-pointer">
              <CheckCircle2 size={20} />
              Transmitir NF-e
            </button>
            
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Certifique-se de que os dados estão corretos antes de autorizar na SEFAZ.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}