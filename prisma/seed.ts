import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed de Produtos...')

  // 1. Limpeza (opcional)
  // await prisma.produto.deleteMany()
  // await prisma.grupo.deleteMany()
  // await prisma.empresa.deleteMany()

  // 2. Cria a Empresa
  const empresa = await prisma.empresa.create({
    data: {
      nome: "Luniére Burguer",
      cnpj: "12.345.678/0001-99",
      email: "contato@luniere.com",
    }
  })

  // 3. Cria um Grupo (Categorias do cardápio)
  const grupoLanches = await prisma.grupo.create({
    data: {
      nome: "Lanches Artesanais",
      empresaId: empresa.id
    }
  })

  const grupoBebidas = await prisma.grupo.create({
    data: {
      nome: "Bebidas Geladas",
      empresaId: empresa.id
    }
  })

  // 4. Cria os Produtos
  await prisma.produto.createMany({
    data: [
      {
        nome: "X-Bacon Luniére",
        descricao: "Pão brioche, burger 180g, muito bacon crocante e queijo cheddar.",
        preco: 29.90,
        categoria: "Lanches",
        estoque: 50,
        ativo: true,
        imagem: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=60",
        grupoId: grupoLanches.id
      },
      {
        nome: "Smash Duplo",
        descricao: "Dois burgers de 90g amassadinhos na chapa com queijo prato.",
        preco: 24.50,
        categoria: "Lanches",
        estoque: 20,
        ativo: true,
        imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60",
        grupoId: grupoLanches.id
      },
      {
        nome: "Coca-Cola Lata",
        descricao: "350ml bem gelada.",
        preco: 6.00,
        categoria: "Bebidas",
        estoque: 100,
        ativo: true,
        imagem: null, // Sem imagem
        grupoId: grupoBebidas.id
      },
      {
        nome: "Suco de Laranja",
        descricao: "Natural da fruta, 500ml.",
        preco: 12.00,
        categoria: "Bebidas",
        estoque: 0, // Esgotado
        ativo: false,
        imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=60",
        grupoId: grupoBebidas.id
      }
    ]
  })

  console.log('✅ Produtos criados com sucesso!')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })