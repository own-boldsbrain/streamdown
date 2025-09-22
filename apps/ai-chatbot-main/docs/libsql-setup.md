# Configuração do LibSQL para o AI Chatbot

Este guia explica como configurar e usar o LibSQL como banco de dados local para o projeto AI Chatbot.

## Pré-requisitos

- Node.js 18+
- PNPM (instalado globalmente)
- Projeto AI Chatbot clonado

## Configuração Inicial

1. **Copie o arquivo de ambiente exemplo**

```bash
cp .env.local.example .env.local
```

2. **Edite o arquivo `.env.local` para configurar o LibSQL**

```
DB_DRIVER=libsql
LIBSQL_URL=file:./data/streamdown.db

# Configurações de autenticação
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# Configuração de IA/Chat
AI_PROVIDER=openai
OPENAI_API_KEY=sua_api_key_aqui
```

3. **Instale as dependências do projeto**

```bash
pnpm install
```

## Configuração do Banco de Dados LibSQL

Para configurar o banco de dados LibSQL local, execute o script de configuração:

```bash
pnpm db:setup-libsql
```

Este script irá:

- Criar o diretório de dados, se não existir
- Gerar migrações com base no esquema atual
- Aplicar migrações ao banco de dados LibSQL local

## Executando o Projeto

Após a configuração do banco de dados, você pode iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

O aplicativo estará disponível em <http://localhost:3000>.

## Comandos Úteis

- **Iniciar servidor de desenvolvimento**

  ```bash
  pnpm dev
  ```

- **Visualizar o banco de dados no Drizzle Studio**

  ```bash
  pnpm db:studio
  ```

- **Atualizar o esquema após mudanças**

  ```bash
  pnpm db:generate
  pnpm db:push:sqlite
  ```

- **Executar migrações específicas para LibSQL**

  ```bash
  pnpm db:migrate:libsql
  ```

## Observações

- O banco de dados será criado em `./data/streamdown.db`
- Para usar a aplicação com usuários de teste, você pode habilitar o modo de convidado definindo `ALLOW_GUEST_NO_DB=1` no `.env.local`
- Certifique-se de não compartilhar seu arquivo `.env.local` ou banco de dados com outros usuários
