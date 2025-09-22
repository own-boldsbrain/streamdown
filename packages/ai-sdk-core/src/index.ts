// AI SDK Core - Main Entry Point
// This file provides the main API surface for the AI SDK Core package

// Core functions
export { generateText } from './generate-text.js';
export { streamText } from './stream-text.js';
export { generateObject } from './generate-object.js';
export { streamObject } from './stream-object.js';
export { embed, embedMany } from './embed.js';

// Experimental functions
export {
  experimental_generateImage,
  experimental_generateSpeech,
  experimental_transcribe
} from './experimental.js';

// Utilities
export {
  tool,
  jsonSchema,
  zodSchema,
  createProviderRegistry,
  cosineSimilarity,
  simulateReadableStream,
  wrapLanguageModel,
  extractReasoningMiddleware,
  simulateStreamingMiddleware,
  defaultSettingsMiddleware,
  smoothStream,
  generateId,
  createIdGenerator
} from './utils.js';

// Core types (minimal export to avoid barrel file issues)
export type {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1Message,
  EmbeddingModelV1,
  ImageModelV1,
  SpeechModelV1,
  TranscriptionModelV1,
  Tool,
  JSONSchema,
  ProviderRegistry
} from './types.js';