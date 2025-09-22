import { mockProvider, openai } from "./providers.js";

type ProviderConfig = {
  provider: unknown;
  getModel: (modelId: string) => unknown;
  availableModels: string[];
};

// Simple provider registry for common models
export const providerRegistry: Record<string, ProviderConfig> = {
  openai: {
    provider: openai,
    getModel: (modelId: string) =>
      (openai as unknown as { model: (id: string) => unknown }).model(modelId),
    availableModels: ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo", "gpt-4o"],
  },
  mock: {
    provider: mockProvider,
    getModel: (modelId: string) => mockProvider.model(modelId),
    availableModels: ["mock-model"],
  },
};

// Helper function to get a model from the registry
export function getModel(providerName: string, modelName: string) {
  const providerConfig = providerRegistry[providerName];
  if (!providerConfig) {
    throw new Error(`Provider '${providerName}' not found in registry`);
  }

  if (!providerConfig.availableModels.includes(modelName)) {
    throw new Error(
      `Model '${modelName}' not available in provider '${providerName}'`
    );
  }

  return providerConfig.getModel(modelName);
}

// Helper function to list available providers and models
export function listAvailableModels() {
  const result: Record<string, string[]> = {};

  for (const [providerName, config] of Object.entries(providerRegistry)) {
    result[providerName] = [...config.availableModels];
  }

  return result;
}
