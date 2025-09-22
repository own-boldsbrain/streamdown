// Dados mock para testes visuais dos componentes de visualização do Streamdown
// Este arquivo contém exemplos de dados para testar todos os componentes vizuais

export type MockVisualizationData = {
  audioWaveform: {
    title: string;
    src: string;
    description: string;
  }[];
  mermaidDiagrams: {
    title: string;
    code: string;
    description: string;
  }[];
  dataTables: {
    title: string;
    data: Record<string, unknown>[] | string;
    description: string;
  }[];
  callouts: {
    title: string;
    type: "info" | "warning" | "error" | "success" | "note";
    content: string;
    description: string;
  }[];
  lightboxImages: {
    title: string;
    src: string;
    alt: string;
    description: string;
  }[];
  premiumMedia: {
    title: string;
    type: "video" | "audio" | "pdf";
    src: string;
    description: string;
  }[];
};

// Dados mock para VizAudioWaveform
const audioWaveformData = [
  {
    title: "Podcast de Tecnologia",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    description: "Exemplo de waveform para arquivo de áudio de podcast"
  },
  {
    title: "Música Eletrônica",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    description: "Exemplo de waveform para música com batidas"
  },
  {
    title: "Efeitos Sonoros",
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    description: "Exemplo de waveform para efeitos sonoros curtos"
  }
];

