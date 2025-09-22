import {
  LanguageModelV1,
  LanguageModelV1StreamPart,
  Tool
} from './types.js';

// Stream Text Options
export type StreamTextOptions = {
  model: LanguageModelV1;
  prompt?: string;
  messages?: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | Array<{ type: 'text'; text: string }>;
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
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  seed?: number;
  tools?: Record<string, Tool>;
  toolChoice?: 'auto' | 'none' | 'required' | { type: 'tool'; toolName: string };
  abortSignal?: AbortSignal;
  onChunk?: (chunk: StreamTextChunk) => void | Promise<void>;
  onFinish?: (result: StreamTextResult) => void | Promise<void>;
};

export type StreamTextChunk = {
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
};

export type StreamTextResult = {
  text: string;
  toolCalls?: Array<{
    toolCallId: string;
    toolName: string;
    args: unknown;
    result?: unknown;
  }>;
  toolResults?: Array<{
    toolCallId: string;
    toolName: string;
    args: unknown;
    result: unknown;
  }>;
  finishReason: 'stop' | 'length' | 'tool-calls' | 'content-filter' | 'error' | 'other';
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  warnings?: Array<{
    type: 'unsupported-setting';
    setting: string;
    details?: string;
  }>;
};

/**
 * Stream text from a language model.
 */
export async function streamText(options: StreamTextOptions): Promise<ReadableStream<StreamTextChunk> & { toTextStreamResponse: () => Response }> {
  const {
    model,
    prompt,
    messages = [],
    system,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    seed,
    tools = {},
    toolChoice = 'auto',
    abortSignal,
    onChunk,
    onFinish
  } = options;

  // Convert prompt to messages if provided
  let finalMessages = messages.map(msg => ({
    role: msg.role,
    content: typeof msg.content === 'string'
      ? [{ type: 'text' as const, text: msg.content }]
      : msg.content,
    name: msg.name,
    toolCallId: msg.toolCallId,
    toolCalls: msg.toolCalls
  }));

  if (prompt && messages.length === 0) {
    finalMessages = [{ role: 'user', content: [{ type: 'text', text: prompt }] }];
  }

  // Add system message if provided
  if (system) {
    finalMessages = [
      { role: 'system', content: [{ type: 'text', text: system }] },
      ...finalMessages
    ];
  }

  // Prepare model call options
  const callOptions = {
    mode: { type: 'regular' as const },
    inputFormat: 'messages' as const,
    prompt: '',
    messages: finalMessages,
    maxTokens,
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
            Object.entries(tools).map(([name, tool]) => [
              name,
              {
                type: 'object',
                properties: tool.parameters,
                description: tool.description
              }
            ])
          )
        }
      }
    };
  }

  try {
    const response = await model.doStream(callOptions);

    let fullText = '';
    const toolCalls: Array<{
      toolCallId: string;
      toolName: string;
      args: unknown;
      result?: unknown;
    }> = [];
    let finishReason: StreamTextResult['finishReason'] = 'other';
    let usage: StreamTextResult['usage'] | undefined;

    const transformStream = new TransformStream<LanguageModelV1StreamPart, StreamTextChunk>({
      async transform(chunk, controller) {
        switch (chunk.type) {
          case 'text-delta':
            fullText += chunk.textDelta;
            const textChunk: StreamTextChunk = {
              type: 'text-delta',
              textDelta: chunk.textDelta
            };
            controller.enqueue(textChunk);
            if (onChunk) await onChunk(textChunk);
            break;

          case 'tool-call-delta':
            const toolCallDeltaChunk: StreamTextChunk = {
              type: 'tool-call-delta',
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              argsTextDelta: chunk.argsTextDelta
            };
            controller.enqueue(toolCallDeltaChunk);
            if (onChunk) await onChunk(toolCallDeltaChunk);
            break;

          case 'tool-call':
            const toolCallChunk: StreamTextChunk = {
              type: 'tool-call',
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              args: chunk.args
            };
            controller.enqueue(toolCallChunk);
            if (onChunk) await onChunk(toolCallChunk);

            // Execute tool
            const tool = tools[chunk.toolName];
            if (tool) {
              try {
                const result = await tool.execute(chunk.args);
                toolCalls.push({
                  toolCallId: chunk.toolCallId,
                  toolName: chunk.toolName,
                  args: chunk.args,
                  result
                });
              } catch (error) {
                console.error(`Tool ${chunk.toolName} execution failed:`, error);
              }
            }
            break;

          case 'finish':
            finishReason = chunk.finishReason;
            usage = {
              promptTokens: chunk.usage.promptTokens,
              completionTokens: chunk.usage.completionTokens,
              totalTokens: chunk.usage.promptTokens + chunk.usage.completionTokens
            };
            break;

          case 'error':
            console.error('Stream error:', chunk.error);
            break;
        }
      },

      async flush(controller) {
        // Call onFinish callback
        if (onFinish && usage) {
          const result: StreamTextResult = {
            text: fullText,
            toolCalls,
            toolResults: toolCalls.filter(tc => tc.result !== undefined),
            finishReason,
            usage,
            warnings: response.warnings
          };
          await onFinish(result);
        }
      }
    });

    const stream = response.stream.pipeThrough(transformStream);

    // Add toTextStreamResponse method
    const enhancedStream = Object.assign(stream, {
      toTextStreamResponse(): Response {
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
          }
        });
      }
    });

    return enhancedStream;
  } catch (error) {
    throw new Error(`Text streaming failed: ${error}`);
  }
}