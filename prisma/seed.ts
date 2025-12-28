import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed...')

  // 1. Limpa os dados antigos (opcional, cuidado em produção)
  // await prisma.avaliacao.deleteMany()
  // await prisma.empresa.deleteMany()

  // 2. Cria uma empresa
  const empresa = await prisma.empresa.create({
    data: {
      nome: "Luniére Burguer & Decorações",
      cnpj: "12.345.678/0001-99",
      email: "contato@luniere.com",
    }
  })

  console.log(`🏢 Empresa criada: ${empresa.nome}`)

  // 3. Cria várias avaliações para essa empresa
  await prisma.avaliacao.createMany({
    data: [
      {
        clienteNome: "Fernanda Costa",
        nota: 5,
        comentario: "O lanche chegou super quentinho e a entrega foi muito rápida! O entregador foi super educado.",
        tags: "Entrega Rápida,Sabor",
        resposta: null, // Deixar null para testar o status "Pendente"
        empresaId: empresa.id
      },
      {
        clienteNome: "Kevin Rodrigo",
        nota: 2,
        comentario: "O hambúrguer estava frio e faltou o molho extra. Decepcionado.",
        tags: "Temperatura,Pedido Incompleto",
        resposta: null, // Pendente
        empresaId: empresa.id
      },
      {
        clienteNome: "Juliana Paes",
        nota: 4,
        comentario: "Muito gostoso, mas achei a batata um pouco murcha. O lanche em si estava perfeito.",
        tags: "Sabor",
        resposta: "Olá Juliana! Vamos ajustar o tempo de fritura. Obrigado pelo feedback!", // Respondida
        empresaId: empresa.id
      },
      {
        clienteNome: "Carlos Luniére",
        nota: 5,
        comentario: "Melhor açaí da região! Sem mais.",
        tags: "Qualidade,Preço",
        resposta: "Valeu Carlos! Volte sempre.", // Respondida
        empresaId: empresa.id
      },
      {
        clienteNome: "Ana Clara",
        nota: 1,
        comentario: "Nunca chegou.",
        tags: "Entrega",
        resposta: null,
        empresaId: empresa.id
      }
    ]
  })

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })