// Constantes para repetições de texto no conteúdo longo
const REPEAT_INTRO = 50;
const REPEAT_HISTORY = 40;
const REPEAT_STATE_OF_ART = 60;
const REPEAT_ETHICS = 35;
const REPEAT_FUTURE = 45;
const REPEAT_CONCLUSION = 20;

// Dados para VizAudioWaveform
export const audioWaveformMocks = {
  // Áudio padrão com URL pública
  standard: {
    src: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-0.mp3",
    title: "Amostra de áudio padrão",
    waveColor: "#4f46e5",
    progressColor: "#8b5cf6",
    autoPlay: false,
  },
  // Exemplo com autoplay
  autoplay: {
    src: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3",
    title: "Amostra com autoplay",
    waveColor: "#06b6d4",
    progressColor: "#0ea5e9",
    autoPlay: true,
  },
  // Exemplo com barras (visualização alternativa)
  bars: {
    src: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-2.mp3",
    title: "Visualização em barras",
    waveColor: "#f43f5e",
    progressColor: "#ec4899",
    barWidth: 3,
    barGap: 2,
    barRadius: 2,
    autoPlay: false,
  },
  // Exemplo com erros
  error: {
    src: "https://invalid-url-that-will-fail.mp3",
    title: "Amostra com erro",
    waveColor: "#f97316",
    progressColor: "#ea580c",
    autoPlay: false,
  }
};

// Dados para VizMermaidDiagram
export const mermaidDiagramMocks = {
  // Diagrama de fluxo simples
  flowchart: {
    code: `flowchart TD
    A[Início] --> B{Decisão}
    B -->|Sim| C[Ação 1]
    B -->|Não| D[Ação 2]
    C --> E[Fim]
    D --> E`,
    title: "Diagrama de fluxo básico",
  },
  // Diagrama de sequência
  sequence: {
    code: `sequenceDiagram
    participant U as Usuário
    participant S as Sistema
    participant DB as Banco de Dados
    U->>S: Requisição
    S->>DB: Consulta
    DB-->>S: Resposta
    S-->>U: Exibe resultado`,
    title: "Diagrama de sequência",
  },
  // Diagrama de classe
  class: {
    code: `classDiagram
    class Animal {
      +String nome
      +idade: int
      +comer()
      +dormir()
    }
    class Cachorro {
      +String raça
      +latir()
    }
    Animal <|-- Cachorro`,
    title: "Diagrama de classe",
  },
  // Diagrama de gantt
  gantt: {
    code: `gantt
    title Cronograma do Projeto
    dateFormat  YYYY-MM-DD
    section Planejamento
    Análise de requisitos    :a1, 2025-09-01, 10d
    Design                   :a2, after a1, 15d
    section Desenvolvimento
    Implementação            :a3, after a2, 30d
    Testes                   :a4, after a3, 15d
    section Entrega
    Deployment               :a5, after a4, 5d
    Manutenção               :a6, after a5, 10d`,
    title: "Diagrama de Gantt",
  },
  // Exemplo com erro de sintaxe
  error: {
    code: `flowchart TD
    A[Início] -- B{Decisão} // Erro de sintaxe aqui
    B -->|Sim| C[Ação 1]
    B -->|Não| D[Ação 2]`,
    title: "Diagrama com erro de sintaxe",
  }
};

// Dados para VizDataTable
export const dataTableMocks = {
  // Tabela simples de usuários
  users: {
    data: [
      { id: 1, nome: "João Silva", email: "joao@exemplo.com", idade: 28, cargo: "Desenvolvedor" },
      { id: 2, nome: "Maria Oliveira", email: "maria@exemplo.com", idade: 34, cargo: "Designer" },
      { id: 3, nome: "Pedro Santos", email: "pedro@exemplo.com", idade: 42, cargo: "Gerente" },
      { id: 4, nome: "Ana Costa", email: "ana@exemplo.com", idade: 25, cargo: "Analista" },
      { id: 5, nome: "Carlos Souza", email: "carlos@exemplo.com", idade: 31, cargo: "Arquiteto" }
    ],
    title: "Tabela de Usuários",
    zebra: true,
  },
  // Tabela de produtos
  products: {
    data: [
      { id: "P001", nome: "Notebook", preco: 3599.99, estoque: 15, categoria: "Eletrônicos" },
      { id: "P002", nome: "Smartphone", preco: 2499.99, estoque: 28, categoria: "Eletrônicos" },
      { id: "P003", nome: "Monitor", preco: 1299.99, estoque: 10, categoria: "Periféricos" },
      { id: "P004", nome: "Teclado", preco: 299.99, estoque: 45, categoria: "Periféricos" },
      { id: "P005", nome: "Mouse", preco: 129.99, estoque: 60, categoria: "Periféricos" }
    ],
    title: "Catálogo de Produtos",
    zebra: false,
  },
  // Tabela com muitas colunas
  wideTable: {
    data: [
      { col1: "Dado 1", col2: "Valor 2", col3: "Item 3", col4: "Exemplo 4", col5: "Teste 5", col6: "Amostra 6", col7: "Linha 7", col8: "Coluna 8", col9: "Célula 9", col10: "Final 10" },
      { col1: "Dado A", col2: "Valor B", col3: "Item C", col4: "Exemplo D", col5: "Teste E", col6: "Amostra F", col7: "Linha G", col8: "Coluna H", col9: "Célula I", col10: "Final J" },
      { col1: "Dado X", col2: "Valor Y", col3: "Item Z", col4: "Exemplo W", col5: "Teste V", col6: "Amostra U", col7: "Linha T", col8: "Coluna S", col9: "Célula R", col10: "Final Q" }
    ],
    title: "Tabela com Muitas Colunas",
    zebra: true,
  },
  // Tabela vazia
  empty: {
    data: [],
    title: "Tabela Vazia",
    zebra: true,
  },
  // Dados inválidos
  invalid: {
    data: "isso não é um array válido",
    title: "Tabela com Dados Inválidos",
    zebra: true,
  }
};

// Dados para VizCallout
export const calloutMocks = {
  // Callout de nota
  note: {
    type: "note",
    title: "Observação importante",
    children: "Esta é uma nota que destaca informações adicionais relevantes para o contexto atual."
  },
  // Callout de dica
  tip: {
    type: "tip",
    title: "Dica útil",
    children: "Aqui está uma dica que pode ajudar a melhorar seu fluxo de trabalho ou compreensão."
  },
  // Callout de aviso
  warning: {
    type: "warning",
    title: "Atenção",
    children: "Este é um aviso sobre possíveis problemas que podem ocorrer se certas condições não forem atendidas."
  },
  // Callout de erro
  error: {
    type: "error",
    title: "Erro crítico",
    children: "Este é um alerta sobre um erro grave que precisa ser resolvido imediatamente."
  },
  // Callout de informação
  info: {
    type: "info",
    title: "Informação",
    children: "Esta é uma informação adicional que pode ser útil para entender o contexto."
  },
  // Callout sem título
  noTitle: {
    type: "note",
    children: "Este é um callout sem título especificado."
  },
  // Callout com conteúdo mais complexo
  complexContent: {
    type: "info",
    title: "Conteúdo Complexo",
    children: `
      <p>Este callout contém <strong>conteúdo formatado</strong> incluindo:</p>
      <ul>
        <li>Itens de lista</li>
        <li>Com <em>formatação</em> variada</li>
      </ul>
      <p>E também pode incluir <code>código inline</code>.</p>
    `
  }
};

// Dados para VizLightbox
export const lightboxMocks = {
  // Imagem simples
  simple: {
    src: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?q=80&w=1000",
    alt: "Imagem de paisagem",
    title: "Paisagem natural",
  },
  // Imagem com alta resolução
  highRes: {
    src: "https://images.unsplash.com/photo-1612178537253-bccd437b730e?q=80&w=2000",
    alt: "Imagem de alta resolução",
    title: "Foto em alta definição",
    caption: "Esta imagem possui alta resolução e pode ser ampliada para visualizar detalhes."
  },
  // Imagem com proporções extremas (muito alta)
  tall: {
    src: "https://images.unsplash.com/photo-1696842270927-e828c5a99b76?q=80&w=600&h=1200",
    alt: "Imagem alta e estreita",
    title: "Formato vertical",
    caption: "Exemplo de imagem com formato vertical extremo."
  },
  // Imagem com proporções extremas (muito larga)
  wide: {
    src: "https://images.unsplash.com/photo-1609948543931-f1ecd29a5298?q=80&w=1600&h=400",
    alt: "Imagem larga e baixa",
    title: "Formato panorâmico",
    caption: "Exemplo de imagem com formato panorâmico."
  },
  // Imagem quebrada (URL inválida)
  broken: {
    src: "https://url-invalida-que-vai-falhar.jpg",
    alt: "Imagem com URL inválida",
    title: "Imagem quebrada",
    caption: "Esta imagem não carregará corretamente devido a uma URL inválida."
  }
};

// Dados para VizPremiumMedia
export const premiumMediaMocks = {
  // Vídeo
  video: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "video",
    title: "Big Buck Bunny",
    poster: "https://peach.blender.org/wp-content/uploads/bbb-splash.png",
    autoPlay: false,
    controls: true,
    downloadable: true,
  },
  // Áudio
  audio: {
    src: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-3.mp3",
    type: "audio",
    title: "Amostra de áudio premium",
    autoPlay: false,
    controls: true,
    downloadable: true,
  },
  // PDF
  pdf: {
    src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "pdf",
    title: "Documento PDF de exemplo",
    downloadable: true,
  },
  // Vídeo sem controles
  videoNoControls: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    type: "video",
    title: "Elephants Dream",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    autoPlay: false,
    controls: false,
    downloadable: false,
  },
  // Áudio com autoplay
  audioAutoplay: {
    src: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-4.mp3",
    type: "audio",
    title: "Áudio com autoplay",
    autoPlay: true,
    controls: true,
    downloadable: false,
  },
  // Mídia com erro
  error: {
    src: "https://url-invalida-que-vai-falhar.mp4",
    type: "video",
    title: "Vídeo com erro",
    autoPlay: false,
    controls: true,
    downloadable: false,
  }
};

// Exportar todos os mocks em um objeto único para facilitar o acesso
export const allMocks = {
  audioWaveform: audioWaveformMocks,
  mermaidDiagram: mermaidDiagramMocks,
  dataTable: dataTableMocks,
  callout: calloutMocks,
  lightbox: lightboxMocks,
  premiumMedia: premiumMediaMocks
};

// Dados para VizCitations
export const citationsMocks = {
  // Citações simples
  simple: {
    citations: [
      {
        id: "cit-1",
        text: "Segundo Smith (2023), a inteligência artificial está revolucionando diversos setores da economia.",
        sourceId: "src-1",
        type: "inline" as const,
        position: { start: 10, end: 25 }
      },
      {
        id: "cit-2",
        text: "Como demonstrado por Johnson et al. (2022), os algoritmos de aprendizado profundo superam os métodos tradicionais em tarefas de classificação.",
        sourceId: "src-2",
        type: "footnote" as const,
        position: { start: 50, end: 75 }
      }
    ],
    sources: [
      {
        id: "src-1",
        title: "Inteligência Artificial: O Futuro da Tecnologia",
        authors: ["John Smith"],
        year: 2023,
        journal: "Journal of Technology Studies",
        doi: "10.1234/jts.2023.001",
        url: "https://example.com/smith2023",
        reliability: "high" as const,
        relevance: 0.95,
        accessedDate: "2024-01-15"
      },
      {
        id: "src-2",
        title: "Deep Learning vs Traditional Methods: A Comparative Study",
        authors: ["Jane Johnson", "Mike Davis", "Sarah Wilson"],
        year: 2022,
        journal: "AI Research Quarterly",
        doi: "10.5678/arq.2022.045",
        url: "https://example.com/johnson2022",
        reliability: "medium" as const,
        relevance: 0.88,
        accessedDate: "2024-01-10"
      }
    ]
  },
  // Citações múltiplas com mesma fonte
  multipleSameSource: {
    citations: [
      {
        id: "cit-3",
        text: "A pesquisa de Brown (2021) indica que...",
        sourceId: "src-3",
        type: "inline" as const,
        position: { start: 0, end: 15 }
      },
      {
        id: "cit-4",
        text: "Brown (2021) também demonstra que...",
        sourceId: "src-3",
        type: "inline" as const,
        position: { start: 30, end: 45 }
      },
      {
        id: "cit-5",
        text: "Conforme discutido por Brown (2021),...",
        sourceId: "src-3",
        type: "footnote" as const,
        position: { start: 60, end: 75 }
      }
    ],
    sources: [
      {
        id: "src-3",
        title: "Comprehensive Analysis of Machine Learning Applications",
        authors: ["David Brown"],
        year: 2021,
        journal: "Machine Learning Journal",
        doi: "10.9012/mlj.2021.078",
        url: "https://example.com/brown2021",
        reliability: "high" as const,
        relevance: 0.92,
        accessedDate: "2024-01-12"
      }
    ]
  },
  // Citações com diferentes níveis de confiabilidade
  reliabilityLevels: {
    citations: [
      {
        id: "cit-6",
        text: "Fonte confiável: Garcia (2024)...",
        sourceId: "src-4",
        type: "inline" as const,
        position: { start: 0, end: 20 }
      },
      {
        id: "cit-7",
        text: "Fonte média: Lee (2023)...",
        sourceId: "src-5",
        type: "inline" as const,
        position: { start: 25, end: 40 }
      },
      {
        id: "cit-8",
        text: "Fonte baixa: Blog pessoal (2022)...",
        sourceId: "src-6",
        type: "footnote" as const,
        position: { start: 45, end: 60 }
      }
    ],
    sources: [
      {
        id: "src-4",
        title: "Peer-Reviewed Study on AI Ethics",
        authors: ["Maria Garcia"],
        year: 2024,
        journal: "Ethics in Computing",
        doi: "10.3456/eic.2024.012",
        url: "https://example.com/garcia2024",
        reliability: "high" as const,
        relevance: 0.89,
        accessedDate: "2024-01-14"
      },
      {
        id: "src-5",
        title: "Industry Report on AI Trends",
        authors: ["Kevin Lee"],
        year: 2023,
        journal: "Tech Industry Report",
        url: "https://example.com/lee2023",
        reliability: "medium" as const,
        relevance: 0.76,
        accessedDate: "2024-01-13"
      },
      {
        id: "src-6",
        title: "Personal Blog: My Thoughts on AI",
        authors: ["Anonymous Blogger"],
        year: 2022,
        url: "https://personalblog.example.com/ai-thoughts",
        reliability: "low" as const,
        relevance: 0.45,
        accessedDate: "2024-01-11"
      }
    ]
  }
};

