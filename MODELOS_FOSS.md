# Configuração de Modelos FOSS

Este projeto agora usa modelos de IA de código aberto (FOSS) em vez do AI Gateway proprietário.

## Modelos Disponíveis

A aplicação de teste inclui uma seleção de modelos FOSS populares:

- **Llama 3.2 3B** (Meta) - Modelo eficiente para tarefas gerais
- **Llama 3.2 1B** (Meta) - Versão menor, mais rápida
- **Gemma 2 9B** (Google) - Modelo poderoso para tarefas complexas
- **Gemma 2 2B** (Google) - Versão otimizada para velocidade
- **Phi-3 Mini** (Microsoft) - Modelo compacto e eficiente
- **Qwen 2.5 7B** (Alibaba) - Modelo multilíngue forte
- **Mistral 7B** (Mistral AI) - Modelo europeu de alta qualidade
- **DeepSeek Coder 6.7B** - Especializado em geração de código

## Como Usar

1. **Execução Local**: Os modelos rodam localmente via Hugging Face
2. **Sem Autenticação**: Não requer chaves de API proprietárias
3. **Privacidade**: Dados permanecem no seu ambiente local

## Configuração (Opcional)

Para usar modelos específicos, você pode:

1. Modificar a lista `FOSS_MODELS` em `apps/test/app/page.tsx`
2. Adicionar novos modelos do Hugging Face seguindo o formato:

   ```typescript
   { label: "Nome do Modelo", value: "organizacao/modelo-nome" }
   ```

## Limitações

- **Requisitos de Hardware**: Modelos maiores precisam de GPU
- **Velocidade**: Modelos locais podem ser mais lentos que APIs proprietárias
- **Memória**: Alguns modelos requerem significativa RAM/VRAM

## Próximos Passos

Para produção, considere:

- Usar uma instância dedicada do Hugging Face Inference API
- Configurar um servidor local com vLLM ou similar
- Usar modelos quantizados para melhor performance