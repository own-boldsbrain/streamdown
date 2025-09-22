import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as analytics from "../../../../../../lib/analytics/events";
import * as templateComposer from "../../../../../../lib/services/template-composer";
import { POST as composeHandler } from "../compose/route";
import { POST as validateHandler } from "../validate/route";

// Mock das dependências
vi.mock("../../../../../../lib/services/template-composer", () => ({
  compose: vi.fn(),
}));

vi.mock("../../../../../../lib/analytics/events", () => ({
  emitTemplateRequested: vi.fn(),
  emitTemplateRendered: vi.fn(),
  emitComplianceFailed: vi.fn(),
}));

describe("API de Mensageria", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Rota de Composição (/api/messaging/compose)", () => {
    it("deve retornar 200 para um template válido", async () => {
      // Mock de uma resposta de sucesso do composer
      const mockComposeResult = {
        channel: "whatsapp",
        raw: { body: "Template original" },
        rendered: { body: "Template renderizado" },
        placeholdersUsed: ["nome", "valor"],
        compliance: { status: "pass", errors: [] },
      };

      vi.mocked(templateComposer.compose).mockReturnValue(mockComposeResult);

      // Criar uma requisição mock
      const mockRequest = new NextRequest(
        "http://localhost/api/messaging/compose",
        {
          method: "POST",
          body: JSON.stringify({
            personaId: "test-id",
            region: "SE",
            channel: "whatsapp",
            variables: { nome: "Test" },
          }),
        }
      );

      const response = await composeHandler(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockComposeResult);
      expect(analytics.emitTemplateRequested).toHaveBeenCalled();
      expect(analytics.emitTemplateRendered).toHaveBeenCalled();
      expect(analytics.emitComplianceFailed).not.toHaveBeenCalled();
    });

    it("deve retornar 422 para um template com falha de compliance", async () => {
      // Mock de uma resposta com falha de compliance
      const mockComposeResult = {
        channel: "whatsapp",
        raw: { body: "Template original com link http://example.com" },
        rendered: { body: "Template renderizado com link http://example.com" },
        placeholdersUsed: ["nome"],
        compliance: {
          status: "fail",
          errors: ["WhatsApp: link no body sem CTA URL"],
        },
      };

      vi.mocked(templateComposer.compose).mockReturnValue(mockComposeResult);

      // Criar uma requisição mock
      const mockRequest = new NextRequest(
        "http://localhost/api/messaging/compose",
        {
          method: "POST",
          body: JSON.stringify({
            personaId: "test-id",
            region: "SE",
            channel: "whatsapp",
            variables: { nome: "Test" },
          }),
        }
      );

      const response = await composeHandler(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(422);
      expect(responseData.compliance.status).toBe("fail");
      expect(analytics.emitTemplateRequested).toHaveBeenCalled();
      expect(analytics.emitTemplateRendered).not.toHaveBeenCalled();
      expect(analytics.emitComplianceFailed).toHaveBeenCalled();
    });

    it("deve retornar 400 para uma persona inexistente", async () => {
      // Mock de um erro no composer
      vi.mocked(templateComposer.compose).mockImplementation(() => {
        throw new Error("Persona/região não encontrada");
      });

      // Criar uma requisição mock
      const mockRequest = new NextRequest(
        "http://localhost/api/messaging/compose",
        {
          method: "POST",
          body: JSON.stringify({
            personaId: "invalid-id",
            region: "SE",
            channel: "whatsapp",
          }),
        }
      );

      const response = await composeHandler(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe("Persona/região não encontrada");
      expect(analytics.emitTemplateRequested).toHaveBeenCalled();
    });
  });

  describe("Rota de Validação (/api/messaging/validate)", () => {
    it("deve retornar 200 para um template válido", async () => {
      // Mock de uma resposta de sucesso do composer
      const mockComposeResult = {
        channel: "whatsapp",
        raw: { body: "Template original" },
        rendered: { body: "Template renderizado" },
        placeholdersUsed: ["nome", "valor"],
        compliance: { status: "pass", errors: [] },
      };

      vi.mocked(templateComposer.compose).mockReturnValue(mockComposeResult);

      // Criar uma requisição mock
      const mockRequest = new NextRequest(
        "http://localhost/api/messaging/validate",
        {
          method: "POST",
          body: JSON.stringify({
            personaId: "test-id",
            region: "SE",
            channel: "whatsapp",
          }),
        }
      );

      const response = await validateHandler(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.compliance.status).toBe("pass");
    });

    it("deve retornar 422 para um template com falha de compliance", async () => {
      // Mock de uma resposta com falha de compliance
      const mockComposeResult = {
        channel: "sms",
        raw: { sms: "a".repeat(161) },
        rendered: { sms: "a".repeat(161) },
        placeholdersUsed: [],
        compliance: {
          status: "fail",
          errors: ["SMS > 160 chars"],
        },
      };

      vi.mocked(templateComposer.compose).mockReturnValue(mockComposeResult);

      // Criar uma requisição mock
      const mockRequest = new NextRequest(
        "http://localhost/api/messaging/validate",
        {
          method: "POST",
          body: JSON.stringify({
            personaId: "test-id",
            region: "SE",
            channel: "sms",
          }),
        }
      );

      const response = await validateHandler(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(422);
      expect(responseData.compliance.status).toBe("fail");
      expect(responseData.compliance.errors).toContain("SMS > 160 chars");
    });
  });
});
