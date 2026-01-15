# 🚀 Área do Cliente (Enterprise ERP System)

Bem-vindo ao repositório oficial da **Área do Cliente**. Este é um sistema de gestão empresarial (ERP) de alta complexidade, desenvolvido para centralizar operações de vendas, fiscal e financeiro em uma única plataforma web moderna e performática.

O projeto utiliza a arquitetura de ponta do **Next.js (App Router)** com renderização híbrida e Server Actions.

## 🛠️ Stack Tecnológica

O sistema foi construído sobre uma base sólida, tipada e escalável:

* **Core:** [Next.js 15](https://nextjs.org/) (App Router & Server Components)
* **Linguagem:** TypeScript (Strict Mode)
* **Estilização:** Tailwind CSS (Design System responsivo)
* **Banco de Dados:** Prisma ORM (PostgreSQL)
* **Arquitetura:** Modular Monolith (Módulos desacoplados dentro de `/system`)

## 📦 Módulos do Sistema

A aplicação é dividida em módulos funcionais localizados em `src/app/system`:

* **🛒 INFORMAÇÕES FINANCEIRAS DO PDV (Ponto de Venda):** Dashboard e controle de caixa.
* **📄 NFe (Nota Fiscal Eletrônica):** Emissão e gerenciamento fiscal.
* **💰 Financeiro & Faturamento:** Controle de contas a pagar/receber e fluxo de caixa.
* **🍔 Cardápio Digital:** Gestão de produtos e categorias para food service.
* **⚙️ Configurações & Suporte:** Painel administrativo e central de ajuda.

## 📂 Estrutura do Projeto

A organização de pastas segue o padrão de domínios, facilitando a manutenção:

```bash
src/
├── app/
│   ├── actions/          # Server Actions globais
│   ├── auth/             # Autenticação (Login/Recuperação de Senha)
│   ├── system/           # Núcleo do Sistema (Área Logada)
│   │   ├── api/          # Rotas de API internas
│   │   ├── cardapio/     # Módulo de Produtos/Cardápio
│   │   ├── faturamento/  # Gestão de Vendas
│   │   ├── financeiro/   # DRE e Fluxo de Caixa
│   │   ├── nfe/          # Emissor Fiscal
│   │   ├── pdv/          # Frente de Caixa
│   │   ├── suporte/      # Helpdesk
│   │   └── layout.tsx    # Layout Persistente (Sidebar + Header)
│   └── layout.tsx        # Root Layout
├── components/           # UI Kit (Botões, Modais, Tables)
├── lib/                  # Utilitários e Configurações (Prisma, Axios)
└── prisma/               # Schema do Banco de Dados