// Dados mock para VizMermaidDiagram
const mermaidDiagramsData = [
  {
    title: "Fluxograma Simples",
    code: `graph TD
    A[Início] --> B{Decisão?}
    B -->|Sim| C[Processo A]
    B -->|Não| D[Processo B]
    C --> E[Fim]
    D --> E`,
    description: "Diagrama de fluxo básico com decisão"
  },
  {
    title: "Diagrama de Sequência",
    code: `sequenceDiagram
    participant U as Usuário
    participant S as Sistema
    participant DB as Banco de Dados

    U->>S: Faz requisição
    S->>DB: Consulta dados
    DB-->>S: Retorna dados
    S-->>U: Resposta`,
    description: "Diagrama de sequência mostrando interação entre componentes"
  },
  {
    title: "Diagrama de Classes",
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }

    class Dog {
        +String breed
        +bark()
    }

    class Cat {
        +String color
        +meow()
    }

    Animal <|-- Dog
    Animal <|-- Cat`,
    description: "Diagrama de classes mostrando herança"
  },
  {
    title: "Gráfico de Gantt",
    code: `gantt
    title Plano de Projeto
    dateFormat YYYY-MM-DD
    section Planejamento
    Definir requisitos    :done, req, 2024-01-01, 2024-01-05
    Análise de sistema    :done, analysis, after req, 3d
    section Desenvolvimento
    Implementação         :active, dev, 2024-01-08, 10d
    Testes unitários      :test, after dev, 5d
    section Deploy
    Deploy produção       :deploy, after test, 2d`,
    description: "Gráfico de Gantt mostrando timeline do projeto"
  }
];

// Dados mock para VizDataTable
const dataTablesData = [
  {
    title: "Dados de Usuários",
    data: [
      { id: 1, nome: "João Silva", email: "joao@email.com", idade: 28, cidade: "São Paulo" },
      { id: 2, nome: "Maria Santos", email: "maria@email.com", idade: 32, cidade: "Rio de Janeiro" },
      { id: 3, nome: "Pedro Oliveira", email: "pedro@email.com", idade: 25, cidade: "Belo Horizonte" },
      { id: 4, nome: "Ana Costa", email: "ana@email.com", idade: 29, cidade: "Porto Alegre" }
    ],
    description: "Tabela com dados de usuários em formato de array de objetos"
  },
  {
    title: "Relatório de Vendas (JSON)",
    data: `[
      {"produto": "Notebook", "vendas": 150, "receita": 225000, "margem": 0.25},
      {"produto": "Smartphone", "vendas": 300, "receita": 180000, "margem": 0.30},
      {"produto": "Tablet", "vendas": 80, "receita": 64000, "margem": 0.20},
      {"produto": "Monitor", "vendas": 120, "receita": 96000, "margem": 0.35}
    ]`,
    description: "Dados de vendas em formato JSON string"
  },
  {
    title: "Métricas de Performance",
    data: [
      { métrica: "CPU Usage", valor: "45%", status: "Normal", timestamp: "2024-01-15 10:30" },
      { métrica: "Memory Usage", valor: "67%", status: "Alto", timestamp: "2024-01-15 10:30" },
      { métrica: "Disk I/O", valor: "23%", status: "Normal", timestamp: "2024-01-15 10:30" },
      { métrica: "Network Latency", valor: "12ms", status: "Excelente", timestamp: "2024-01-15 10:30" }
    ],
    description: "Métricas de sistema com status color-coded"
  }
];

// Dados mock para VizCallout
const calloutsData = [
  {
    title: "Informação Importante",
    type: "info" as const,
    content: "Este é um exemplo de callout informativo que destaca informações importantes para o usuário.",
    description: "Callout do tipo info para informações gerais"
  },
  {
    title: "Atenção Necessária",
    type: "warning" as const,
    content: "Esta ação pode ter consequências irreversíveis. Por favor, revise antes de continuar.",
    description: "Callout do tipo warning para alertar sobre ações potencialmente perigosas"
  },
  {
    title: "Erro Crítico",
    type: "error" as const,
    content: "Ocorreu um erro inesperado no processamento. Tente novamente ou contate o suporte.",
    description: "Callout do tipo error para indicar falhas no sistema"
  },
  {
    title: "Sucesso na Operação",
    type: "success" as const,
    content: "A operação foi concluída com sucesso! Seus dados foram salvos corretamente.",
    description: "Callout do tipo success para confirmar ações bem-sucedidas"
  },
  {
    title: "Nota Adicional",
    type: "note" as const,
    content: "Lembre-se de fazer backup regularmente dos seus dados importantes.",
    description: "Callout do tipo note para observações gerais"
  }
];

// Dados mock para VizLightbox
const lightboxImagesData = [
  {
    title: "Captura de Tela do Dashboard",
    src: "https://picsum.photos/800/600?random=1",
    alt: "Dashboard administrativo mostrando gráficos e métricas",
    description: "Imagem de exemplo para teste do lightbox com zoom e controles"
  },
  {
    title: "Diagrama de Arquitetura",
    src: "https://picsum.photos/1000/700?random=2",
    alt: "Diagrama técnico mostrando arquitetura do sistema",
    description: "Imagem técnica para demonstração de funcionalidades de zoom"
  },
  {
    title: "Foto de Produto",
    src: "https://picsum.photos/600/800?random=3",
    alt: "Produto em destaque com fundo branco",
    description: "Imagem de produto para teste de rotação e navegação"
  },
  {
    title: "Gráfico Analítico",
    src: "https://picsum.photos/900/500?random=4",
    alt: "Gráfico de barras mostrando tendências de dados",
    description: "Imagem de gráfico para teste de fullscreen"
  }
];

// Dados mock para VizPremiumMedia
const premiumMediaData = [
  {
    title: "Vídeo Demonstrativo",
    type: "video" as const,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Vídeo de exemplo para teste do player de vídeo com controles"
  },
  {
    title: "Podcast Educacional",
    type: "audio" as const,
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    description: "Arquivo de áudio para teste do player de áudio premium"
  },
  {
    title: "Documento PDF",
    type: "pdf" as const,
    src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    description: "Arquivo PDF para teste do visualizador de documentos"
  },
  {
    title: "Apresentação em Vídeo",
    type: "video" as const,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Vídeo mais longo para teste de funcionalidades avançadas"
  }
];

// Dados mock completos
export const mockVisualizationData: MockVisualizationData = {
  audioWaveform: audioWaveformData,
  mermaidDiagrams: mermaidDiagramsData,
  dataTables: dataTablesData,
  callouts: calloutsData,
  lightboxImages: lightboxImagesData,
  premiumMedia: premiumMediaData
};

// Função helper para obter dados de um tipo específico
export function getMockData<T extends keyof MockVisualizationData>(
  type: T
): MockVisualizationData[T] {
  return mockVisualizationData[type];
}

// Função helper para obter um item específico por índice
export function getMockItem<T extends keyof MockVisualizationData>(
  type: T,
  index: number
): MockVisualizationData[T][number] | undefined {
  const data = mockVisualizationData[type];
  return data[index];
}

// Exportações individuais para conveniência
export { audioWaveformData, mermaidDiagramsData, dataTablesData, calloutsData, lightboxImagesData, premiumMediaData };