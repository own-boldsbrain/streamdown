import { createOpenAI } from "@ai-sdk/openai";

// Mock OpenAI provider for demonstration
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key",
});

// Mock provider that returns predefined responses
export const mockProvider = {
  model: (_modelId: string) => ({
    generateText: async (_options: { prompt: string }) => {
      const responses = [
        "Olá! Sou um assistente de IA integrado ao Streamdown.",
        "Posso ajudar a gerar conteúdo personalizado para suas mensagens.",
        "Utilizando templates inteligentes e IA avançada.",
        "Vamos criar comunicações incríveis juntos!",
      ];

      return {
        text: responses.join(" "),
        finishReason: "stop" as const,
      };
    },

    async *streamText({ prompt }: { prompt: string }) {
      const response = `Resposta gerada por IA para: "${prompt}". Esta é uma demonstração do AI SDK Core integrado ao Streamdown. Conteúdo personalizado e inteligente! 🚀`;

      const words = response.split(" ");
      const STREAMING_DELAY = 50;
      for (const word of words) {
        yield {
          type: "text" as const,
          text: `${word} `,
        };
        // Simulate streaming delay
        await new Promise((resolve) => setTimeout(resolve, STREAMING_DELAY));
      }
    },
  }),
};
