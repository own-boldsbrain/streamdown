import { describe, expect, it, vi } from "vitest";

// Mock fetch for testing
global.fetch = vi.fn();

describe("AI Content Generator Integration", () => {
  it("should generate content for WhatsApp channel", async () => {
    const mockResponse = {
      content:
        "Olá! Conteúdo gerado por IA para comunicação personalizada. Descubra nossas ofertas especiais! 🚀",
      channel: "whatsapp",
      generatedAt: new Date().toISOString(),
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetch("/api/ai/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "whatsapp",
        variables: { name: "João" },
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.channel).toBe("whatsapp");
    expect(data.content).toContain("Olá!");
    expect(data.generatedAt).toBeDefined();
  });

  it("should generate content for SMS channel", async () => {
    const mockResponse = {
      content:
        "Conteúdo gerado por IA para comunicação personalizada. Acesse: link.com",
      channel: "sms",
      generatedAt: new Date().toISOString(),
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetch("/api/ai/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "sms",
        variables: {},
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.channel).toBe("sms");
    expect(data.content).toContain("link.com");
  });

  it("should handle variable substitution", async () => {
    const mockResponse = {
      content:
        "Olá João! Conteúdo gerado por IA para comunicação personalizada. Descubra nossas ofertas especiais! 🚀",
      channel: "whatsapp",
      generatedAt: new Date().toISOString(),
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetch("/api/ai/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "whatsapp",
        variables: { name: "João" },
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.content).toContain("João");
  });

  it("should handle API errors gracefully", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const response = await fetch("/api/ai/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "whatsapp",
        variables: {},
      }),
    });

    expect(response.ok).toBe(false);
  });
});
