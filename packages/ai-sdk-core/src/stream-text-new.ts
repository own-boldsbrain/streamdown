import {
  LanguageModelV1,
  LanguageModelV1StreamPart,
  LanguageModelV1Message,
  LanguageModelV1ToolCall,
  Tool
} from './types.js';

// Core types based on the AI SDK specification
export type LanguageModel = LanguageModelV1;

export type SystemModelMessage = {
  role: 'system';
  content: string;
};

export type UserModelMessage = {
  role: 'user';
  content: string | Array<TextPart | ImagePart | FilePart>;
};

export type AssistantModelMessage = {
  role: 'assistant';
  content: string | Array<TextPart | FilePart | ReasoningPart | ToolCallPart>;
};

export type ToolModelMessage = {
  role: 'tool';
  content: ToolResultPart[];
  toolCallId: string;
};

export type TextPart = {
  type: 'text';
  text: string;
};

export type ImagePart = {
  type: 'image';
  image: string | Uint8Array | Buffer | ArrayBuffer | URL;
  mediaType?: string;
};

export type FilePart = {
  type: 'file';
  data: string | Uint8Array | Buffer | ArrayBuffer | URL;
  mediaType: string;
};

export type ReasoningPart = {
  type: 'reasoning';
  text: string;
};

export type ToolCallPart = {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  input: object;
};

export type ToolResultPart = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError?: boolean;
};

export type ToolSet = Record<string, ToolDefinition>;

export type ToolDefinition = {
  description?: string;
  inputSchema: Record<string, unknown>; // Zod schema or JSON schema
  execute?: (parameters: Record<string, unknown>, options: ToolExecutionOptions) => unknown;
};

export type ToolExecutionOptions = {
  toolCallId: string;
  messages: LanguageModelV1Message[];
  abortSignal?: AbortSignal;
};

export type ToolChoice = 'auto' | 'none' | 'required' | { type: 'tool'; toolName: string };

export type TelemetrySettings = {
  isEnabled?: boolean;
  recordInputs?: boolean;
  recordOutputs?: boolean;
  functionId?: string;
  metadata?: Record<string, string | number | boolean | Array<null | undefined | string> | Array<null | undefined | number> | Array<null | undefined | boolean>>;
};

export type StreamTextTransform = {
  transform: (options: TransformOptions) => TransformStream<TextStreamPart<unknown>, TextStreamPart<unknown>>;
};

export type TransformOptions = {
  stopStream: () => void;
  tools: ToolSet;
};

export type StopCondition<T> = (options: {
  tools: T;
  messages: LanguageModelV1Message[];
  toolCalls: ToolCall[];
  toolResults: ToolResult[];
}) => boolean;

export type PrepareStepOptions = {
  steps: Array<StepResult<any>>;
  stepNumber: number;
  model: LanguageModel;
  messages: LanguageModelV1Message[];
};

export type PrepareStepResult<T> = {
  model?: LanguageModel;
  toolChoice?: ToolChoice;
  activeTools?: Array<keyof T>;
  system?: string;
  messages?: LanguageModelV1Message[];
};

export type OnChunkResult = {
  chunk: TextStreamPart<any>;
};

export type OnErrorResult = {
  error: unknown;
};

export type OnFinishResult = {
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
  usage: LanguageModelUsage;
  providerMetadata?: Record<string, Record<string, any>>;
  text: string;
  reasoning?: string;
  reasoningDetails?: Array<ReasoningDetail>;
  sources?: Array<Source>;
  files?: Array<GeneratedFile>;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  warnings?: Warning[];
  response?: ResponseMetadata;
  steps?: Array<StepResult<any>>;
};

export type OnStepFinishResult = {
  stepType: 'initial' | 'continue' | 'tool-result';
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
  usage: LanguageModelUsage;
  text: string;
  reasoning?: string;
  sources?: Array<Source>;
  files?: Array<GeneratedFile>;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  warnings?: Warning[];
  response?: ResponseMetadata;
  isContinued?: boolean;
  providerMetadata?: Record<string, Record<string, any>>;
};

