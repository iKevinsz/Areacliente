import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona para a rota de login
  redirect("/auth/login");
}