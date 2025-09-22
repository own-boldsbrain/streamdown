# Dados Mock para Testes Visuais - Streamdown

Este diretório contém dados mock e componentes de demonstração para testar visualmente todos os componentes de visualização do Streamdown.

## 📁 Estrutura dos Arquivos

- `mock-visualization-data.ts` - Dados mock estruturados para todos os componentes
- `visualization-demo.tsx` - Componente React que demonstra todos os componentes

## 🎯 Componentes Suportados

### 1. VizAudioWaveform

- **Prop**: `audioSrc` (não `src`)
- **Dados**: URLs de arquivos de áudio de exemplo
- **Funcionalidades**: Visualização de waveform em tempo real, controles de reprodução

### 2. VizMermaidDiagram

- **Prop**: `code` (código Mermaid)
- **Dados**: Diagramas de fluxo, sequência, classes e Gantt
- **Funcionalidades**: Renderização de diagramas Mermaid.js

### 3. VizDataTable

- **Prop**: `data` (array de objetos ou string JSON)
- **Dados**: Tabelas de usuários, vendas e métricas
- **Funcionalidades**: Ordenação, formatação automática

### 4. VizCallout

- **Props**: `type`, `title`, `children`
- **Tipos**: `info`, `warning`, `error`, `success`, `note`
- **Funcionalidades**: Callouts contextuais com ícones

### 5. VizLightbox

- **Props**: `src`, `alt`
- **Dados**: URLs de imagens de exemplo (Picsum)
- **Funcionalidades**: Visualização em tela cheia, zoom, rotação

### 6. VizPremiumMedia

- **Props**: `src`, `type`, `title`
- **Tipos**: `video`, `audio`, `pdf`
- **Funcionalidades**: Player de vídeo/áudio, visualizador PDF

## 🚀 Como Usar

### Importação Básica

```typescript
import { mockVisualizationData, getMockData, getMockItem } from './lib/test-data/mock-visualization-data';

// Obter todos os dados de um tipo
const audioData = getMockData('audioWaveform');

// Obter um item específico
const firstDiagram = getMockItem('mermaidDiagrams', 0);
```

### Uso no Componente de Demonstração

```tsx
import VisualizationDemo from './lib/test-data/visualization-demo';

// Renderizar todos os componentes de uma vez
<VisualizationDemo />
```

### Exemplo Individual

```tsx
import VizMermaidDiagram from './lib/viz/viz-mermaid-diagram';
import { getMockItem } from './lib/test-data/mock-visualization-data';

const diagram = getMockItem('mermaidDiagrams', 0);

<VizMermaidDiagram
  code={diagram.code}
  className="w-full"
/>
```

## 📊 Estrutura dos Dados

```typescript
type MockVisualizationData = {
  audioWaveform: Array<{
    title: string;
    src: string;
    description: string;
  }>;
  mermaidDiagrams: Array<{
    title: string;
    code: string;
    description: string;
  }>;
  dataTables: Array<{
    title: string;
    data: Record<string, unknown>[] | string;
    description: string;
  }>;
  callouts: Array<{
    title: string;
    type: "info" | "warning" | "error" | "success" | "note";
    content: string;
    description: string;
  }>;
  lightboxImages: Array<{
    title: string;
    src: string;
    alt: string;
    description: string;
  }>;
  premiumMedia: Array<{
    title: string;
    type: "video" | "audio" | "pdf";
    src: string;
    description: string;
  }>;
}
```

## 🎨 URLs de Exemplo

- **Imagens**: Usamos Picsum Photos para imagens de exemplo
- **Vídeos**: Vídeos de exemplo do Google (Big Buck Bunny, Elephants Dream)
- **Áudio**: Arquivos de áudio de exemplo (bell-ringing.wav)
- **PDF**: PDF de exemplo do W3C

## 🧪 Cenários de Teste

### Testes de Funcionalidade

- ✅ Renderização correta de todos os componentes
- ✅ Interação com controles (play/pause, volume, etc.)
- ✅ Responsividade em diferentes tamanhos de tela
- ✅ Estados de loading e erro

### Testes de Acessibilidade

- ✅ Atributos ARIA apropriados
- ✅ Navegação por teclado
- ✅ Contraste de cores adequado
- ✅ Textos alternativos para imagens

### Testes de Performance

- ✅ Carregamento eficiente de recursos
- ✅ Animações suaves (60fps)
- ✅ Gerenciamento adequado de memória
- ✅ Cleanup de event listeners

## 🔧 Desenvolvimento

Para adicionar novos dados mock:

1. Adicione o novo tipo ao `MockVisualizationData`
2. Inclua dados de exemplo no objeto `mockVisualizationData`
3. Atualize o componente `VisualizationDemo` se necessário
4. Teste visualmente no browser

## 📈 Estatísticas do Dataset

- **6 tipos de componentes** cobertos
- **25+ exemplos** individuais
- **100% de cobertura** dos componentes implementados
- **URLs reais** para testes funcionais

---

Esses dados mock fornecem uma base sólida para testar e demonstrar todas as funcionalidades dos componentes de visualização do Streamdown.
