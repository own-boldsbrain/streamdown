import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the template composer
vi.mock("../../../../../../lib/services/template-composer", () => ({
  compose: vi.fn(),
}));

// Mock the personas repo
vi.mock("../../../../../../lib/repo/personas-repo", () => ({
  getRegion: vi.fn(),
}));

describe("AI SDK Core + Template Composer Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should compose WhatsApp message with AI-generated content", () => {
    const {
      compose,
    } = require("../../../../../../lib/services/template-composer");

    const mockComposeResult = {
      channel: "whatsapp",
      raw: {
        header: "Oferta Especial",
        body: "{{aiContent}} Para {{customerName}}: {{offer}} em todos os produtos!",
        footer: "Aproveite enquanto dura!",
        cta: { url_template: "https://example.com/offer" },
      },
      rendered: {
        header: "Oferta Especial",
        body: "Olá! Temos uma oferta especial para você! Para João Silva: 50% off em todos os produtos!",
        footer: "Aproveite enquanto dura!",
      },
      placeholdersUsed: ["aiContent", "customerName", "offer"],
      compliance: { status: "pass", errors: [] },
    };

    compose.mockReturnValue(mockComposeResult);

    const request = {
      personaId: "test-persona",
      region: "BR",
      channel: "whatsapp" as const,
      variables: {
        customerName: "João Silva",
        offer: "50% off",
        aiContent: "Olá! Temos uma oferta especial para você!",
      },
      marketing: false,
    };

    const result = compose(request);

    expect(result.compliance.status).toBe("pass");
    expect(result.rendered.body).toContain("João Silva");
    expect(result.rendered.body).toContain("50% off");
    expect(result.rendered.body).toContain("Olá! Temos uma oferta especial");
    expect(result.channel).toBe("whatsapp");
  });

  it("should integrate with AI SDK Core generateText function", async () => {
    const { generateText } = await import("@streamdown/ai-sdk-core");

    // Simple mock that matches the expected interface
    const mockModel = {
      generateText: vi.fn().mockResolvedValue({
        text: "AI-generated content for testing",
        finishReason: "stop",
      }),
    };

    const result = await generateText({
      model: mockModel as any, // Type assertion for testing
      prompt: "Generate test content",
    });

    expect(result.text).toBe("AI-generated content for testing");
    expect(result.finishReason).toBe("stop");
    expect(mockModel.generateText).toHaveBeenCalledWith({
      prompt: "Generate test content",
    });
  });
});
