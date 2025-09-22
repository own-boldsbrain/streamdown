import { emitComplianceFailed } from "../../lib/analytics/events";
import { compose } from "../../lib/services/template-composer";
import {
  type ComposeRequest,
  ComposeResponse,
} from "../../lib/types/messaging";

type WhatsAppSendParams = {
  to: string;
  templateName: string;
  header?: string;
  body?: string;
  footer?: string;
  ctaText?: string;
  ctaUrl?: string;
};

export async function sendWhatsAppTemplate(
  params: WhatsAppSendParams & ComposeRequest
) {
  const { to, templateName, personaId, region, channel, variables, marketing } =
    params;

  try {
    // Compor a mensagem e verificar compliance
    const composeResult = compose({
      personaId,
      region,
      channel: "whatsapp",
      variables,
      marketing,
    });

    // Se falhou na compliance, não enviar
    if (composeResult.compliance.status === "fail") {
      emitComplianceFailed(composeResult.compliance);
      console.error(
        "Falha na compliance do WhatsApp:",
        composeResult.compliance.errors
      );
      return { success: false, errors: composeResult.compliance.errors };
    }

    // Montar o payload para envio
    const payload = {
      to,
      templateName,
      header: composeResult.rendered.header,
      body: composeResult.rendered.body,
      footer: composeResult.rendered.footer,
      ctaText: params.ctaText || composeResult.raw.cta?.text,
      ctaUrl: params.ctaUrl || composeResult.raw.cta?.url_template,
    };

    // Aqui implementaria a chamada real para a API do WhatsApp
    console.log("Enviando mensagem WhatsApp:", payload);

    // Simulando envio bem-sucedido
    return { success: true, messageId: `msg_${Date.now()}` };
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
