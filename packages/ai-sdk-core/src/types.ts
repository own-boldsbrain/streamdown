// Core types for AI SDK
export type LanguageModelV1 = {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;
  readonly defaultObjectGenerationMode: 'json' | 'tool';
  readonly supportsImageUrls: boolean;
  readonly supportsStructuredOutputs: boolean;

  doGenerate(options: LanguageModelV1CallOptions): PromiseLike<LanguageModelV1CallResponse>;
  doStream(options: LanguageModelV1CallOptions): PromiseLike<LanguageModelV1StreamResponse>;
};

export type LanguageModelV1CallOptions = {
  mode: LanguageModelV1CallMode;
  inputFormat: 'prompt' | 'messages';
  prompt: string;
  messages: Array<LanguageModelV1Message>;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  seed?: number;
  abortSignal?: AbortSignal;
};

export type LanguageModelV1CallMode = {
  type: 'regular';
} | {
  type: 'object-json';
  schema: unknown;
  schemaName?: string;
  schemaDescription?: string;
} | {
  type: 'object-tool';
  tool: {
    type: 'function';
    name: string;
    description?: string;
    parameters: unknown;
  };
};

export type LanguageModelV1Message = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: Array<LanguageModelV1TextPart | LanguageModelV1ImagePart>;
  name?: string;
  toolCallId?: string;
  toolCalls?: Array<LanguageModelV1ToolCall>;
};

export type LanguageModelV1TextPart = {
  type: 'text';
  text: string;
};

export type LanguageModelV1ImagePart = {
  type: 'image';
  image: Uint8Array;
  mimeType: string;
};

export type LanguageModelV1ToolCall = {
  toolCallId: string;
  toolName: string;
  args: unknown;
};

export type LanguageModelV1CallResponse = {
  text?: string;
  toolCalls?: Array<LanguageModelV1ToolCall>;
  finishReason: 'stop' | 'length' | 'tool-calls' | 'content-filter' | 'error' | 'other';
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  rawCall: {
    rawPrompt: unknown;
    rawSettings: Record<string, unknown>;
  };
  warnings?: Array<LanguageModelV1CallWarning>;
};

export type LanguageModelV1CallWarning = {
  type: 'unsupported-setting';
  setting: string;
  details?: string;
};

export type LanguageModelV1StreamResponse = {
  stream: ReadableStream<LanguageModelV1StreamPart>;
  rawCall: {
    rawPrompt: unknown;
    rawSettings: Record<string, unknown>;
  };
  warnings?: Array<LanguageModelV1CallWarning>;
};

export type LanguageModelV1StreamPart = {
  type: 'text-delta';
  textDelta: string;
} | {
  type: 'tool-call-delta';
  toolCallId: string;
  toolName: string;
  argsTextDelta: string;
} | {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
} | {
  type: 'finish';
  finishReason: 'stop' | 'length' | 'tool-calls' | 'content-filter' | 'error' | 'other';
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
} | {
  type: 'error';
  error: unknown;
};

// Embedding Model Types
export type EmbeddingModelV1 = {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;
  readonly maxEmbeddingsPerCall: number;
  readonly supportsParallelCalls: boolean;

  doEmbed(options: EmbeddingModelV1CallOptions): PromiseLike<EmbeddingModelV1CallResponse>;
};

export type EmbeddingModelV1CallOptions = {
  values: Array<string>;
  abortSignal?: AbortSignal;
};

export type EmbeddingModelV1CallResponse = {
  embeddings: Array<Array<number>>;
  usage?: {
    tokens: number;
  };
};

// Image Generation Types
export type ImageModelV1 = {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;
  readonly maxImagesPerCall: number;

  doGenerate(options: ImageModelV1CallOptions): PromiseLike<ImageModelV1CallResponse>;
};

export type ImageModelV1CallOptions = {
  prompt: string;
  n?: number;
  size?: string;
  aspectRatio?: string;
  seed?: number;
  providerOptions?: Record<string, unknown>;
  abortSignal?: AbortSignal;
};

export type ImageModelV1CallResponse = {
  images: Array<ImageModelV1Image>;
};

export type ImageModelV1Image = {
  uri: string;
  mimeType?: string;
};

// Speech and Audio Types
export type SpeechModelV1 = {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;

  doGenerate(options: SpeechModelV1CallOptions): PromiseLike<SpeechModelV1CallResponse>;
};

export type SpeechModelV1CallOptions = {
  input: string;
  voice?: string;
  speed?: number;
  providerOptions?: Record<string, unknown>;
  abortSignal?: AbortSignal;
};

export type SpeechModelV1CallResponse = {
  speech: Uint8Array;
  mimeType: string;
};

export type TranscriptionModelV1 = {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;

  doTranscribe(options: TranscriptionModelV1CallOptions): PromiseLike<TranscriptionModelV1CallResponse>;
};

export type TranscriptionModelV1CallOptions = {
  audio: Uint8Array;
  mimeType: string;
  language?: string;
  prompt?: string;
  providerOptions?: Record<string, unknown>;
  abortSignal?: AbortSignal;
};

export type TranscriptionModelV1CallResponse = {
  text: string;
};

// Utility Types
export type Tool<TParameters = any, TResult = any> = {
  description?: string;
  parameters: TParameters;
  execute: (args: TParameters) => Promise<TResult> | TResult;
};

export type JSONSchema = {
  type: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: any[];
  const?: any;
  [key: string]: any;
};

export type ProviderRegistry = {
  languageModel: (modelId: string) => LanguageModelV1;
  textEmbeddingModel: (modelId: string) => EmbeddingModelV1;
  imageModel?: (modelId: string) => ImageModelV1;
  speechModel?: (modelId: string) => SpeechModelV1;
  transcriptionModel?: (modelId: string) => TranscriptionModelV1;
};