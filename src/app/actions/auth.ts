"use server";

import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function registerUser(data: any) {
  try {
    const { name, email, password } = data;

    // 1. Validação básica
    if (!name || !email || password.length < 8) {
      return { success: false, error: "Dados inválidos ou senha muito curta." };
    }

    // 2. Verificar se o usuário já existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    // 3. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Salvar no banco
    await prisma.usuario.create({
      data: {
        nome: name,
        email: email,
        senha: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro interno ao criar conta." };
  }
}

export async function loginUser(data: any) {
  try {
    const { email, password } = data;

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return { success: false, error: "E-mail ou senha incorretos." };

    const passwordMatch = await bcrypt.compare(password, user.senha);
    if (!passwordMatch) return { success: false, error: "E-mail ou senha incorretos." };

    // Aqui você implementaria sua lógica de sessão (Cookies, JWT ou NextAuth)
    return { success: true, user: { name: user.nome, email: user.email } };
  } catch (error) {
    return { success: false, error: "Erro ao realizar login." };
  }
}