import { Experimental_Agent as Agent } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { tool } from 'ai';

const openai = createOpenAI({
  // compatibility: 'strict', // strict mode, default
});

const agent = new Agent({
  model: openai('gpt-4o'),
  system: 'Você é um assistente prestativo.',
  tools: {
    calculator: tool({
      description: 'Calcula o valor de uma expressão matemática.',
      parameters: z.object({
        expression: z.string().describe('A expressão matemática a ser avaliada.'),
      }),
      execute: async ({ expression }) => {
        try {
          // Atenção: `eval` é inseguro em produção.
          // Esta é apenas uma demonstração.
          // Em um aplicativo real, use uma biblioteca de avaliação de matemática segura.
          const result = eval(expression);
          return { result };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
    }),
  },
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  return agent.respond({
    messages,
  });
}
