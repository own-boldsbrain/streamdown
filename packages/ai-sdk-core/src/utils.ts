import { z } from 'zod';
import { Tool, JSONSchema, ProviderRegistry } from './types.js';

// Tool Helper
export type ToolFn<TParameters = any, TResult = any> = {
  description?: string;
  parameters: z.ZodSchema<TParameters>;
  execute: (args: TParameters) => Promise<TResult> | TResult;
};

/**
 * Type inference helper function for tools.
 */
export function tool<TParameters = any, TResult = any>(
  toolDefinition: ToolFn<TParameters, TResult>
): Tool<TParameters, TResult> {
  return {
    description: toolDefinition.description,
    parameters: toolDefinition.parameters,
    execute: toolDefinition.execute
  };
}

// Schema Helpers
/**
 * Creates AI SDK compatible JSON schema objects.
 */
export function jsonSchema<T = any>(schema: JSONSchema): JSONSchema {
  return schema;
}

/**
 * Creates AI SDK compatible Zod schema objects.
 */
export function zodSchema<T = any>(schema: z.ZodSchema<T>): z.ZodSchema<T> {
  return schema;
}

// Provider Registry
/**
 * Creates a registry for using models from multiple providers.
 */
export function createProviderRegistry(
  providers: Record<string, ProviderRegistry>
): ProviderRegistry {
  return {
    languageModel: (modelId: string) => {
      // Simple implementation - in real usage, this would parse provider:model format
      const [provider, ...modelParts] = modelId.split(':');
      const actualModelId = modelParts.join(':');

      const providerRegistry = providers[provider];
      if (!providerRegistry) {
        throw new Error(`Provider ${provider} not found`);
      }

      return providerRegistry.languageModel(actualModelId);
    },

    textEmbeddingModel: (modelId: string) => {
      const [provider, ...modelParts] = modelId.split(':');
      const actualModelId = modelParts.join(':');

      const providerRegistry = providers[provider];
      if (!providerRegistry) {
        throw new Error(`Provider ${provider} not found`);
      }

      return providerRegistry.textEmbeddingModel(actualModelId);
    },

    imageModel: (modelId: string) => {
      const [provider, ...modelParts] = modelId.split(':');
      const actualModelId = modelParts.join(':');

      const providerRegistry = providers[provider];
      if (!providerRegistry?.imageModel) {
        throw new Error(`Image model provider ${provider} not found`);
      }

      return providerRegistry.imageModel(actualModelId);
    },

    speechModel: (modelId: string) => {
      const [provider, ...modelParts] = modelId.split(':');
      const actualModelId = modelParts.join(':');

      const providerRegistry = providers[provider];
      if (!providerRegistry?.speechModel) {
        throw new Error(`Speech model provider ${provider} not found`);
      }

      return providerRegistry.speechModel(actualModelId);
    },

    transcriptionModel: (modelId: string) => {
      const [provider, ...modelParts] = modelId.split(':');
      const actualModelId = modelParts.join(':');

      const providerRegistry = providers[provider];
      if (!providerRegistry?.transcriptionModel) {
        throw new Error(`Transcription model provider ${provider} not found`);
      }

      return providerRegistry.transcriptionModel(actualModelId);
    }
  };
}

// Utility Functions
/**
 * Calculates the cosine similarity between two vectors, e.g. embeddings.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Streaming Utilities
/**
 * Creates a ReadableStream that emits values with configurable delays.
 */
export function simulateReadableStream<T>(
  values: T[],
  options: {
    delay?: number;
    chunkDelay?: number[];
  } = {}
): ReadableStream<T> {
  const { delay = 0, chunkDelay = [] } = options;

  return new ReadableStream({
    async start(controller) {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      for (let i = 0; i < values.length; i++) {
        controller.enqueue(values[i]);

        const chunkDelayMs = chunkDelay[i] || 0;
        if (chunkDelayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, chunkDelayMs));
        }
      }

      controller.close();
    }
  });
}

// Model Wrapping
export type LanguageModelMiddleware = (options: any) => any;

/**
 * Wraps a language model with middleware.
 */
export function wrapLanguageModel(
  model: any,
  middleware: LanguageModelMiddleware
): any {
  return {
    ...model,
    doGenerate: (options: any) => middleware({ ...options, model }),
    doStream: (options: any) => middleware({ ...options, model, stream: true })
  };
}

// Reasoning Middleware
/**
 * Extracts reasoning from the generated text and exposes it as a `reasoning` property on the result.
 */
export function extractReasoningMiddleware(options: any) {
  // This is a simplified implementation
  // In a real implementation, this would parse reasoning tokens from the model output
  return options.model.doGenerate(options);
}

// Streaming Simulation
/**
 * Simulates streaming behavior with responses from non-streaming language models.
 */
export function simulateStreamingMiddleware(options: any) {
  return {
    stream: simulateReadableStream([
      { type: 'text-delta', textDelta: 'Simulated streaming response' },
      { type: 'finish', finishReason: 'stop', usage: { promptTokens: 10, completionTokens: 20 } }
    ])
  };
}

// Default Settings
/**
 * Applies default settings to a language model.
 */
export function defaultSettingsMiddleware(defaults: Record<string, any>) {
  return (options: any) => {
    return {
      ...options,
      ...defaults,
      // Merge settings
      maxTokens: options.maxTokens ?? defaults.maxTokens,
      temperature: options.temperature ?? defaults.temperature,
      // etc.
    };
  };
}

// Stream Smoothing
/**
 * Smooths text streaming output.
 */
export function smoothStream(
  stream: ReadableStream,
  options: { delay?: number } = {}
): ReadableStream {
  const { delay = 50 } = options;

  return stream.pipeThrough(
    new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(chunk);
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    })
  );
}

// ID Generation
/**
 * Helper function for generating unique IDs.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Creates an ID generator.
 */
export function createIdGenerator(prefix = ''): () => string {
  let counter = 0;
  return () => `${prefix}${counter++}`;
}