# AI SDK Core

A comprehensive TypeScript implementation of the AI SDK Core specification, providing a unified interface for AI model interactions including text generation, streaming, structured data generation, embeddings, and experimental features like image generation, speech synthesis, and transcription.

## Features

- **Text Generation**: Generate text with tool calling support
- **Streaming**: Real-time streaming of text and structured data
- **Structured Data**: Generate objects with schema validation using Zod
- **Embeddings**: Single and batch embedding generation
- **Experimental Features**: Image generation, speech synthesis, and transcription
- **Provider Registry**: Multi-provider model support system
- **Middleware System**: Model wrapping, reasoning extraction, and streaming simulation
- **Type Safety**: Full TypeScript support with strict typing

## Installation

```bash
pnpm add @streamdown/ai-sdk-core
```

## Quick Start

```typescript
import {
  generateText,
  streamText,
  generateObject,
  embed,
  createProviderRegistry
} from '@streamdown/ai-sdk-core';

// Create a provider registry
const registry = createProviderRegistry();

// Register your models
registry.registerLanguageModel('gpt-4', yourGPT4Model);
registry.registerEmbeddingModel('text-embedding-ada-002', yourEmbeddingModel);

// Generate text
const result = await generateText({
  model: registry.getLanguageModel('gpt-4'),
  prompt: 'Write a haiku about programming'
});

console.log(result.text);
```

## Core Functions

### Text Generation

```typescript
import { generateText } from '@streamdown/ai-sdk-core';

const result = await generateText({
  model: yourLanguageModel,
  prompt: 'Explain quantum computing in simple terms',
  system: 'You are a helpful AI assistant.',
  tools: [/* tool definitions */],
  maxTokens: 1000,
  temperature: 0.7
});

console.log(result.text);
console.log(result.toolCalls); // If tools were used
```

### Streaming Text

```typescript
import { streamText } from '@streamdown/ai-sdk-core';

const result = await streamText({
  model: yourLanguageModel,
  prompt: 'Tell me a story',
  onChunk: (chunk) => {
    console.log('Received chunk:', chunk.text);
  },
  onToolCall: (toolCall) => {
    console.log('Tool called:', toolCall);
  }
});

// Access final result
console.log(result.text);
```

### Structured Data Generation

```typescript
import { generateObject } from '@streamdown/ai-sdk-core';
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string())
});

const result = await generateObject({
  model: yourLanguageModel,
  schema,
  prompt: 'Create a project idea for a web application'
});

console.log(result.object); // TypeScript knows this matches the schema
```

### Embeddings

```typescript
import { embed, embedMany } from '@streamdown/ai-sdk-core';

// Single embedding
const result = await embed({
  model: yourEmbeddingModel,
  value: 'Hello world'
});

console.log(result.embedding); // number[]

// Batch embeddings
const results = await embedMany({
  model: yourEmbeddingModel,
  values: ['Hello', 'world', 'from', 'AI']
});

results.forEach(result => {
  console.log(result.embedding);
});
```

## Experimental Features

### Image Generation

```typescript
import { experimental_generateImage } from '@streamdown/ai-sdk-core';

const result = await experimental_generateImage({
  model: yourImageModel,
  prompt: 'A serene mountain landscape at sunset',
  size: '1024x1024'
});

console.log(result.image); // Base64 encoded image
```

### Speech Synthesis

```typescript
import { experimental_generateSpeech } from '@streamdown/ai-sdk-core';

const result = await experimental_generateSpeech({
  model: yourSpeechModel,
  text: 'Hello, world!',
  voice: 'alloy'
});

console.log(result.audio); // Audio data
```

### Transcription

```typescript
import { experimental_transcribe } from '@streamdown/ai-sdk-core';

const result = await experimental_transcribe({
  model: yourTranscriptionModel,
  audio: audioFileBuffer
});

console.log(result.text);
```

## Utilities

### Tool Definition

```typescript
import { tool } from '@streamdown/ai-sdk-core';

const weatherTool = tool({
  name: 'getWeather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' }
    },
    required: ['location']
  },
  execute: async ({ location }) => {
    // Fetch weather data
    return { temperature: 72, condition: 'sunny' };
  }
});
```

### Schema Helpers

```typescript
import { jsonSchema, zodSchema } from '@streamdown/ai-sdk-core';

// JSON Schema
const jsonSchemaDef = jsonSchema({
  type: 'object',
  properties: { name: { type: 'string' } }
});

// Zod Schema
const zodSchemaDef = zodSchema(z.object({ name: z.string() }));
```

### Middleware

```typescript
import {
  wrapLanguageModel,
  extractReasoningMiddleware,
  simulateStreamingMiddleware
} from '@streamdown/ai-sdk-core';

// Wrap a model with middleware
const wrappedModel = wrapLanguageModel({
  model: baseModel,
  middleware: [
    extractReasoningMiddleware(),
    simulateStreamingMiddleware()
  ]
});
```

## Provider Registry

```typescript
import { createProviderRegistry } from '@streamdown/ai-sdk-core';

const registry = createProviderRegistry();

// Register models
registry.registerLanguageModel('gpt-4', gpt4Model);
registry.registerEmbeddingModel('ada-002', embeddingModel);
registry.registerImageModel('dall-e-3', imageModel);

// Use registered models
const model = registry.getLanguageModel('gpt-4');
```

## Type Safety

All functions are fully typed with TypeScript. The library uses strict typing to ensure type safety at compile time:

```typescript
import type { LanguageModelV1, GenerateTextResult } from '@streamdown/ai-sdk-core';

// Models implement the V1 interfaces
const model: LanguageModelV1 = myModelImplementation;

// Results have proper typing
const result: GenerateTextResult = await generateText({ model, prompt: 'Hello' });
```

## Error Handling

The library provides comprehensive error handling:

```typescript
try {
  const result = await generateText({
    model: yourModel,
    prompt: 'Hello'
  });
} catch (error) {
  if (error.name === 'AI_SDKError') {
    console.error('AI SDK Error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Performance Considerations

- Uses streaming APIs for real-time responses
- Efficient memory usage with ReadableStream/TransformStream
- Middleware system allows for performance optimizations
- Provider registry enables model caching and reuse

## Compatibility

- Node.js ≥ 18
- TypeScript ≥ 5.0
- React ≥ 18 (for React integrations)
- Compatible with existing AI SDK implementations

## Contributing

Contributions are welcome! Please see the main Streamdown repository for contribution guidelines.

## License

MIT
