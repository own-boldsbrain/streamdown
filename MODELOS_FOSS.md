# Configuração de Modelos FOSS

Este projeto agora usa uma **implementação mock** para demonstrar o streaming com modelos de IA de código aberto (FOSS). A API simula respostas de streaming para testar a funcionalidade do Streamdown.

## Modelos Disponíveis (Mock)

A aplicação de teste inclui uma seleção de modelos FOSS populares que são **simulados**:

- **Llama 3.2 3B** (Meta) - Modelo eficiente para tarefas gerais
- **Llama 3.2 1B** (Meta) - Versão menor, mais rápida
- **Gemma 2 9B** (Google) - Modelo poderoso para tarefas complexas
- **Gemma 2 2B** (Google) - Versão otimizada para velocidade
- **Phi-3 Mini** (Microsoft) - Modelo compacto e eficiente
- **Qwen 2.5 7B** (Alibaba) - Modelo multilíngue forte
- **Mistral 7B** (Mistral AI) - Modelo europeu de alta qualidade
- **DeepSeek Coder 6.7B** - Especializado em geração de código

## Como Funciona

1. **Seleção de Modelo**: Escolha qualquer modelo da lista
2. **Streaming Simulado**: A API retorna uma resposta mock com streaming
3. **Demonstração**: Mostra como o Streamdown processa texto em tempo real

## Resposta Mock

A resposta atual demonstra:

- Streaming de texto palavra por palavra
- Delay simulado entre chunks
- Integração perfeita com Streamdown
- Suporte multilíngue (português incluído)

## Próximos Passos para Produção

Para usar modelos reais FOSS em produção:

1. **Hugging Face Inference API**:

   ```bash
   pnpm add @huggingface/inference
   ```

2. **Configuração de API Key**:
   - Obter token do Hugging Face
   - Configurar variável de ambiente `HF_TOKEN`

3. **Integração Real**:
   - Substituir implementação mock
   - Usar modelos reais do Hugging Face
   - Configurar rate limiting e caching

4. **Alternativas FOSS**:
   - **Ollama**: Para execução local
   - **LM Studio**: Interface para modelos locais
   - **Together AI**: API para modelos open source

## Limitações da Versão Mock

- Respostas são pré-definidas
- Não há IA real processando perguntas
- Serve apenas para demonstração técnica
- Ideal para testar interface e streaming

## Benefícios

- ✅ **Sem custos** de API
- ✅ **Sem autenticação** necessária
- ✅ **Demonstração perfeita** do Streamdown
- ✅ **Código aberto** e transparente
- ✅ **Pronto para expansão** futura
