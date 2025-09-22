# Componentes de Visualização (Viz) do Streamdown

Este documento fornece instruções sobre como utilizar os componentes de visualização disponíveis no Streamdown e como utilizar os dados mock para testes visuais.

## Índice

- [Visão Geral](#visão-geral)
- [Componentes Disponíveis](#componentes-disponíveis)
- [Utilizando os Dados Mock](#utilizando-os-dados-mock)
- [Página de Teste Visual](#página-de-teste-visual)
- [Implementando em Seu Projeto](#implementando-em-seu-projeto)
- [Desenvolvimento de Novos Componentes](#desenvolvimento-de-novos-componentes)

## Visão Geral

A biblioteca Streamdown oferece um conjunto de componentes de visualização para enriquecer a experiência de renderização de conteúdo Markdown, especialmente quando streaming conteúdo de IA. Estes componentes permitem exibir diversos tipos de mídia e visualizações, como áudio, diagramas, tabelas, notificações (callouts), imagens com lightbox e mídia premium (vídeo, áudio avançado e PDF).

## Componentes Disponíveis

### VizAudioWaveform

Renderiza um player de áudio com visualização de forma de onda.

```tsx
import { VizAudioWaveform } from "streamdown";

<VizAudioWaveform 
  src="caminho/para/audio.mp3"
  title="Título do áudio"
  waveColor="#4f46e5"
  progressColor="#8b5cf6"
  autoPlay={false}
/>
```

**Propriedades principais:**
- `src`: URL do arquivo de áudio (obrigatório)
- `title`: Título do áudio (opcional)
- `waveColor`: Cor da forma de onda (opcional, padrão: "#333333")
- `progressColor`: Cor da forma de onda para a parte reproduzida (opcional, padrão: "#4f46e5")
- `autoPlay`: Iniciar reprodução automaticamente (opcional, padrão: false)
- `barWidth`: Largura das barras na visualização (opcional)
- `barGap`: Espaçamento entre barras (opcional)
- `barRadius`: Raio do arredondamento das barras (opcional)

### VizMermaidDiagram

Renderiza diagramas usando a biblioteca Mermaid.js.

```tsx
import { VizMermaidDiagram } from "streamdown";

<VizMermaidDiagram 
  code="flowchart TD\nA[Início] --> B{Decisão}\nB -->|Sim| C[Ação 1]\nB -->|Não| D[Ação 2]"
  title="Diagrama de fluxo básico"
/>
```

**Propriedades principais:**
- `code`: Código Mermaid para renderizar o diagrama (obrigatório)
- `title`: Título do diagrama (opcional)

### VizDataTable

Renderiza tabelas de dados a partir de arrays ou objetos JSON.

```tsx
import { VizDataTable } from "streamdown";

<VizDataTable 
  data={[
    { id: 1, nome: "João", email: "joao@exemplo.com" },
    { id: 2, nome: "Maria", email: "maria@exemplo.com" }
  ]}
  title="Tabela de Usuários"
  zebra={true}
/>
```

**Propriedades principais:**
- `data`: Array de objetos ou string JSON (obrigatório)
- `title`: Título da tabela (opcional)
- `zebra`: Aplicar listrado zebra nas linhas (opcional, padrão: false)

### VizCallout

Renderiza blocos de destaque para informações importantes.

```tsx
import { VizCallout } from "streamdown";

<VizCallout 
  type="note"
  title="Observação importante"
>
  Esta é uma nota que destaca informações adicionais relevantes para o contexto atual.
</VizCallout>
```

**Propriedades principais:**
- `type`: Tipo do callout ("note", "tip", "warning", "error", "info") (obrigatório)
- `title`: Título do callout (opcional)
- `children`: Conteúdo do callout (obrigatório)

### VizLightbox

Renderiza um visualizador de imagens em tela cheia com zoom e controles.

```tsx
import { VizLightbox } from "streamdown";
import { useState } from "react";

function ImageViewer() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <img 
        src="caminho/para/imagem.jpg" 
        alt="Descrição da imagem" 
        onClick={() => setIsOpen(true)}
      />
      
      {isOpen && (
        <VizLightbox 
          src="caminho/para/imagem.jpg"
          alt="Descrição da imagem"
          title="Título da imagem"
          caption="Legenda da imagem"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
```

**Propriedades principais:**
- `src`: URL da imagem (obrigatório)
- `alt`: Texto alternativo (obrigatório para acessibilidade)
- `title`: Título da imagem (opcional)
- `caption`: Legenda da imagem (opcional)
- `isOpen`: Estado de abertura do lightbox (obrigatório)
- `onClose`: Função para fechar o lightbox (obrigatório)

### VizPremiumMedia

Renderiza mídia premium (vídeo, áudio avançado, PDF) com controles.

```tsx
import { VizPremiumMedia } from "streamdown";

<VizPremiumMedia 
  src="caminho/para/video.mp4"
  type="video"
  title="Título do vídeo"
  poster="caminho/para/thumbnail.jpg"
  controls={true}
  downloadable={true}
/>
```

**Propriedades principais:**
- `src`: URL do arquivo de mídia (obrigatório)
- `type`: Tipo de mídia ("video", "audio", "pdf") (obrigatório)
- `title`: Título da mídia (opcional)
- `poster`: URL da imagem de capa para vídeos (opcional)
- `autoPlay`: Iniciar reprodução automaticamente (opcional, padrão: false)
- `controls`: Exibir controles de reprodução (opcional, padrão: true)
- `downloadable`: Permitir download da mídia (opcional, padrão: false)

### VizObjectStream

Além dos componentes de visualização de mídia, o Streamdown também inclui o componente `VizObjectStream` para visualização de objetos JSON em streaming, documentado em detalhe no arquivo existente.

## Utilizando os Dados Mock

Os dados mock estão disponíveis no arquivo `packages/streamdown/lib/viz/mock-data.ts` e fornecem exemplos para todos os componentes de visualização. Esses dados podem ser usados para testar os componentes durante o desenvolvimento ou para criar exemplos de demonstração.

```tsx
import { 
  audioWaveformMocks,
  mermaidDiagramMocks,
  dataTableMocks,
  calloutMocks,
  lightboxMocks,
  premiumMediaMocks,
  allMocks // Todos os mocks em um único objeto
} from "streamdown/lib/viz/mock-data";

// Exemplo de uso
<VizAudioWaveform {...audioWaveformMocks.standard} />
<VizMermaidDiagram {...mermaidDiagramMocks.flowchart} />
<VizDataTable {...dataTableMocks.users} />
<VizCallout {...calloutMocks.note} />
```

Cada conjunto de dados mock contém vários exemplos com diferentes configurações:

- **audioWaveformMocks**: standard, autoplay, bars, error
- **mermaidDiagramMocks**: flowchart, sequence, class, gantt, error
- **dataTableMocks**: users, products, wideTable, empty, invalid
- **calloutMocks**: note, tip, warning, error, info, noTitle, complexContent
- **lightboxMocks**: simple, highRes, tall, wide, broken
- **premiumMediaMocks**: video, audio, pdf, videoNoControls, audioAutoplay, error

## Página de Teste Visual

A biblioteca inclui uma página de teste visual em `packages/streamdown/lib/viz/viz-test-page.tsx` que permite visualizar todos os componentes com diferentes configurações. Esta página pode ser integrada em um aplicativo Next.js para testar os componentes em um ambiente real.

Para usar a página de teste:

1. Importe-a em um projeto Next.js:

```tsx
// app/test/page.tsx
"use client";

import VizTestPage from "streamdown/lib/viz/viz-test-page";

export default function TestPage() {
  return <VizTestPage />;
}
```

2. Acesse a rota `/test` no seu aplicativo para visualizar todos os componentes.

## Implementando em Seu Projeto

Para usar os componentes de visualização em seu projeto:

1. Instale o Streamdown:

```bash
npm install streamdown
# ou
yarn add streamdown
# ou
pnpm add streamdown
```

2. Importe os componentes necessários:

```tsx
import { 
  VizAudioWaveform,
  VizMermaidDiagram,
  VizDataTable,
  VizCallout,
  VizLightbox,
  VizPremiumMedia
} from "streamdown";
```

3. Use os componentes em seu código conforme necessário.

## Desenvolvimento de Novos Componentes

Para desenvolver novos componentes de visualização para o Streamdown:

1. Crie um novo arquivo na pasta `packages/streamdown/lib/viz/` seguindo o padrão de nomenclatura `viz-[nome-do-componente].tsx`.

2. Implemente o componente seguindo as convenções existentes:
   - Use "use client" para componentes de cliente
   - Utilize o padrão de memo para otimização
   - Adicione tipos TypeScript adequados
   - Inclua atributos de acessibilidade
   - Utilize o utilitário `cn` para classes CSS

3. Adicione dados mock para o componente no arquivo `mock-data.ts`.

4. Atualize a página de teste para incluir seu novo componente.

5. Documente o componente neste arquivo de documentação.

6. Adicione testes para seu componente em `packages/streamdown/__tests__/viz/`.

---

Esperamos que estes componentes e ferramentas ajudem a enriquecer suas aplicações com recursos visuais avançados para conteúdo Markdown streaming. Em caso de dúvidas ou problemas, consulte a documentação completa ou abra uma issue no repositório do projeto.