export type OnAbortResult = {
  steps: Array<StepResult<any>>;
};

export type LanguageModelUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
};

export type ReasoningDetail = {
  type: 'text';
  text: string;
  signature?: string;
} | {
  type: 'redacted';
  data: string;
};

export type Source = {
  sourceType: 'url';
  id: string;
  url: string;
  title?: string;
  providerMetadata?: any;
};

export type GeneratedFile = {
  base64: string;
  uint8Array: Uint8Array;
  mediaType: string;
};

export type ToolCall = {
  toolCallId: string;
  toolName: string;
  input: any;
};

export type ToolResult = {
  toolCallId: string;
  toolName: string;
  input: any;
  output: any;
};

export type Warning = {
  type: 'unsupported-setting';
  setting: string;
  details?: string;
};

export type ResponseMetadata = {
  id: string;
  model: string;
  timestamp: Date;
  headers?: Record<string, string>;
  messages?: Array<ResponseMessage>;
};

export type ResponseMessage = LanguageModelV1Message;

export type StepResult<T> = {
  stepType: 'initial' | 'continue' | 'tool-result';
  text: string;
  reasoning?: string;
  sources?: Array<Source>;
  files?: Array<GeneratedFile>;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
  usage: LanguageModelUsage;
  request?: RequestMetadata;
  response?: ResponseMetadata;
  warnings?: Warning[];
  isContinued?: boolean;
  providerMetadata?: Record<string, Record<string, any>>;
};

export type RequestMetadata = {
  body: string;
};

export type TextStreamPart<T = any> = {
  type: 'text';
  text: string;
} | {
  type: 'reasoning';
  text: string;
  providerMetadata?: any;
} | {
  type: 'source';
  source: Source;
} | {
  type: 'file';
  file: GeneratedFile;
} | {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  input: any;
} | {
  type: 'tool-call-streaming-start';
  toolCallId: string;
  toolName: string;
} | {
  type: 'tool-call-delta';
  toolCallId: string;
  toolName: string;
  argsTextDelta: string;
} | {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  input: any;
  output: any;
} | {
  type: 'start-step';
  request: any;
  warnings?: Warning[];
} | {
  type: 'finish-step';
  response?: ResponseMetadata;
  usage: LanguageModelUsage;
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
  providerMetadata?: Record<string, Record<string, any>>;
} | {
  type: 'start';
} | {
  type: 'finish';
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
  totalUsage: LanguageModelUsage;
} | {
  type: 'reasoning-part-finish';
} | {
  type: 'error';
  error: unknown;
} | {
  type: 'abort';
};

export type ConsumeStreamOptions = {
  onError?: (error: unknown) => void;
};

export type UIMessageStreamOptions = {
  originalMessages?: UIMessage[];
  onFinish?: (options: { messages: UIMessage[]; isContinuation: boolean; responseMessage: UIMessage; isAborted: boolean }) => void;
  messageMetadata?: (options: { part: TextStreamPart<any> & { type: 'start' | 'finish' | 'start-step' | 'finish-step' } }) => unknown;
  sendReasoning?: boolean;
  sendSources?: boolean;
  sendFinish?: boolean;
  sendStart?: boolean;
  onError?: (error: unknown) => string;
  consumeSseStream?: (stream: ReadableStream) => Promise<void>;
};

export type UIMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  createdAt?: Date;
  toolInvocations?: Array<{
    toolCallId: string;
    toolName: string;
    args: any;
    result?: any;
    state: 'partial-call' | 'call' | 'result';
  }>;
};

export type UIMessageChunk = {
  type: 'message-start';
  message: UIMessage;
} | {
  type: 'message-delta';
  messageId: string;
  delta: {
    role?: 'system' | 'user' | 'assistant' | 'tool';
    content?: string;
    toolInvocations?: Array<{
      toolCallId: string;
      toolName: string;
      args: any;
      result?: any;
      state: 'partial-call' | 'call' | 'result';
    }>;
  };
} | {
  type: 'message-stop';
  messageId: string;
} | {
  type: 'finish';
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';
  usage: LanguageModelUsage;
} | {
  type: 'error';
  error: string;
};

