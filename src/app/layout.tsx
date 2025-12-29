import "./globals.css";
// Se estiver usando fontes do Google, configure aqui, senão remova a importação
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Área do Cliente - Datacaixa",
  description: "Área do Cliente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}