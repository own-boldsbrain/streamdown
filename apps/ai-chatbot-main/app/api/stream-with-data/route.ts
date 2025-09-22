import { StreamingTextResponse } from "ai";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Constante para o tempo de espera na simulação
const SIMULATION_DELAY_MS = 500;

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  // Criamos um encoder para transformar texto em chunks
  const encoder = new TextEncoder();

  // Criamos um ReadableStream para enviar chunks de dados
  const stream = new ReadableStream({
    async start(controller) {
      // Metadata NATS (exemplo de como poderia ser enviado)
      const metadata = {
        subject: "ap2.pre.detection.anomaly.detected",
        event_id: `event-${Date.now()}`,
      };

      // Enviamos texto inicial
      controller.enqueue(
        encoder.encode("Iniciando detecção de anomalias...\n")
      );

      // Simulamos um processamento
      await new Promise((resolve) => setTimeout(resolve, SIMULATION_DELAY_MS));
      controller.enqueue(encoder.encode("Analisando dados históricos...\n"));

      // Simulamos resultados
      await new Promise((resolve) => setTimeout(resolve, SIMULATION_DELAY_MS));

      const result = {
        system_id: "system-123",
        anomalies_detected: [
          {
            type: "consumption_spike",
            month: "2025-09",
            deviation_percent: 45,
            description: "Aumento significativo no consumo",
            severity: "high",
          },
        ],
        total_anomalies: 1,
        risk_assessment: "medium",
      };

      // Reportamos resultados
      controller.enqueue(
        encoder.encode(
          `Análise concluída. Encontradas ${result.total_anomalies} anomalias.\n` +
            `Nível de risco: ${result.risk_assessment}\n\n` +
            "Detalhes das anomalias detectadas:\n"
        )
      );

      // Detalhes de cada anomalia
      for (const anomaly of result.anomalies_detected) {
        controller.enqueue(
          encoder.encode(
            `- ${anomaly.type} (${anomaly.severity}) em ${anomaly.month}\n`
          )
        );
      }

      // Finalizamos o stream
      controller.close();
    },
  });

  // Retornamos uma response com o stream
  return new StreamingTextResponse(stream);
}
