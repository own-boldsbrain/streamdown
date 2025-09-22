import { z } from 'zod';
import {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1Message,
  LanguageModelV1TextPart,
  Tool
} from './types.js';

// Generate Text Options
export type GenerateTextOptions = {
  model: LanguageModelV1;
  prompt?: string;
  messages?: LanguageModelV1Message[];
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
};

export type GenerateTextResult = {
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
 * Generate text from a language model.
 */
export async function generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
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
    abortSignal
  } = options;

  // Convert prompt to messages if provided
  let finalMessages = messages;
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
  const callOptions: LanguageModelV1CallOptions = {
    mode: { type: 'regular' },
    inputFormat: 'messages',
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
      type: 'object-tool',
      tool: {
        type: 'function',
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
    const response = await model.doGenerate(callOptions);

    let result: GenerateTextResult = {
      text: response.text || '',
      finishReason: response.finishReason,
      usage: {
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
        totalTokens: response.usage.promptTokens + response.usage.completionTokens
      },
      warnings: response.warnings
    };

    // Handle tool calls
    if (response.toolCalls && response.toolCalls.length > 0) {
      const toolResults = await Promise.all(
        response.toolCalls.map(async (toolCall) => {
          const tool = tools[toolCall.toolName];
          if (!tool) {
            throw new Error(`Tool ${toolCall.toolName} not found`);
          }

          try {
            const toolResult = await tool.execute(toolCall.args);
            return {
              toolCallId: toolCall.toolCallId,
              toolName: toolCall.toolName,
              args: toolCall.args,
              result: toolResult
            };
          } catch (error) {
            throw new Error(`Tool ${toolCall.toolName} execution failed: ${error}`);
          }
        })
      );

      result.toolCalls = response.toolCalls.map(tc => ({
        toolCallId: tc.toolCallId,
        toolName: tc.toolName,
        args: tc.args
      }));

      result.toolResults = toolResults;
    }

    return result;
  } catch (error) {
    throw new Error(`Text generation failed: ${error}`);
  }
}