// Dados para VizSourcesList
export const sourcesListMocks = {
  // Lista básica de fontes
  basic: {
    sources: [
      {
        id: "src-1",
        title: "Inteligência Artificial: O Futuro da Tecnologia",
        authors: ["John Smith"],
        year: 2023,
        journal: "Journal of Technology Studies",
        doi: "10.1234/jts.2023.001",
        url: "https://example.com/smith2023",
        reliability: "high" as const,
        relevance: 0.95,
        accessedDate: "2024-01-15",
        abstract: "Este artigo explora o impacto da IA em diversos setores tecnológicos e econômicos.",
        keywords: ["inteligência artificial", "tecnologia", "inovação"]
      },
      {
        id: "src-2",
        title: "Deep Learning vs Traditional Methods: A Comparative Study",
        authors: ["Jane Johnson", "Mike Davis", "Sarah Wilson"],
        year: 2022,
        journal: "AI Research Quarterly",
        doi: "10.5678/arq.2022.045",
        url: "https://example.com/johnson2022",
        reliability: "medium" as const,
        relevance: 0.88,
        accessedDate: "2024-01-10",
        abstract: "Comparação entre algoritmos de deep learning e métodos tradicionais de machine learning.",
        keywords: ["deep learning", "machine learning", "comparação"]
      },
      {
        id: "src-3",
        title: "Comprehensive Analysis of Machine Learning Applications",
        authors: ["David Brown"],
        year: 2021,
        journal: "Machine Learning Journal",
        doi: "10.9012/mlj.2021.078",
        url: "https://example.com/brown2021",
        reliability: "high" as const,
        relevance: 0.92,
        accessedDate: "2024-01-12",
        abstract: "Análise abrangente das aplicações práticas do machine learning em diferentes domínios.",
        keywords: ["machine learning", "aplicações", "análise"]
      }
    ],
    initialExpanded: false,
    showFilters: true,
    showSorting: true
  },
  // Lista expandida por padrão
  expanded: {
    sources: [
      {
        id: "src-4",
        title: "AI Ethics: Navigating the Moral Landscape",
        authors: ["Maria Garcia", "Robert Chen"],
        year: 2024,
        journal: "Ethics in Computing",
        doi: "10.3456/eic.2024.012",
        url: "https://example.com/garcia2024",
        reliability: "high" as const,
        relevance: 0.89,
        accessedDate: "2024-01-14",
        abstract: "Discussão sobre os dilemas éticos envolvidos no desenvolvimento e aplicação da IA.",
        keywords: ["ética", "IA", "moral"]
      },
      {
        id: "src-5",
        title: "Industry Report on AI Trends 2023",
        authors: ["Kevin Lee"],
        year: 2023,
        journal: "Tech Industry Report",
        url: "https://example.com/lee2023",
        reliability: "medium" as const,
        relevance: 0.76,
        accessedDate: "2024-01-13",
        abstract: "Relatório anual sobre tendências emergentes em inteligência artificial.",
        keywords: ["tendências", "indústria", "relatório"]
      }
    ],
    initialExpanded: true,
    showFilters: true,
    showSorting: true
  },
  // Lista com filtros desabilitados
  noFilters: {
    sources: [
      {
        id: "src-6",
        title: "Neural Networks: From Theory to Practice",
        authors: ["Lisa Wang"],
        year: 2022,
        journal: "Neural Computing",
        doi: "10.7890/nc.2022.034",
        url: "https://example.com/wang2022",
        reliability: "high" as const,
        relevance: 0.91,
        accessedDate: "2024-01-08",
        abstract: "Guia prático para implementação de redes neurais em aplicações reais.",
        keywords: ["redes neurais", "implementação", "prática"]
      }
    ],
    initialExpanded: false,
    showFilters: false,
    showSorting: false
  }
};

