# Streamdown

Uma substituição direta para react-markdown, projetada para streaming alimentado por IA.

[![npm version](https://img.shields.io/npm/v/streamdown)](https://www.npmjs.com/package/streamdown)

## Visão Geral

Formatar Markdown é fácil, mas quando você tokeniza e faz streaming, novos desafios surgem. O Streamdown foi construído especificamente para lidar com os requisitos únicos de streaming de conteúdo Markdown de modelos de IA, fornecendo formatação perfeita mesmo com blocos Markdown incompletos ou não terminados.

O Streamdown alimenta o componente [AI Elements Response](https://ai-sdk.dev/elements/components/response), mas pode ser instalado como um pacote independente para suas próprias necessidades de streaming.

## Funcionalidades

- 🚀 **Substituição direta** para `react-markdown`
- 🔄 **Otimizado para streaming** - Lida com Markdown incompleto de forma elegante
- 🎨 **Análise de blocos não terminados** - Estiliza bold, itálico, código, links e cabeçalhos incompletos
- 📊 **GitHub Flavored Markdown** - Suporte para tabelas, listas de tarefas e texto riscado
- 🔢 **Renderização matemática** - Equações LaTeX via KaTeX
- 📈 **Diagramas Mermaid** - Renderiza diagramas Mermaid como blocos de código com botão para renderizá-los
- 🎯 **Destaque de sintaxe de código** - Blocos de código bonitos com Shiki
- 🛡️ **Segurança em primeiro lugar** - Construído sobre harden-react-markdown para renderização segura
- ⚡ **Otimizado para performance** - Renderização memoizada para atualizações eficientes

## Instalação

```bash
npm i streamdown
```

Em seguida, atualize seu `globals.css` do Tailwind para incluir o seguinte.

```css
@source "../node_modules/streamdown/dist/index.js";
```

Certifique-se de que o caminho corresponda à localização da pasta `node_modules` em seu projeto. Isso garantirá que os estilos do Streamdown sejam aplicados ao seu projeto.

## Uso

### Exemplo Básico

```tsx
import { Streamdown } from 'streamdown';

export default function Page() {
  const markdown = "# Olá Mundo\n\nEste é um markdown de **streaming**!";

  return <Streamdown>{markdown}</Streamdown>;
}
```

### Diagramas Mermaid

O Streamdown suporta diagramas Mermaid usando o identificador de linguagem `mermaid`:

```tsx
import { Streamdown } from 'streamdown';
import type { MermaidConfig } from 'mermaid';

export default function Page() {
  const markdown = `
# Exemplo de Fluxograma

\`\`\`mermaid
graph TD
    A[Início] --> B{Está funcionando?}
    B -->|Sim| C[Ótimo!]
    B -->|Não| D[Debugar]
    D --> B
\`\`\`

# Diagrama de Sequência

\`\`\`mermaid
sequenceDiagram
    participant Usuário
    participant API
    participant Banco de Dados

    Usuário->>API: Solicitar dados
    API->>Banco de Dados: Consulta
    Banco de Dados-->>API: Resultados
    API-->>Usuário: Resposta
\`\`\`
  `;

  // Opcional: Personalizar tema e cores do Mermaid
  const mermaidConfig: MermaidConfig = {
    theme: 'dark',
    themeVariables: {
      primaryColor: '#ff0000',
      primaryTextColor: '#fff'
    }
  };

  return (
    <Streamdown mermaidConfig={mermaidConfig}>
      {markdown}
    </Streamdown>
  );
}
```

### Com AI SDK

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Streamdown } from 'streamdown';

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.filter(part => part.type === 'text').map((part, index) => (
            <Streamdown key={index}>{part.text}</Streamdown>
          ))}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
          placeholder="Digite algo..."
        />
        <button type="submit" disabled={status !== 'ready'}>
          Enviar
        </button>
      </form>
    </>
  );
}
```

## Props

O Streamdown aceita todas as mesmas props do react-markdown, além de opções adicionais específicas para streaming:

| Prop | Tipo | Padrão | Descrição |
|------|------|---------|-------------|
| `children` | `string` | - | O conteúdo Markdown para renderizar |
| `parseIncompleteMarkdown` | `boolean` | `true` | Analisar e estilizar blocos Markdown não terminados |
| `className` | `string` | - | Classe CSS para o contêiner |
| `components` | `object` | - | Sobrescrições de componentes personalizados |
| `remarkPlugins` | `array` | `[remarkGfm, remarkMath]` | Plugins Remark a usar |
| `rehypePlugins` | `array` | `[rehypeKatex]` | Plugins Rehype a usar |
| `allowedImagePrefixes` | `array` | `['*']` | Prefixos de URL de imagem permitidos |
| `allowedLinkPrefixes` | `array` | `['*']` | Prefixos de URL de link permitidos |
| `defaultOrigin` | `string` | - | Origem padrão para usar em URLs relativas em links e imagens |
| `shikiTheme` | `[BundledTheme, BundledTheme]` | `['github-light', 'github-dark']` | Os temas claro e escuro para usar em blocos de código |
| `mermaidConfig` | `MermaidConfig` | - | Configuração personalizada para diagramas Mermaid (tema, cores, etc.) |
| `controls` | `boolean \| { table?: boolean, code?: boolean, mermaid?: boolean }` | `true` | Controlar visibilidade dos botões copiar/baixar |

## Arquitetura

O Streamdown é construído como um monorepo com:

- **`packages/streamdown`** - A biblioteca de componentes React principal
- **`apps/website`** - Site de documentação e demonstrações

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Compilar o pacote streamdown
pnpm --filter streamdown build

# Executar servidor de desenvolvimento
pnpm dev

# Executar testes
pnpm test

# Compilar pacotes
pnpm build
```

## Requisitos

- Node.js >= 18
- React >= 19.1.1

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.
