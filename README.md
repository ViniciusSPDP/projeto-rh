# Sistema de Gestão de RH e Recrutamento

![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-5.x-1B222D?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 📄 Sobre o Projeto

Este é um sistema completo para gestão de Recursos Humanos (RH) e processos de recrutamento, desenvolvido com as tecnologias mais modernas do ecossistema JavaScript. A plataforma permite gerenciar vagas, acompanhar candidatos em diferentes etapas do processo seletivo, manter um banco de talentos e administrar o acesso de usuários do sistema.

O projeto possui duas frentes principais:
1.  **Área Administrativa (RH):** Uma interface segura para os recrutadores criarem vagas, visualizarem e gerenciarem candidatos, moverem-nos entre as etapas do funil de seleção e administrarem usuários do sistema.
2.  **Área Pública:** Formulários para que candidatos externos possam se inscrever nas vagas abertas.

---

## ✨ Funcionalidades Principais

-   **Gestão de Vagas:** Criação, edição e encerramento de vagas de emprego.
-   **Funil de Recrutamento:** Acompanhamento de candidatos por etapas personalizáveis (Ex: Triagem, Entrevista, Proposta).
-   **Banco de Talentos:** Um repositório central com todos os candidatos cadastrados, permitindo vinculá-los a novas vagas.
-   **Autenticação e Autorização:** Sistema de login seguro com NextAuth.js e gerenciamento de permissões de usuários.
-   **Dashboard com Métricas:** Visualização de dados sobre o status dos candidatos em gráficos (utilizando Recharts).
-   **Perfil de Usuário:** Gerenciamento de dados pessoais e alteração de senha.
-   **Design Responsivo:** Interface moderna e adaptável a diferentes tamanhos de tela com Tailwind CSS.
-   **Impressão de Currículos:** Geração de uma versão para impressão do perfil do candidato.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando um stack moderno e robusto, focado em performance e escalabilidade.

-   **Frontend:**
    -   **Framework:** [Next.js](https://nextjs.org/) (com App Router)
    -   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
    -   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
    -   **Componentes e Ícones:** [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/) (Gráficos)
    -   **Notificações:** [React Hot Toast](https://react-hot-toast.com/)

-   **Backend:**
    -   **Ambiente:** Node.js
    -   **Rotas de API:** Next.js API Routes

-   **Banco de Dados & ORM:**
    -   **ORM:** [Prisma](https://www.prisma.io/)
    -   **Banco de Dados:** PostgreSQL (ou outro banco suportado pelo Prisma)

-   **Autenticação:**
    -   **Biblioteca:** [NextAuth.js](https://next-auth.js.org/)

---

## 🛠️ Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/)
-   Uma instância de banco de dados (ex: PostgreSQL) rodando localmente ou na nuvem.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    -   Renomeie o arquivo `.env.example` (se existir) para `.env`.
    -   Caso contrário, crie um arquivo chamado `.env` na raiz do projeto.
    -   Preencha as variáveis conforme o exemplo abaixo:

    ```env
    # URL de conexão com o seu banco de dados (ex: PostgreSQL)
    # Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    DATABASE_URL="postgresql://user:password@localhost:5432/rh_db"

    # Chave secreta para a autenticação com NextAuth.js
    # Você pode gerar uma usando: openssl rand -base64 32
    NEXTAUTH_SECRET="sua-chave-secreta-aqui"

    # URL base da sua aplicação
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Aplique as Migrations do Banco de Dados:**
    Este comando irá ler o seu `schema.prisma` e criar as tabelas no banco de dados.
    ```bash
    npx prisma migrate dev
    ```

5.  **Gere o Cliente Prisma:**
    (Geralmente, o comando anterior já faz isso, mas é uma boa prática garantir)
    ```bash
    npx prisma generate
    ```

6.  **Execute o projeto:**
    ```bash
    npm run dev
    # ou
    yarn dev
    # ou
    pnpm dev
    ```

7.  Acesse [`http://localhost:3000`](http://localhost:3000) em seu navegador para ver a aplicação rodando.

---

## 📂 Estrutura de Pastas (Simplificada)

A estrutura de pastas segue o padrão do Next.js App Router para uma boa organização e escalabilidade.

/

├── prisma/ # Schema e migrations do banco de dados

├── public/ # Arquivos estáticos (imagens, fontes)

├── src/

│ ├── app/ # Coração da aplicação (páginas, layouts, APIs)

│ │ ├── (auth)/ # Layout e páginas para rotas de autenticação

│ │ ├── api/ # Rotas de API do backend

│ │ ├── components/ # Componentes React reutilizáveis

│ │ ├── perfil/ # Rotas protegidas de perfil e gestão

│ │ └── ... # Outras páginas (candidatos, vagas, dashboard)

│ ├── lib/ # Funções utilitárias, instâncias (Prisma, Auth)

│ └── types/ # Definições de tipos TypeScript

├── .env # Variáveis de ambiente (NÃO versionar)

├── next.config.ts # Configurações do Next.js

├── tailwind.config.ts # Configurações do Tailwind CSS

└── package.json # Dependências e scripts do projeto


---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

