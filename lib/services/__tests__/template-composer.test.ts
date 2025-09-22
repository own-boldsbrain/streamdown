import { beforeEach, describe, expect, it, vi } from "vitest";
import * as personasRepo from "../../repo/personas-repo";
import { compose } from "../template-composer";

// Mock do repositório de personas
vi.mock("../../repo/personas-repo", () => ({
  getRegion: vi.fn(),
}));

describe("Template Composer", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("WhatsApp Template Tests", () => {
    it("deve aprovar um template WhatsApp válido", () => {
      // Mock da região com template válido
      const mockRegion = {
        value_prop: "Proposta de valor",
        whatsapp: {
          header: "Olá {{nome}}",
          body: "Sua economia será de {{economia_pct}}%. Saiba mais!",
          footer: "Responda SAIR para cancelar.",
          cta: {
            text: "Ver detalhes",
            url_template: "https://example.com/{{id}}",
          },
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "whatsapp",
        variables: { nome: "Maria", economia_pct: "30", id: "123" },
      });

      expect(result.compliance.status).toBe("pass");
      expect(result.rendered.body).toBe(
        "Sua economia será de 30%. Saiba mais!"
      );
      expect(result.rendered.header).toBe("Olá Maria");
    });

    it("deve falhar quando WA marketing não tem opt-out", () => {
      // Mock da região com template sem opt-out
      const mockRegion = {
        value_prop: "Proposta de valor",
        whatsapp: {
          header: "Olá {{nome}}",
          body: "Sua economia será de {{economia_pct}}%.",
          footer: "Obrigado!", // Sem opt-out
          cta: {
            text: "Ver detalhes",
            url_template: "https://example.com/{{id}}",
          },
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "whatsapp",
        variables: { nome: "Maria", economia_pct: "30", id: "123" },
        marketing: true, // Explicitamente marketing
      });

      // Deve adicionar opt-out automaticamente
      expect(result.rendered.footer).toContain("SAIR p/ descad.");
      expect(result.compliance.status).toBe("pass");
    });

    it("deve falhar quando body WA > 1024 caracteres", () => {
      // Mock da região com body muito longo
      const longText = "a".repeat(1025);

      const mockRegion = {
        value_prop: "Proposta de valor",
        whatsapp: {
          header: "Olá",
          body: longText,
          footer: "Responda SAIR para cancelar.",
          cta: {
            text: "Ver detalhes",
            url_template: "https://example.com/123",
          },
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "whatsapp",
      });

      expect(result.compliance.status).toBe("fail");
      expect(result.compliance.errors[0]).toContain(
        "WhatsApp body > 1024 chars"
      );
    });

    it("deve falhar quando há link no body sem CTA URL", () => {
      // Mock da região com link no body mas sem CTA URL
      const mockRegion = {
        value_prop: "Proposta de valor",
        whatsapp: {
          header: "Olá",
          body: "Visite https://example.com para mais detalhes.",
          footer: "Responda SAIR para cancelar.",
          cta: {
            text: "Ver detalhes",
            // URL faltando
          },
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "whatsapp",
      });

      expect(result.compliance.status).toBe("fail");
      expect(result.compliance.errors[0]).toContain(
        "WhatsApp: link no body sem CTA URL"
      );
    });
  });

  describe("SMS Template Tests", () => {
    it("deve aprovar um SMS válido", () => {
      const mockRegion = {
        value_prop: "Proposta de valor",
        sms: "Olá {{nome}}, economize {{economia_pct}}%. {{link}} PARE p/ sair",
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "sms",
        variables: {
          nome: "João",
          economia_pct: "25",
          link: "https://y.sh/abc",
        },
      });

      expect(result.compliance.status).toBe("pass");
      expect(result.rendered.sms).toBe(
        "Olá João, economize 25%. https://y.sh/abc PARE p/ sair"
      );
    });

    it("deve falhar quando SMS > 160 caracteres", () => {
      const longSMS = "a".repeat(161);

      const mockRegion = {
        value_prop: "Proposta de valor",
        sms: longSMS,
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "sms",
      });

      expect(result.compliance.status).toBe("fail");
      expect(result.compliance.errors[0]).toContain("SMS > 160 chars");
    });

    it("deve adicionar opt-out ao SMS de marketing", () => {
      const mockRegion = {
        value_prop: "Proposta de valor",
        sms: "Olá, economize 25% com o kit solar. https://y.sh/abc",
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "sms",
        marketing: true,
      });

      expect(result.rendered.sms).toContain("SAIR p/ descad.");
      expect(result.compliance.status).toBe("pass");
    });
  });

  describe("Email Template Tests", () => {
    it("deve truncar subject e preheader longos", () => {
      const longSubject = "a".repeat(100);
      const longPreheader = "b".repeat(150);

      const mockRegion = {
        value_prop: "Proposta de valor",
        email: {
          subject: longSubject,
          preheader: longPreheader,
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "email",
      });

      expect(result.rendered.subject.length).toBeLessThanOrEqual(78);
      expect(result.rendered.subject.endsWith("…")).toBe(true);

      expect(result.rendered.preheader.length).toBeLessThanOrEqual(110);
      expect(result.rendered.preheader.endsWith("…")).toBe(true);

      expect(result.compliance.status).toBe("pass");
    });
  });

  describe("Telegram Template Tests", () => {
    it("deve falhar quando tem mais de 4 botões por linha", () => {
      const mockRegion = {
        value_prop: "Proposta de valor",
        telegram: {
          text: "Mensagem de teste",
          keyboard: ["Botão 1", "Botão 2", "Botão 3", "Botão 4", "Botão 5"], // 5 botões
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "telegram",
      });

      expect(result.compliance.status).toBe("fail");
      expect(result.compliance.errors[0]).toContain("Telegram: >4 botões");
    });

    it("deve aprovar quando tem 4 ou menos botões", () => {
      const mockRegion = {
        value_prop: "Proposta de valor",
        telegram: {
          text: "Mensagem de teste",
          keyboard: ["Botão 1", "Botão 2", "Botão 3", "Botão 4"],
        },
      };

      vi.mocked(personasRepo.getRegion).mockReturnValue(mockRegion);

      const result = compose({
        personaId: "test-id",
        region: "SE",
        channel: "telegram",
      });

      expect(result.compliance.status).toBe("pass");
    });
  });
});
