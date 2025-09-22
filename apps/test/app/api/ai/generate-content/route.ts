import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { channel, variables } = await req.json();

    // Simulate AI-generated content based on the prompt
    let content = "Conteúdo gerado por IA para comunicação personalizada.";

    if (channel === "whatsapp") {
      content = `Olá! ${content} Descubra nossas ofertas especiais! 🚀`;
    } else if (channel === "sms") {
      content = `${content} Acesse: link.com`;
    } else if (channel === "email") {
      content = `Assunto: ${content}`;
    }

    // Use variables if provided
    if (variables && Object.keys(variables).length > 0) {
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, "g"), String(value));
      }
    }

    return NextResponse.json({
      content,
      channel,
      generatedAt: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