// Dados para VizAttachments
export const attachmentsMocks = {
  // Anexos diversos
  mixed: {
    attachments: [
      {
        id: "att-1",
        name: "research-paper.pdf",
        type: "pdf" as const,
        size: 2_048_576, // 2MB
        url: "https://example.com/research-paper.pdf",
        thumbnailUrl: "https://example.com/thumbnails/research-paper.png",
        status: "processed" as const,
        uploadedAt: "2024-01-15T10:30:00Z",
        description: "Artigo de pesquisa principal sobre IA"
      },
      {
        id: "att-2",
        name: "dataset.csv",
        type: "csv" as const,
        size: 524_288, // 512KB
        url: "https://example.com/dataset.csv",
        status: "processed" as const,
        uploadedAt: "2024-01-15T11:15:00Z",
        description: "Conjunto de dados usado na análise"
      },
      {
        id: "att-3",
        name: "presentation-slides.pptx",
        type: "pptx" as const,
        size: 15_728_640, // 15MB
        url: "https://example.com/presentation-slides.pptx",
        thumbnailUrl: "https://example.com/thumbnails/presentation.png",
        status: "processed" as const,
        uploadedAt: "2024-01-15T12:00:00Z",
        description: "Slides da apresentação sobre os resultados"
      },
      {
        id: "att-4",
        name: "source-code.zip",
        type: "zip" as const,
        size: 1_048_576, // 1MB
        url: "https://example.com/source-code.zip",
        status: "processed" as const,
        uploadedAt: "2024-01-15T13:45:00Z",
        description: "Código fonte do projeto de IA"
      },
      {
        id: "att-5",
        name: "diagram.png",
        type: "png" as const,
        size: 307_200, // 300KB
        url: "https://example.com/diagram.png",
        thumbnailUrl: "https://example.com/diagram.png",
        status: "processed" as const,
        uploadedAt: "2024-01-15T14:20:00Z",
        description: "Diagrama arquitetural do sistema"
      }
    ],
    showThumbnails: true,
    showDownloadButtons: true,
    maxPreviewSize: 5_242_880, // 5MB
  },
  // Anexos com diferentes status
  statusVariety: {
    attachments: [
      {
        id: "att-6",
        name: "processing-document.pdf",
        type: "pdf" as const,
        size: 1_024_000, // 1MB
        url: "https://example.com/processing-document.pdf",
        status: "processing" as const,
        uploadedAt: "2024-01-15T15:00:00Z",
        description: "Documento em processamento"
      },
      {
        id: "att-7",
        name: "completed-report.docx",
        type: "docx" as const,
        size: 2_048_000, // 2MB
        url: "https://example.com/completed-report.docx",
        thumbnailUrl: "https://example.com/thumbnails/report.png",
        status: "processed" as const,
        uploadedAt: "2024-01-15T15:30:00Z",
        description: "Relatório final concluído"
      },
      {
        id: "att-8",
        name: "failed-upload.txt",
        type: "txt" as const,
        size: 1024, // 1KB
        status: "error" as const,
        uploadedAt: "2024-01-15T16:00:00Z",
        description: "Arquivo com erro no upload"
      }
    ],
    showThumbnails: true,
    showDownloadButtons: true,
    maxPreviewSize: 10_485_760, // 10MB
  },
  // Anexos sem thumbnails
  noThumbnails: {
    attachments: [
      {
        id: "att-9",
        name: "large-dataset.json",
        type: "json" as const,
        size: 104_857_600, // 100MB
        url: "https://example.com/large-dataset.json",
        status: "processed" as const,
        uploadedAt: "2024-01-15T17:00:00Z",
        description: "Conjunto de dados grande em formato JSON"
      },
      {
        id: "att-10",
        name: "configuration.yml",
        type: "yml" as const,
        size: 8192, // 8KB
        url: "https://example.com/configuration.yml",
        status: "processed" as const,
        uploadedAt: "2024-01-15T17:30:00Z",
        description: "Arquivo de configuração YAML"
      }
    ],
    showThumbnails: false,
    showDownloadButtons: true,
    maxPreviewSize: 52_428_800, // 50MB
  }
};

