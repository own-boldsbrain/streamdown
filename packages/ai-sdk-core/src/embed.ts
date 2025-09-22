import { EmbeddingModelV1 } from './types.js';

// Embed Options
export type EmbedOptions = {
  model: EmbeddingModelV1;
  value: string;
  abortSignal?: AbortSignal;
};

export type EmbedManyOptions = {
  model: EmbeddingModelV1;
  values: string[];
  abortSignal?: AbortSignal;
};

export type EmbedResult = {
  embedding: number[];
  usage?: {
    tokens: number;
  };
};

export type EmbedManyResult = {
  embeddings: number[][];
  usage?: {
    tokens: number;
  };
};

/**
 * Generate an embedding for a single value using an embedding model.
 */
export async function embed(options: EmbedOptions): Promise<EmbedResult> {
  const { model, value, abortSignal } = options;

  try {
    const response = await model.doEmbed({
      values: [value],
      abortSignal
    });

    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error('No embeddings returned from model');
    }

    return {
      embedding: response.embeddings[0],
      usage: response.usage
    };
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error}`);
  }
}

/**
 * Generate embeddings for several values using an embedding model (batch embedding).
 */
export async function embedMany(options: EmbedManyOptions): Promise<EmbedManyResult> {
  const { model, values, abortSignal } = options;

  if (values.length === 0) {
    return { embeddings: [] };
  }

  try {
    const response = await model.doEmbed({
      values,
      abortSignal
    });

    if (!response.embeddings) {
      throw new Error('No embeddings returned from model');
    }

    return {
      embeddings: response.embeddings,
      usage: response.usage
    };
  } catch (error) {
    throw new Error(`Batch embedding generation failed: ${error}`);
  }
}