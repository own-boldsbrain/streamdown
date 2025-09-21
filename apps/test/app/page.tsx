import { Chat } from "./components/chat";

// Lista de modelos FOSS populares
const FOSS_MODELS = [
  { label: "Llama 3.2 3B (Meta)", value: "meta-llama/Llama-3.2-3B-Instruct" },
  { label: "Llama 3.2 1B (Meta)", value: "meta-llama/Llama-3.2-1B-Instruct" },
  { label: "Gemma 2 9B (Google)", value: "google/gemma-2-9b-it" },
  { label: "Gemma 2 2B (Google)", value: "google/gemma-2-2b-it" },
  { label: "Phi-3 Mini (Microsoft)", value: "microsoft/Phi-3-mini-4k-instruct" },
  { label: "Qwen 2.5 7B (Alibaba)", value: "Qwen/Qwen2.5-7B-Instruct" },
  { label: "Mistral 7B (Mistral AI)", value: "mistralai/Mistral-7B-Instruct-v0.3" },
  { label: "DeepSeek Coder 6.7B", value: "deepseek-ai/deepseek-coder-6.7b-instruct" },
];

export default async function Page() {
  return <Chat models={FOSS_MODELS} />;
}
