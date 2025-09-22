import { openai } from "@ai-sdk/openai"; // ou outro provider compatível
import { streamObject } from "ai"; // AI SDK Core
import type { NextRequest } from "next/server";
import { z } from "zod";
import { AnomalyReportSchema } from "@/lib/schemas/ap2";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  // Exemplo: prompt + schema do relatório de anomalias
  const result = await streamObject({
    model: openai("gpt-4o-mini"), // ajuste seu provedor/modelo
    prompt: [
      "Você é o Detection Agent.",
      "Gere um anomaly_report consistente com o input:",
      JSON.stringify(input),
    ].join("\n"),
    schema: AnomalyReportSchema,
  });

  return result.toTextStreamResponse(); // envia o objeto como texto fragmentado
}
