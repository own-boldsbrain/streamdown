# Recomendações para Próximos Componentes a Implementar

Com base na análise da biblioteca Streamdown e do aplicativo AI Chatbot, já foi implementada uma excelente base de componentes de visualização para a experiência multimodal. A camada 2 (Multimodal Rich Experience) está quase completa, faltando apenas alguns componentes. Abaixo estão recomendações sobre quais componentes implementar a seguir, organizadas por prioridade e considerando o valor que agregariam à experiência do usuário.

## Prioridade Alta

### 1. `chat-tts-player.tsx` (Text-to-Speech Player)

Um componente para converter texto em fala, permitindo que os usuários ouçam respostas em vez de apenas lê-las.

**Recomendações de implementação:**

- Utilizar a Web Speech API para síntese de voz no navegador
- Compatibilidade com diversas vozes/idiomas
- Controles de reprodução (play/pause, velocidade, volume)
- Estado visual de reprodução
- Integração com acessibilidade (ARIA)
- Suporte a RTL

**Dependências potenciais:**

- React Use (useSound ou equivalente)
- Azure Cognitive Services (serviço de TTS de alta qualidade)

### 2. `viz-sources-panel.tsx` (Painel de Fontes)

Um componente para exibir as fontes de informação utilizadas nas respostas, aumentando a confiabilidade e transparência.

**Recomendações de implementação:**

- Lista expansível de fontes com citações
- Exibição de metadados (título, autor, data, relevância)
- Links diretos para as fontes originais
- Prévia de conteúdo ao passar o mouse
- Indicadores visuais de confiabilidade/relevância
- Filtros e ordenação

## Prioridade Média

### 3. `viz-inline-cite-popover.tsx` (Citações Inline)

Um componente para exibir citações diretamente no texto, com popover para mostrar a fonte.

**Recomendações de implementação:**

- Marcação visual sutil das citações no texto
- Popover ao passar o mouse com detalhes da fonte
- Integração com o painel de fontes
- Estilização consistente com os demais componentes

### 4. `viz-attachment-manager.tsx` (Gerenciador de Anexos)

Um componente para gerenciar anexos enviados ou recebidos durante a conversa.

**Recomendações de implementação:**

- Lista de anexos com thumbnails/ícones por tipo
- Pré-visualização integrada
- Funcionalidade de download
- Indicadores de status (carregando, processado, erro)
- Suporte a múltiplos tipos de arquivo

### 5. `ui-pagination-virtualizer.tsx` (Virtualização de Lista)

Um componente para lidar com longas listas de mensagens, melhorando a performance.

**Recomendações de implementação:**

- Virtualização de janela para renderizar apenas mensagens visíveis
- Scroll infinito com carregamento sob demanda
- Marcadores de posição para mensagens não renderizadas
- Manutenção do estado de scroll

## Prioridade Padrão

### 6. `viz-data-badge.tsx` (Badges de Dados)

Um componente para exibir indicadores visuais sobre a qualidade, fonte ou tipo de dados.

**Recomendações de implementação:**

- Ícones distintos por tipo de fonte/confiabilidade
- Tooltips informativos
- Variantes de cor por nível de confiança
- Tamanhos responsivos

### 7. `ui-cache-badge.tsx` (Indicador de Cache)

Um componente para indicar quando o conteúdo é proveniente de cache.

**Recomendações de implementação:**

- Indicador visual discreto
- Timestamp de quando o cache foi criado
- Opção para recarregar/atualizar

## Componentes de Integração

Para finalizar a experiência multimodal, recomenda-se criar componentes de integração que unam as funcionalidades já implementadas:

### 8. `viz-media-carousel.tsx` (Carrossel de Mídia)

Um componente para exibir múltiplas mídias em formato de carrossel.

**Recomendações de implementação:**

- Navegação entre diferentes mídias (imagens, vídeos, áudios)
- Thumbnails para navegação rápida
- Controles de reprodução unificados
- Transições suaves

### 9. `viz-export-manager.tsx` (Gerenciador de Exportação)

Um componente para exportar conteúdo em diferentes formatos.

**Recomendações de implementação:**

- Exportação para PDF, Markdown, HTML, imagem
- Personalização do conteúdo a ser exportado
- Opções de formatação
- Preview do resultado final

## Fluxo de Implementação Sugerido

1. Implementar o `chat-tts-player.tsx` para completar a experiência de áudio
2. Desenvolver o `viz-sources-panel.tsx` para aumentar a transparência
3. Criar o `viz-inline-cite-popover.tsx` para citações em linha
4. Implementar o `ui-pagination-virtualizer.tsx` para melhorar a performance
5. Adicionar os demais componentes conforme a necessidade do projeto

Para cada novo componente, recomenda-se seguir o mesmo padrão já estabelecido:

- Criar arquivo .tsx na pasta apropriada
- Implementar componente com "use client"
- Adicionar testes correspondentes
- Incluir dados mock para visualização
- Atualizar a página de teste
- Documentar no arquivo VIZ-COMPONENTS.md
