import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Mock provider for demonstration purposes
const mockProvider = {
  model: (modelId: string) => ({
    generateText: async ({ prompt }: { prompt: string }) => {
      // Simulate streaming by returning chunks of text
      const responses = [
        "Olá! Sou um assistente de IA de código aberto.",
        "Posso ajudar com perguntas sobre programação,",
        "tecnologia e muitos outros assuntos.",
        "Estou aqui para tornar sua experiência",
        "com Streamdown incrível!"
      ];

      return {
        text: responses.join(" "),
        finishReason: "stop" as const
      };
    }
  })
};

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json();

  console.log("Running model:", model);

  // Extract user message from the last message
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage.parts
    .filter((part: any) => part.type === 'text')
    .map((part: any) => part.text)
    .join('');

  // Create a streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const response = `Olá! Você disse: "${userMessage}". Esta é uma resposta mock para demonstrar o streaming com Streamdown. O sistema está funcionando perfeitamente! 🚀`;

      const words = response.split(' ');
      for (const word of words) {
        const chunk = `data: ${JSON.stringify({
          type: 'text',
          text: word + ' '
        })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