// Stream Text Options
export type StreamTextOptions<T = any> = {
  model: LanguageModel;
  system?: string;
  prompt?: string;
  messages?: Array<SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage>;
  tools?: T;
  toolChoice?: ToolChoice;
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  stopSequences?: string[];
  seed?: number;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
  experimental_generateMessageId?: () => string;
  experimental_telemetry?: TelemetrySettings;
  experimental_transform?: StreamTextTransform | Array<StreamTextTransform>;
  includeRawChunks?: boolean;
  providerOptions?: Record<string, Record<string, any>>;
  activeTools?: Array<keyof T>;
  stopWhen?: StopCondition<T> | Array<StopCondition<T>>;
  prepareStep?: (options: PrepareStepOptions) => PrepareStepResult<T> | Promise<PrepareStepResult<T>>;
  experimental_context?: unknown;
  experimental_download?: (requestedDownloads: Array<{ url: URL; isUrlSupportedByModel: boolean }>) => Promise<Array<null | { data: Uint8Array; mediaType?: string }>>;
  experimental_repairToolCall?: (options: any) => Promise<any>;
  onChunk?: (event: OnChunkResult) => Promise<void> | void;
  onError?: (event: OnErrorResult) => Promise<void> | void;
  experimental_output?: any;
  onStepFinish?: (result: OnStepFinishResult) => Promise<void> | void;
  onFinish?: (result: OnFinishResult) => Promise<void> | void;
  onAbort?: (event: OnAbortResult) => Promise<void> | void;
};

// Stream Text Result
export type StreamTextResult<T = any> = {
  content: Promise<Array<TextStreamPart<T>>>;
  finishReason: Promise<'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'>;
  usage: Promise<LanguageModelUsage>;
  totalUsage: Promise<LanguageModelUsage>;
  providerMetadata: Promise<Record<string, Record<string, any>> | undefined>;
  text: Promise<string>;
  reasoning: Promise<Array<any>>;
  reasoningText: Promise<string | undefined>;
  sources: Promise<Array<Source>>;
  files: Promise<Array<GeneratedFile>>;
  toolCalls: Promise<TypedToolCall<T>[]>;
  toolResults: Promise<TypedToolResult<T>[]>;
  request: Promise<any>;
  response: Promise<any>;
  warnings: Promise<Warning[] | undefined>;
  steps: Promise<Array<StepResult<T>>>;
  textStream: AsyncIterableStream<string>;
  fullStream: AsyncIterableStream<TextStreamPart<T>>;
  experimental_partialOutputStream: AsyncIterableStream<any>;
  consumeStream: (options?: ConsumeStreamOptions) => Promise<void>;
  toUIMessageStream: (options?: UIMessageStreamOptions) => AsyncIterableStream<UIMessageChunk>;
  pipeUIMessageStreamToResponse: (response: any, options?: any) => void;
  pipeTextStreamToResponse: (response: any, init?: any) => void;
  toUIMessageStreamResponse: (options?: any) => Response;
  toTextStreamResponse: (init?: any) => Response;
};

export type TypedToolCall<T> = {
  toolCallId: string;
  toolName: keyof T;
  input: any;
};

export type TypedToolResult<T> = {
  toolCallId: string;
  toolName: keyof T;
  input: any;
  output: any;
};

export type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>;

/**
 * Stream text generations from a language model.
 */
