import { User, Headphones, Phone } from "lucide-react";

export function Header() {
  return (
    <header className="flex px-2 py-4 bg-white text-zinc-600">
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">

        <div className="flex items-center gap-2 font-medium">
          <User size={18} />
          Área do Cliente
        </div>

        <nav>
          <ul className="flex items-center gap-6">
            <li className="flex items-center gap-2">
              <Headphones size={18} />
              Suporte: DATACAIXA TECNOLOGIA
            </li>

            <li className="flex items-center gap-2">
              <Phone size={18} />
              +55 (11) 99999-9999
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}
