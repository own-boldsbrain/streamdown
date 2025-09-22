// AI SDK Core - Main Entry Point
// This file provides the main API surface for the AI SDK Core package

export { embed, embedMany } from "./embed.js";
// Experimental functions
export {
  experimental_generateImage,
  experimental_generateSpeech,
  experimental_transcribe,
} from "./experimental.js";
export { generateObject } from "./generate-object.js";
// Core functions
export { generateText } from "./generate-text.js";
export { streamObject } from "./stream-object.js";
export { streamText } from "./stream-text.js";
// Core types (minimal export to avoid barrel file issues)
export type {
  EmbeddingModelV1,
  ImageModelV1,
  JSONSchema,
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1Message,
  ProviderRegistry,
  SpeechModelV1,
  Tool,
  TranscriptionModelV1,
} from "./types.js";
// Utilities
export {
  cosineSimilarity,
  createIdGenerator,
  createProviderRegistry,
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  generateId,
  jsonSchema,
  simulateReadableStream,
  simulateStreamingMiddleware,
  smoothStream,
  tool,
  wrapLanguageModel,
  zodSchema,
} from "./utils.js";
