import { describe, it, expect, vi } from 'vitest';
import {
  generateText,
  streamText,
  generateObject,
  embed,
  embedMany,
  tool,
  jsonSchema,
  zodSchema,
  cosineSimilarity,
  generateId
} from '../src/index.js';

// Mock implementations for testing
const mockLanguageModel = {
  specificationVersion: 'v1' as const,
  provider: 'test',
  modelId: 'test-model',
  doGenerate: vi.fn(),
  doStream: vi.fn(),
};

describe('AI SDK Core', () => {
  describe('generateText', () => {
    it('should be a function', () => {
      expect(typeof generateText).toBe('function');
    });

    it('should handle basic text generation', async () => {
      mockLanguageModel.doGenerate.mockResolvedValue({
        text: 'Hello, world!',
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 20 },
      });

      const result = await generateText({
        model: mockLanguageModel as any,
        prompt: 'Say hello',
      });

      expect(result.text).toBe('Hello, world!');
      expect(result.finishReason).toBe('stop');
    });
  });

  describe('streamText', () => {
    it('should be a function', () => {
      expect(typeof streamText).toBe('function');
    });
  });

  describe('generateObject', () => {
    it('should be a function', () => {
      expect(typeof generateObject).toBe('function');
    });
  });

  describe('embed', () => {
    it('should be a function', () => {
      expect(typeof embed).toBe('function');
    });
  });

  describe('embedMany', () => {
    it('should be a function', () => {
      expect(typeof embedMany).toBe('function');
    });
  });

  describe('tool', () => {
    it('should create a tool definition', () => {
      const testTool = tool({
        description: 'Test tool',
        parameters: { type: 'object', properties: { input: { type: 'string' } } } as any,
        execute: (args: any) => `Processed: ${args.input}`,
      });

      expect(testTool.description).toBe('Test tool');
      expect(testTool.execute({ input: 'test' })).toBe('Processed: test');
    });
  });

  describe('jsonSchema', () => {
    it('should return the schema unchanged', () => {
      const schema = { type: 'object', properties: { name: { type: 'string' } } };
      expect(jsonSchema(schema)).toEqual(schema);
    });
  });

  describe('zodSchema', () => {
    it('should return the schema unchanged', () => {
      const schema = { safeParse: vi.fn() } as any;
      expect(zodSchema(schema)).toBe(schema);
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate cosine similarity correctly', () => {
      const a = [1, 0];
      const b = [0, 1];
      expect(cosineSimilarity(a, b)).toBe(0);

      const c = [1, 0];
      const d = [1, 0];
      expect(cosineSimilarity(c, d)).toBe(1);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});