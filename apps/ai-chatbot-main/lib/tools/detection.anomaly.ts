import { z } from "zod";
import { AnomalyReportSchema } from "@/lib/schemas/ap2";

// Constante para porcentagem padrão de pico
const DEFAULT_SPIKE_PERCENTAGE = 30;

// Interface para entrada da ferramenta
export interface DetectionAnomalyInput {
  system_id: string;
  history: Array<{ month: string; kwh: number }>;
  thresholds?: { spikePct: number };
}

// Interface para saída da ferramenta
export interface DetectionAnomalyOutput {
  system_id: string;
  anomalies_detected: Array<{
    type: string;
    month: string;
    deviation_percent?: number;
    description?: string;
    severity: "low" | "medium" | "high";
  }>;
  total_anomalies: number;
  risk_assessment: string;
}

// Implementação da ferramenta como função assíncrona
export async function detectionAnomalyTool(
  input: DetectionAnomalyInput
): Promise<DetectionAnomalyOutput> {
  const { system_id, history } = input;
  const thresholds = input.thresholds || { spikePct: DEFAULT_SPIKE_PERCENTAGE };
  
  // Simulando processamento assíncrono
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Lógica de detecção de anomalias simplificada para demonstração
  const anomalies = [];
  
  // Verificamos se temos pelo menos 2 entradas para comparação
  if (history && history.length >= 2) {
    for (let i = 1; i < history.length; i++) {
      const prev = history[i-1];
      const current = history[i];
      
      // Calculamos a variação percentual
      const change = ((current.kwh - prev.kwh) / prev.kwh) * 100;
      
      // Se ultrapassar o limiar de pico, registramos como anomalia
      if (change > thresholds.spikePct) {
        anomalies.push({
          type: "consumption_spike",
          month: current.month,
          deviation_percent: change,
          description: `Aumento de ${change.toFixed(1)}% no consumo em relação ao mês anterior`,
          severity: change > 50 ? "high" : change > 30 ? "medium" : "low"
        });
      }
    }
  }
  
  // Determinamos o nível de risco com base nas anomalias
  let risk_assessment = "low";
  if (anomalies.some(a => a.severity === "high")) {
    risk_assessment = "high";
  } else if (anomalies.some(a => a.severity === "medium")) {
    risk_assessment = "medium";
  }
  
  // Retornamos o resultado conforme schema
  return {
    system_id,
    anomalies_detected: anomalies,
    total_anomalies: anomalies.length,
    risk_assessment
  };
}