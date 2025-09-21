import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { huggingface } from "@ai-sdk/huggingface";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json();

  console.log("Running model:", model);

  // Mapear modelos para provedores FOSS
  const getModelProvider = (modelId: string) => {
    // Para modelos do Hugging Face, usar o provedor huggingface
    if (modelId.includes('/')) {
      return huggingface(modelId);
    }
    // Fallback para modelo padrão
    return huggingface("meta-llama/Llama-3.2-3B-Instruct");
  };

  const modelProvider = getModelProvider(model);

  const result = streamText({
    model: modelProvider,
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
