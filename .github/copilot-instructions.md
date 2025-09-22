# Instruções para Agentes de IA - Streamdown

O Streamdown é uma biblioteca de renderização Markdown otimizada para streaming de conteúdo de IA, projetada como substituição direta para `react-markdown` com funcionalidades específicas para aplicações de IA.

## Arquitetura e Componentes

### Estrutura Principal

- **Componente Streamdown**: Ponto de entrada em `packages/streamdown/index.tsx`
- **Conceito de Blocos**: Markdown é dividido em blocos via `parseMarkdownIntoBlocks` e renderizado separadamente
- **Parsing Inteligente**: `parseIncompleteMarkdown` em `lib/parse-incomplete-markdown.ts` processa tokens Markdown incompletos durante streaming
- **Shiki Integration**: Renderização de blocos de código com temas claro/escuro em `lib/code-block.tsx`

### Fluxo de Dados

1. Texto entra no componente `Streamdown`
2. É dividido em blocos usando o lexer Marked
3. Cada bloco é processado para completar tokens incompletos
4. Renderizado através de ReactMarkdown (hardened) com componentes personalizados

## Padrões e Convenções

### Segurança

- Utiliza `harden-react-markdown` para sanitização de conteúdo
- Controles detalhados para links e imagens via `allowedLinkPrefixes` e `allowedImagePrefixes`

### Estilo e Formatação

- Sistema baseado em utilitários CSS (`cn` usando Tailwind)
- Componentes com atributos `data-*` para testabilidade (`data-streamdown`, `data-code-block`, etc.)
- Integração com dark/light mode via contexto `ShikiThemeContext`

### Performance

- Memoização extensiva via `useMemo` e componentes `memo`
- Carregamento de linguagens sob demanda para Shiki
- Singleton `HighlighterManager` para gerenciar highlighters Shiki

## Casos de Uso Especiais

### Processamento de Markdown Incompleto

```tsx
// Exemplo de como o Streamdown lida com markdown incompleto
const content = "Text with **incomplete bold";
<Streamdown>{content}</Streamdown>;
// Renderiza como: "Text with **incomplete bold**" (fechando o token)
```

### Streaming de Blocos de Código

- Suporte para +100 linguagens via Shiki
- Carregamento assíncrono de gramáticas
- Troca de tema claro/escuro sem re-render

### Integração Matemática e Diagramas

- Equações LaTeX via KaTeX
- Diagramas interativos via Mermaid
- Parsing especial para blocos matemáticos não fechados

## Fluxo de Desenvolvimento

### Comandos Essenciais

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev

# Testes
pnpm test
pnpm test:ui
pnpm test:coverage

# Build
pnpm build
```

### Padrão de Testes

- Testes unitários usando Vitest
- Testes de componentes usando Testing Library
- Casos de teste específicos para RTL, análise de blocos incompletos, e recursos especiais

## Práticas para Contribuição

### Alterações de Código

- Criar/atualizar testes para todas as mudanças
- Utilizar changesets para documentar alterações (`pnpm changeset`)
- Seguir conventional commits (`feat:`, `fix:`, etc.)
- Sempre verificar suporte a RTL (Right-to-Left) para internacionalização

### Problemas Comuns

- Tratamento especial para tokens Markdown dentro de blocos de código
- Considerações de segurança para conteúdo dinâmico
- Compatibilidade com bibliotecas externas (KaTeX, Mermaid)

## Compatibilidade e Requisitos

- React ≥ 18.0.0 ou ≥ 19.0.0
- Node.js ≥ 18
- Respeito às APIs existentes de `react-markdown` para facilitar migração
