<<<<<<< HEAD
<<<<<<< HEAD
export default function EmpresaPage() {
  return (
    <div className="p-6">

      {/* Título */}
      <h1 className="text-xl mb-1 text-gray-600">
        Meus Dados <span className="font-semibold text-gray-800">/ Empresa</span>
      </h1>

      {/* CARD DADOS CADASTRAIS */}
      <div className="bg-white rounded-lg shadow p-6 mt-4">

        <h2 className="text-lg font-semibold mb-6 text-gray-700">
          Dados Cadastrais
        </h2>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LOGO */}
          <div className="col-span-1 flex flex-col items-center">
            <img
              src="https://i.imgur.com/o7jZrXH.png"
              alt="Logo"
              className="w-40 h-40 rounded-lg object-cover shadow"
            />

            <button className="mt-2 px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
              Carregar Logo
            </button>

            <p className="text-xs text-gray-400 mt-1">
              Tipos permitidos: JPG, BMP, PNG. Máx. 1MB
            </p>
          </div>

          {/* CAMPOS */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="label">CNPJ/CPF</label>
              <input className="input" placeholder="000.000.000-00" />
            </div>

            <div>
              <label className="label">Inscrição Estadual/RG</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Inscrição Municipal</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Segmento</label>
              <select className="input">
                <option>AÇAITERIA / SORVETERIA</option>
              </select>
            </div>

            <div>
              <label className="label">Razão Social</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Nome Fantasia</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">CEP</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Endereço</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">UF</label>
              <select className="input">
                <option>SP</option>
              </select>
            </div>

            <div>
              <label className="label">Cidade</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Complemento</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Número</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Bairro</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Telefone</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Celular</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Contato</label>
              <input className="input" />
            </div>

            <div className="md:col-span-2">
              <label className="label">E-mail</label>
              <input className="input" />
            </div>
          </div>

        </div>
      </div>

      {/* Outro card (Cardápio Digital) aqui... */}

      {/* Título */}
      <h1 className="text-xl mb-1 text-gray-600 bont-semibold mt-8">
        <span className="font-semibold text-gray-800">Cardápio Digital </span>
      </h1>

      {/* CARD DADOS CARDAPIO */}
      <div className="bg-white rounded-lg shadow p-6 mt-4">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CAMPOS */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="label">Fuso Horário</label>
              <select className="input">
                <option>São Paulo</option>
                <option>Rio de Janeiro</option>
              </select>
            </div>

            <div>
              <label className="label">Link da Loja</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Categoria de Produtos</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Tempo de Retirada(Minutos)</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Tempo de Entrega</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">WhatsApp</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">YouTube</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">Instagram</label>
              <input className="input" />
            </div>

            <div>
              <label className="label">X (Twitter)</label>
              <select className="input">
                <option>SP</option>
              </select>
            </div>

            <div>
              <label className="label">Facebook</label>
              <input className="input" />
            </div>
        </div>
      </div>
    </div>
  </div>
    
  );
}
=======
export default function HomePage() {
  return (
  <div>
    <h1>Home Page</h1>
    <p>This is the home page content.</p>
  </div>

  )
}
>>>>>>> 41fc8df85f1e632cbee79edbcc9aa6d26ceb263f
=======
import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona imediatamente para a rota de login
  redirect("/login");
}
>>>>>>> dev
