# Streamdown

Uma substituição direta para react-markdown, projetada para streaming alimentado por IA.

[![npm version](https://img.shields.io/npm/v/streamdown)](https://www.npmjs.com/package/streamdown)

## Visão Geral

O Streamdown é uma biblioteca React otimizada para renderização de Markdown em tempo real durante streaming de conteúdo de modelos de IA. Formatar Markdown é fácil, mas quando você tokeniza e faz streaming, novos desafios surgem. Esta biblioteca foi construída especificamente para lidar com esses requisitos únicos.

## Estrutura do Projeto

Este é um monorepo que contém:

- **`packages/streamdown`** - A biblioteca de componentes React principal
- **`apps/website`** - Site de documentação e demonstrações  
- **`apps/test`** - Aplicação para testes e desenvolvimento

## Início Rápido

```bash
# Instalar dependências
pnpm install

# Compilar o pacote principal
pnpm --filter streamdown build

# Executar ambiente de desenvolvimento
pnpm dev
```

## Funcionalidades Principais

- 🚀 **Substituição direta** para `react-markdown`
- 🔄 **Otimizado para streaming** - Lida com Markdown incompleto elegantemente
- 🎨 **Análise de blocos não terminados** - Estiliza conteúdo incompleto
- 📊 **GitHub Flavored Markdown** - Suporte completo
- 🔢 **Renderização matemática** - Equações LaTeX via KaTeX
- 📈 **Diagramas Mermaid** - Renderização interativa
- 🎯 **Destaque de sintaxe** - Blocos de código bonitos com Shiki
- 🛡️ **Segurança em primeiro lugar** - Renderização segura
- ⚡ **Otimizado para performance** - Renderização memoizada

## Documentação

Para documentação completa, exemplos e guias de uso, consulte:

- [Documentação do pacote](./packages/streamdown/README.md)
- [Site de documentação](./apps/website/) (executar com `pnpm dev`)

## Desenvolvimento

```bash
# Executar testes
pnpm test

# Linting
pnpm lint

# Formatação de código
pnpm format

# Verificação de tipos
pnpm check-types
```

## Requisitos

- Node.js >= 18
- React >= 19.1.1
- pnpm (gerenciador de pacotes)

## Contribuindo

Contribuições são bem-vindas! Consulte [CONTRIBUTING.md](./CONTRIBUTING.md) para diretrizes.

## Licença

[MIT](./LICENSE)