// Dados para VizExport
export const exportMocks = {
  // Exportação básica
  basic: {
    content: `# Relatório de Pesquisa sobre IA

## Introdução

A inteligência artificial está revolucionando diversos setores da economia e sociedade.

## Metodologia

Foram analisados dados de múltiplas fontes incluindo artigos científicos e relatórios industriais.

## Resultados

Os algoritmos de aprendizado profundo demonstraram superioridade em tarefas de classificação complexas.

## Conclusão

O futuro da IA é promissor, com aplicações cada vez mais amplas em diferentes domínios.`,
    title: "Relatório de Pesquisa sobre IA",
    availableFormats: ["pdf", "markdown", "html", "png"] as const,
    defaultFormat: "pdf" as const,
    showPreview: true,
    allowCustomization: true
  },
  // Exportação com metadados ricos
  richMetadata: {
    content: `# Análise Comparativa: Deep Learning vs Métodos Tradicionais

## Resumo Executivo

Esta análise compara o desempenho de algoritmos de deep learning com métodos tradicionais de machine learning.

## Dados Coletados

- **Período**: Janeiro 2022 - Dezembro 2023
- **Amostras**: 10.000 instâncias
- **Métricas**: Acurácia, Precisão, Recall, F1-Score

## Resultados Principais

| Método | Acurácia | Precisão | Recall | F1-Score |
|--------|----------|----------|--------|----------|
| SVM | 0.82 | 0.79 | 0.85 | 0.82 |
| Random Forest | 0.88 | 0.86 | 0.89 | 0.87 |
| Neural Network | 0.94 | 0.92 | 0.95 | 0.93 |
| CNN | 0.96 | 0.94 | 0.97 | 0.95 |

## Discussão

Os modelos de deep learning, particularmente as redes neurais convolucionais, apresentaram os melhores resultados.`,
    title: "Análise Comparativa: Deep Learning vs Métodos Tradicionais",
    author: "Dr. Jane Johnson",
    description: "Estudo comparativo entre algoritmos de deep learning e métodos tradicionais de machine learning",
    keywords: ["deep learning", "machine learning", "comparação", "algoritmos"],
    createdDate: "2024-01-15",
    availableFormats: ["pdf", "markdown", "html", "png", "docx"] as const,
    defaultFormat: "pdf" as const,
    showPreview: true,
    allowCustomization: true
  },
  // Exportação simples (apenas markdown)
  simple: {
    content: `# Notas Rápidas

- IA está crescendo rapidamente
- Deep learning é fundamental
- Aplicações em visão computacional são promissoras

## Próximos Passos

1. Revisar literatura adicional
2. Implementar protótipo
3. Validar resultados`,
    title: "Notas Rápidas sobre IA",
    availableFormats: ["markdown"] as const,
    defaultFormat: "markdown" as const,
    showPreview: false,
    allowCustomization: false
  },
  // Exportação com conteúdo longo
  longContent: {
    content: `# Pesquisa Extensiva sobre Inteligência Artificial

## Capítulo 1: Introdução

${"A inteligência artificial (IA) representa uma das tecnologias mais transformadoras do século XXI. ".repeat(REPEAT_INTRO)}

## Capítulo 2: Histórico

${"O desenvolvimento da IA teve início na década de 1950 com os trabalhos pioneiros de Alan Turing. ".repeat(REPEAT_HISTORY)}

## Capítulo 3: Estado da Arte

${"Atualmente, os avanços em deep learning e processamento de linguagem natural estão revolucionando diversos setores. ".repeat(REPEAT_STATE_OF_ART)}

## Capítulo 4: Desafios Éticos

${"Questões éticas relacionadas à IA incluem viés algorítmico, privacidade de dados e impacto no emprego. ".repeat(REPEAT_ETHICS)}

## Capítulo 5: Futuro

${"O futuro da IA promete avanços ainda maiores, com aplicações em medicina, educação e transporte. ".repeat(REPEAT_FUTURE)}

## Conclusão

${"Em resumo, a IA continuará a moldar o futuro da humanidade de maneiras profundas e significativas. ".repeat(REPEAT_CONCLUSION)}`,
    title: "Pesquisa Extensiva sobre Inteligência Artificial",
    author: "Dr. Maria Garcia",
    description: "Análise abrangente do estado atual e futuro da inteligência artificial",
    availableFormats: ["pdf", "html", "docx"] as const,
    defaultFormat: "pdf" as const,
    showPreview: true,
    allowCustomization: true
  }
};

// Atualizar o objeto allMocks para incluir os novos mocks
export const allMocksUpdated = {
  ...allMocks,
  citations: citationsMocks,
  sourcesList: sourcesListMocks,
  attachments: attachmentsMocks,
  export: exportMocks
};