import { z } from "zod";
import type { LanguageModelV1 } from "./types.js";

// Generate Object Options
export type GenerateObjectOptions<T = any> = {
  model: LanguageModelV1;
  schema: z.ZodSchema<T> | Record<string, any>;
  schemaName?: string;
  schemaDescription?: string;
  prompt?: string;
  messages?: Array<{
    role: "system" | "user" | "assistant" | "tool";
    content: string | Array<{ type: "text"; text: string }>;
    name?: string;
    toolCallId?: string;
    toolCalls?: Array<{
      toolCallId: string;
      toolName: string;
      args: unknown;
    }>;
  }>;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  abortSignal?: AbortSignal;
};

export type GenerateObjectResult<T = any> = {
  object: T;
  finishReason: "stop" | "length" | "content-filter" | "error" | "other";
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  warnings?: Array<{
    type: "unsupported-setting";
    setting: string;
    details?: string;
  }>;
};

/**
 * Generate structured data from a language model.
 */
export async function generateObject<T = any>(
  options: GenerateObjectOptions<T>
): Promise<GenerateObjectResult<T>> {
  const {
    model,
    schema,
    schemaName,
    schemaDescription,
    prompt,
    messages = [],
    system,
    maxTokens,
    temperature = 0, // Lower temperature for structured output
    abortSignal,
  } = options;

  // Convert prompt to messages if provided
  let finalMessages = messages.map((msg) => ({
    role: msg.role,
    content:
      typeof msg.content === "string"
        ? [{ type: "text" as const, text: msg.content }]
        : msg.content,
    name: msg.name,
    toolCallId: msg.toolCallId,
    toolCalls: msg.toolCalls,
  }));

  if (prompt && messages.length === 0) {
    finalMessages = [
      { role: "user", content: [{ type: "text", text: prompt }] },
    ];
  }

  // Add system message if provided
  if (system) {
    finalMessages = [
      { role: "system", content: [{ type: "text", text: system }] },
      ...finalMessages,
    ];
  }

  // Prepare schema for the model
  let schemaObject: any;
  let mode: any;

  if (schema instanceof z.ZodSchema) {
    // Handle Zod schema
    schemaObject = schema._def;
    mode = {
      type: "object-json" as const,
      schema: schemaObject,
      schemaName,
      schemaDescription,
    };
  } else {
    // Handle plain JSON schema
    schemaObject = schema;
    mode = {
      type: "object-json" as const,
      schema: schemaObject,
      schemaName,
      schemaDescription,
    };
  }

  // Prepare model call options
  const callOptions = {
    mode,
    inputFormat: "messages" as const,
    prompt: "",
    messages: finalMessages,
    maxTokens,
    temperature,
    abortSignal,
  };

  try {
    const response = await model.doGenerate(callOptions);

    if (!response.text) {
      throw new Error("No text response from model");
    }

    // Parse the JSON response
    let parsedObject: T;
    try {
      parsedObject = JSON.parse(response.text);
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError}`);
    }

    // Validate with schema if it's a Zod schema
    if (schema instanceof z.ZodSchema) {
      const validationResult = schema.safeParse(parsedObject);
      if (!validationResult.success) {
        throw new Error(
          `Schema validation failed: ${validationResult.error.message}`
        );
      }
      parsedObject = validationResult.data;
    }

    return {
      object: parsedObject,
      finishReason: response.finishReason,
      usage: {
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        totalTokens:
          response.usage.promptTokens + response.usage.completionTokens,
      },
      warnings: response.warnings,
    };
  } catch (error) {
    throw new Error(`Object generation failed: ${error}`);
  }
}