export function streamText<T = any>(options: StreamTextOptions<T>): StreamTextResult<T> {
  const {
    model,
    system,
    prompt,
    messages = [],
    tools = {} as T,
    toolChoice = 'auto',
    maxOutputTokens,
    temperature,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    stopSequences,
    seed,
    maxRetries = 2,
    abortSignal,
    headers,
    experimental_generateMessageId,
    experimental_telemetry,
    experimental_transform,
    includeRawChunks = false,
    providerOptions,
    activeTools,
    stopWhen,
    prepareStep,
    experimental_context,
    experimental_download,
    experimental_repairToolCall,
    onChunk,
    onError,
    experimental_output,
    onStepFinish,
    onFinish,
    onAbort
  } = options;

  // Convert messages to internal format
  const convertedMessages: LanguageModelV1Message[] = messages.map(msg => {
    switch (msg.role) {
      case 'system':
        return {
          role: 'system',
          content: [{ type: 'text', text: msg.content }]
        };
      case 'user':
        return {
          role: 'user',
          content: typeof msg.content === 'string'
            ? [{ type: 'text', text: msg.content }]
            : msg.content.map(part => {
                switch (part.type) {
                  case 'text':
                    return { type: 'text', text: part.text };
                  case 'image':
                    return {
                      type: 'image',
                      image: part.image as Uint8Array,
                      mimeType: part.mediaType || 'image/jpeg'
                    };
                  case 'file':
                    return {
                      type: 'text',
                      text: `File: ${part.mediaType}`
                    };
                  default:
                    return { type: 'text', text: '' };
                }
              })
        };
      case 'assistant':
        return {
          role: 'assistant',
          content: typeof msg.content === 'string'
            ? [{ type: 'text', text: msg.content }]
            : msg.content.map(part => {
                switch (part.type) {
                  case 'text':
                    return { type: 'text', text: part.text };
                  case 'reasoning':
                    return { type: 'text', text: `Reasoning: ${part.text}` };
                  case 'tool-call':
                    return { type: 'text', text: `Tool call: ${part.toolName}` };
                  default:
                    return { type: 'text', text: '' };
                }
              }),
          toolCalls: typeof msg.content !== 'string'
            ? msg.content
                .filter((part): part is ToolCallPart => part.type === 'tool-call')
                .map(part => ({
                  toolCallId: part.toolCallId,
                  toolName: part.toolName,
                  args: part.input
                }))
            : undefined
        };
      case 'tool':
        return {
          role: 'tool',
          content: [{ type: 'text', text: JSON.stringify(msg.content) }],
          toolCallId: msg.toolCallId
        };
      default:
        return {
          role: 'user',
          content: [{ type: 'text', text: 'Unknown message type' }]
        };
    }
  });

  // Add system message if provided
  if (system) {
    convertedMessages.unshift({
      role: 'system',
      content: [{ type: 'text', text: system }]
    });
  }

  // Add prompt as user message if provided and no messages
  if (prompt && messages.length === 0) {
    convertedMessages.push({
      role: 'user',
      content: [{ type: 'text', text: prompt }]
    });
  }

  // Prepare model call options
  const callOptions = {
    mode: { type: 'regular' as const },
    inputFormat: 'messages' as const,
    prompt: '',
    messages: convertedMessages,
    maxTokens: maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    seed,
    abortSignal
  };

  // Handle tools
  if (Object.keys(tools).length > 0) {
    callOptions.mode = {
      type: 'object-tool' as const,
      tool: {
        type: 'function' as const,
        name: 'execute_tools',
        description: 'Execute available tools',
        parameters: {
          type: 'object',
          properties: Object.fromEntries(
            Object.entries(tools as Record<string, ToolDefinition>).map(([name, tool]) => [
              name,
              {
                type: 'object',
                properties: tool.inputSchema?.properties || {},
                description: tool.description
              }
            ])
          )
        }
      }
    };
  }

  // State management
  let fullText = '';
  let reasoningText = '';
  const toolCalls: TypedToolCall<T>[] = [];
  const toolResults: TypedToolResult<T>[] = [];
  const sources: Source[] = [];
  const files: GeneratedFile[] = [];
  const warnings: Warning[] = [];
  let finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown' = 'other';
  let usage: LanguageModelUsage = {};
  let providerMetadata: Record<string, Record<string, any>> | undefined;
  const steps: StepResult<T>[] = [];

  // Create text stream
  let textStreamController: ReadableStreamDefaultController<string>;
  const textStream = new ReadableStream<string>({
    start(controller) {
      textStreamController = controller;
    }
  });

  // Create full stream
  let fullStreamController: ReadableStreamDefaultController<TextStreamPart<T>>;
  const fullStream = new ReadableStream<TextStreamPart<T>>({
    start(controller) {
      fullStreamController = controller;
    }
  });

  // Execute the streaming call
  const executeStream = async () => {
    try {
      const response = await model.doStream(callOptions);

      // Handle warnings
      if (response.warnings) {
        warnings.push(...response.warnings.map(w => ({
          type: w.type,
          setting: w.setting,
          details: w.details
        })));
      }

      const reader = response.stream.getReader();
      let currentStepText = '';
      let currentStepReasoning = '';
      let currentStepToolCalls: ToolCall[] = [];
      let currentStepToolResults: ToolResult[] = [];
      let stepStartTime = Date.now();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          switch (value.type) {
            case 'text-delta':
              fullText += value.textDelta;
              currentStepText += value.textDelta;

              // Emit to text stream
              textStreamController.enqueue(value.textDelta);

              // Emit to full stream
              const textPart: TextStreamPart<T> = {
                type: 'text',
                text: value.textDelta
              };
              fullStreamController.enqueue(textPart);

              // Call onChunk callback
              if (onChunk) {
                await onChunk({ chunk: textPart });
              }
              break;

            case 'tool-call-delta':
              const toolCallDeltaPart: TextStreamPart<T> = {
                type: 'tool-call-delta',
                toolCallId: value.toolCallId,
                toolName: value.toolName,
                argsTextDelta: value.argsTextDelta
              };
              fullStreamController.enqueue(toolCallDeltaPart);

              if (onChunk) {
                await onChunk({ chunk: toolCallDeltaPart });
              }
              break;

            case 'tool-call':
              const toolCall: TypedToolCall<T> = {
                toolCallId: value.toolCallId,
                toolName: value.toolName as keyof T,
                input: value.args
              };
              toolCalls.push(toolCall);
              currentStepToolCalls.push({
                toolCallId: value.toolCallId,
                toolName: value.toolName,
                input: value.args
              });

              const toolCallPart: TextStreamPart<T> = {
                type: 'tool-call',
                toolCallId: value.toolCallId,
                toolName: value.toolName,
                input: value.args
              };
              fullStreamController.enqueue(toolCallPart);

              if (onChunk) {
                await onChunk({ chunk: toolCallPart });
              }

              // Execute tool if available
              const tool = (tools as Record<string, ToolDefinition>)[value.toolName];
              if (tool?.execute) {
                try {
                  const result = await tool.execute(value.args as Record<string, unknown>, {
                    toolCallId: value.toolCallId,
                    messages: convertedMessages,
                    abortSignal
                  });

                  const toolResult: TypedToolResult<T> = {
                    toolCallId: value.toolCallId,
                    toolName: value.toolName as keyof T,
                    input: value.args,
                    output: result
                  };
                  toolResults.push(toolResult);
                  currentStepToolResults.push({
                    toolCallId: value.toolCallId,
                    toolName: value.toolName,
                    input: value.args,
                    output: result
                  });

                  const toolResultPart: TextStreamPart<T> = {
                    type: 'tool-result',
                    toolCallId: value.toolCallId,
                    toolName: value.toolName,
                    input: value.args,
                    output: result
                  };
                  fullStreamController.enqueue(toolResultPart);
                } catch (error) {
                  console.error(`Tool ${value.toolName} execution failed:`, error);
                  if (onError) {
                    await onError({ error });
                  }
                }
              }
              break;

            case 'finish':
              finishReason = value.finishReason;
              usage = {
                inputTokens: value.usage.promptTokens,
                outputTokens: value.usage.completionTokens,
                totalTokens: value.usage.promptTokens + value.usage.completionTokens
              };

              // Create step result
              const stepResult: StepResult<T> = {
                stepType: steps.length === 0 ? 'initial' : 'continue',
                text: currentStepText,
                reasoning: currentStepReasoning,
                sources: [...sources],
                files: [...files],
                toolCalls: [...currentStepToolCalls],
                toolResults: [...currentStepToolResults],
                finishReason: value.finishReason,
                usage: { ...usage },
                warnings: [...warnings],
                isContinued: false
              };
              steps.push(stepResult);

              // Call onStepFinish callback
              if (onStepFinish) {
                await onStepFinish({
                  stepType: stepResult.stepType,
                  finishReason: stepResult.finishReason,
                  usage: stepResult.usage,
                  text: stepResult.text,
                  reasoning: stepResult.reasoning,
                  sources: stepResult.sources,
                  files: stepResult.files,
                  toolCalls: stepResult.toolCalls,
                  toolResults: stepResult.toolResults,
                  warnings: stepResult.warnings,
                  response: undefined,
                  isContinued: stepResult.isContinued,
                  providerMetadata
                });
              }
              break;

            case 'error':
              finishReason = 'error';
              if (onError) {
                await onError({ error: value.error });
              }
              const errorPart: TextStreamPart<T> = {
                type: 'error',
                error: value.error
              };
              fullStreamController.enqueue(errorPart);
              break;
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Close streams
      textStreamController.close();
      fullStreamController.close();

      // Call onFinish callback
      if (onFinish) {
        await onFinish({
          finishReason,
          usage,
          providerMetadata,
          text: fullText,
          reasoning: reasoningText ? [{ type: 'reasoning', text: reasoningText }] : [],
          reasoningText: reasoningText || undefined,
          sources,
          files,
          toolCalls,
          toolResults,
          warnings,
          response: undefined,
          steps
        });
      }

    } catch (error) {
      finishReason = 'error';
      if (onError) {
        await onError({ error });
      }
      textStreamController.error(error);
      fullStreamController.error(error);
    }
  };

  // Start the streaming execution
  executeStream();

  // Return the result object with all the required properties
  const result: StreamTextResult<T> = {
    content: Promise.resolve([]), // Placeholder - would need to collect all parts
    finishReason: Promise.resolve(finishReason),
    usage: Promise.resolve(usage),
    totalUsage: Promise.resolve(usage),
    providerMetadata: Promise.resolve(providerMetadata),
    text: Promise.resolve(fullText),
    reasoning: Promise.resolve(reasoningText ? [{ type: 'reasoning', text: reasoningText }] : []),
    reasoningText: Promise.resolve(reasoningText || undefined),
    sources: Promise.resolve(sources),
    files: Promise.resolve(files),
    toolCalls: Promise.resolve(toolCalls),
    toolResults: Promise.resolve(toolResults),
    request: Promise.resolve({}),
    response: Promise.resolve({}),
    warnings: Promise.resolve(warnings),
    steps: Promise.resolve(steps),
    textStream: textStream as AsyncIterableStream<string>,
    fullStream: fullStream as AsyncIterableStream<TextStreamPart<T>>,
    experimental_partialOutputStream: textStream as AsyncIterableStream<any>,
    consumeStream: async (options?: ConsumeStreamOptions) => {
      try {
        const reader = textStream.getReader();
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      } catch (error) {
        if (options?.onError) {
          options.onError(error);
        }
      }
    },
    toUIMessageStream: (options?: UIMessageStreamOptions) => {
      // Simplified implementation - would need full UI message stream logic
      return textStream as any;
    },
    pipeUIMessageStreamToResponse: (response: any, options?: any) => {
      // Implementation would pipe to response
    },
    pipeTextStreamToResponse: (response: any, init?: any) => {
      // Implementation would pipe to response
    },
    toUIMessageStreamResponse: (options?: any) => {
      return new Response(textStream, {
        headers: { 'Content-Type': 'text/plain' }
      });
    },
    toTextStreamResponse: (init?: any) => {
      return new Response(textStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          ...init?.headers
        }
      });
    }
  };

  return result;
}