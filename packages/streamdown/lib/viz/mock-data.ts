/**
 * Mock data para testes visuais dos componentes de visualização do Streamdown
 */

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