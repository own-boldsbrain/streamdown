import type { z } from "zod";
import type { LanguageModelV1 } from "./types.js";

// Stream Object Options
export type StreamObjectOptions<T = any> = {
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
  onChunk?: (chunk: StreamObjectChunk) => void | Promise<void>;
  onFinish?: (result: StreamObjectResult<T>) => void | Promise<void>;
};

export type StreamObjectChunk =
  | {
      type: "text-delta";
      textDelta: string;
    }
  | {
      type: "object";
      object: any;
    };

export type StreamObjectResult<T = any> = {
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
 * Stream structured data from a language model.
 */
export async function streamObject<T = any>(
  options: StreamObjectOptions<T>
): Promise<
  ReadableStream<StreamObjectChunk> & { toDataStreamResponse: () => Response }
> {
  const {
    model,
    schema,
    schemaName,
    schemaDescription,
    prompt,
    messages = [],
    system,
    maxTokens,
    temperature = 0,
    abortSignal,
    onChunk,
    onFinish,
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

  if (schema && typeof schema === "object" && "parse" in schema) {
    // Handle Zod schema
    schemaObject = (schema as any)._def;
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
    const response = await model.doStream(callOptions);

    let fullText = "";
    let finishReason: StreamObjectResult["finishReason"] = "other";
    let usage: StreamObjectResult["usage"] | undefined;

    const transformStream = new TransformStream({
      async transform(chunk: any, controller) {
        switch (chunk.type) {
          case "text-delta": {
            fullText += chunk.textDelta;
            const textChunk: StreamObjectChunk = {
              type: "text-delta",
              textDelta: chunk.textDelta,
            };
            controller.enqueue(textChunk);
            if (onChunk) await onChunk(textChunk);
            break;
          }

          case "finish":
            finishReason = chunk.finishReason;
            usage = {
              promptTokens: chunk.usage.promptTokens,
              completionTokens: chunk.usage.completionTokens,
              totalTokens:
                chunk.usage.promptTokens + chunk.usage.completionTokens,
            };

            // Try to parse the complete text as JSON
            try {
              const parsedObject = JSON.parse(fullText);

              // Validate with schema if it's a Zod schema
              let finalObject = parsedObject;
              if (schema && typeof schema === "object" && "parse" in schema) {
                const validationResult = (schema as any).safeParse(
                  parsedObject
                );
                if (!validationResult.success) {
                  throw new Error(
                    `Schema validation failed: ${validationResult.error.message}`
                  );
                }
                finalObject = validationResult.data;
              }

              const objectChunk: StreamObjectChunk = {
                type: "object",
                object: finalObject,
              };
              controller.enqueue(objectChunk);
              if (onChunk) await onChunk(objectChunk);

              // Call onFinish callback
              if (onFinish && usage) {
                const result: StreamObjectResult<T> = {
                  object: finalObject,
                  finishReason,
                  usage,
                  warnings: response.warnings,
                };
                await onFinish(result);
              }
            } catch (parseError) {
              console.error("Failed to parse JSON:", parseError);
              // Emit error chunk
              const errorChunk: StreamObjectChunk = {
                type: "object",
                object: { error: "Failed to parse JSON response" },
              };
              controller.enqueue(errorChunk);
            }
            break;

          case "error":
            console.error("Stream error:", chunk.error);
            break;
        }
      },
    });

    const stream = response.stream.pipeThrough(transformStream);

    // Add toDataStreamResponse method
    const enhancedStream = Object.assign(stream, {
      toDataStreamResponse(): Response {
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
          },
        });
      },
    });

    return enhancedStream;
  } catch (error) {
    throw new Error(`Object streaming failed: ${error}`);
  }
}
