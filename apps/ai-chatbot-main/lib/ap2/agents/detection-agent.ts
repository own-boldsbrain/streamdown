/**
 * AP2 - Agente de Detecção
 * Responsável por detectar anomalias de consumo, calcular risk_score e validar compliance com a Lei 14.300
 */

import type { AgentConfig } from "../common";
import { getTimestamp, validateSchema } from "../utils";

// Schemas conforme definido no agents.md
const inputSchema = {
  type: "object",
  required: ["system_id", "consumption_history", "billing_data", "location", "validation_params"],
  properties: {
    system_id: { type: "string" },
    consumption_history: {
      type: "array",
      items: { 
        type: "object", 
        required: ["month", "kwh"], 
        properties: { 
          month: { type: "string" }, 
          kwh: { type: "number" } 
        } 
      }
    },
    billing_data: { type: "object", additionalProperties: true },
    location: { 
      type: "object", 
      properties: { 
        cep: { type: "string" }, 
        type: { type: "string" } 
      } 
    },
    validation_params: { 
      type: "object", 
      properties: { 
        anomaly_limits: { type: "object" } 
      } 
    }
  }
};

const outputSchema = {
  type: "object",
  required: ["status", "agent", "timestamp", "anomaly_report", "risk_score", "consumption_patterns", "compliance_status"],
  properties: {
    status: { type: "string", enum: ["ok", "error"] },
    agent: { type: "string", const: "detection" },
    timestamp: { type: "string" },
    reasoning_brief: { type: "string" },
    anomaly_report: {
      type: "object",
      required: ["system_id", "anomalies_detected", "total_anomalies", "risk_assessment"],
      properties: {
        system_id: { type: "string" },
        anomalies_detected: {
          type: "array",
          items: {
            type: "object",
            required: ["type", "month", "severity"],
            properties: {
              type: { type: "string", enum: ["consumption_spike", "unusual_pattern", "billing_irregularity", "outlier"] },
              month: { type: "string" },
              deviation_percent: { type: "number" },
              description: { type: "string" },
              severity: { type: "string", enum: ["low", "medium", "high"] }
            }
          }
        },
        total_anomalies: { type: "integer" },
        risk_assessment: { type: "string", enum: ["low", "moderate", "high"] }
      }
    },
    risk_score: {
      type: "object",
      required: ["system_id", "overall_score", "breakdown"],
      properties: {
        system_id: { type: "string" },
        overall_score: { type: "number", minimum: 0, maximum: 100 },
        breakdown: { type: "object", additionalProperties: { type: "number" } },
        recommendations: { type: "array", items: { type: "string" } }
      }
    },
    consumption_patterns: {
      type: "object",
      properties: {
        patterns_identified: { 
          type: "array", 
          items: { 
            type: "object", 
            properties: { 
              pattern_type: { type: "string" }, 
              description: { type: "string" }, 
              confidence: { type: "number" } 
            } 
          } 
        },
        insights: { type: "array", items: { type: "string" } }
      }
    },
    compliance_status: {
      type: "object",
      properties: {
        lei_14300_compliant: { type: "boolean" },
        validation_date: { type: "string" },
        requirements_met: { type: "array", items: { type: "string" } },
        next_review_date: { type: "string" }
      }
    },
    ui_hints: {
      type: "object",
      properties: {
        artifacts: { type: "array", items: { type: "string" } }
      }
    }
  }
};

// Implementação das ferramentas do agente
const detectAnomaly = async (input: any) => {
  const { system_id, consumption_history, validation_params } = input;
  
  // Simulação de detecção de anomalias
  // Em um sistema real, teríamos algoritmos avançados de detecção
  const anomalies = consumption_history
    .filter((_, index) => index > 0)
    .map((current, index) => {
      const previous = consumption_history[index];
      const change = ((current.kwh - previous.kwh) / previous.kwh) * 100;
      
      if (Math.abs(change) > (validation_params?.anomaly_limits?.spike_pct || 30)) {
        return {
          type: change > 0 ? "consumption_spike" : "unusual_pattern",
          month: current.month,
          deviation_percent: Math.round(change * 10) / 10,
          description: `${change > 0 ? "Aumento" : "Diminuição"} significativo de ${Math.abs(Math.round(change))}% no consumo`,
          severity: Math.abs(change) > 50 ? "high" : Math.abs(change) > 40 ? "medium" : "low"
        };
      }
      return null;
    })
    .filter(Boolean);
  
  const total_anomalies = anomalies.length;
  const risk_level = total_anomalies > 2 ? "high" : total_anomalies > 0 ? "moderate" : "low";
  
  return {
    anomaly_report: {
      system_id,
      anomalies_detected: anomalies,
      total_anomalies,
      risk_assessment: risk_level
    }
  };
};

const calculateRiskScore = async (input: any) => {
  const { system_id, consumption_history, billing_data, location } = input;
  
  // Cálculo simulado de pontuação de risco
  // Em um sistema real, usaríamos modelos estatísticos/ML
  
  // Avaliando variabilidade de consumo
  let consumption_variability = 0;
  if (consumption_history.length > 1) {
    const values = consumption_history.map(item => item.kwh);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    consumption_variability = Math.sqrt(variance) / avg * 100;
  }
  
  // Construindo pontuação
  const breakdown = {
    consumption_variability: Math.min(consumption_variability * 2, 40),
    billing_consistency: location.type === "residential" ? 10 : 25,
    historical_patterns: consumption_history.length < 6 ? 20 : 5,
    location_risk: location.type === "residential" ? 5 : 15
  };
  
  const overall_score = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
  
  // Recomendações com base na pontuação
  const recommendations = [];
  if (breakdown.consumption_variability > 20) {
    recommendations.push("Investigar padrões irregulares de consumo");
  }
  if (breakdown.historical_patterns > 10) {
    recommendations.push("Coletar mais dados históricos para análise precisa");
  }
  
  return {
    risk_score: {
      system_id,
      overall_score,
      breakdown,
      recommendations
    }
  };
};

const recognizePatterns = async (input: any) => {
  const { consumption_history } = input;
  
  // Simulação de reconhecimento de padrões
  // Em um sistema real, usaríamos algoritmos de clustering/pattern recognition
  
  const patterns = [];
  const months = consumption_history.length;
  
  // Padrão sazonal
  if (months >= 12) {
    const summerMonths = ["12", "01", "02"];
    const winterMonths = ["06", "07", "08"];
    
    const summerConsumption = consumption_history
      .filter(item => summerMonths.includes(item.month.split("-")[1]))
      .reduce((sum, item) => sum + item.kwh, 0);
      
    const winterConsumption = consumption_history
      .filter(item => winterMonths.includes(item.month.split("-")[1]))
      .reduce((sum, item) => sum + item.kwh, 0);
    
    if (Math.abs(summerConsumption - winterConsumption) > 100) {
      patterns.push({
        pattern_type: "seasonal",
        description: `Variação sazonal de consumo detectada entre verão e inverno`,
        confidence: 0.75
      });
    }
  }
  
  // Padrão de crescimento/declínio
  if (months >= 6) {
    const first3 = consumption_history.slice(0, 3).reduce((sum, item) => sum + item.kwh, 0);
    const last3 = consumption_history.slice(-3).reduce((sum, item) => sum + item.kwh, 0);
    const change = ((last3 - first3) / first3) * 100;
    
    if (Math.abs(change) > 15) {
      patterns.push({
        pattern_type: change > 0 ? "growing_consumption" : "reducing_consumption",
        description: `Tendência de ${change > 0 ? "aumento" : "redução"} de consumo (${Math.abs(Math.round(change))}%)`,
        confidence: 0.8
      });
    }
  }
  
  // Insights baseados nos padrões
  const insights = patterns.map(pattern => {
    if (pattern.pattern_type === "seasonal") {
      return "Considere ajustar o dimensionamento considerando a variação sazonal";
    }
    if (pattern.pattern_type === "growing_consumption") {
      return "Aumento consistente de consumo pode indicar necessidade de revisão de dimensionamento";
    }
    if (pattern.pattern_type === "reducing_consumption") {
      return "Redução de consumo pode significar economia ou mudança de hábitos";
    }
    return "";
  }).filter(Boolean);
  
  return {
    consumption_patterns: {
      patterns_identified: patterns,
      insights
    }
  };
};

const validateCompliance = async (input: any) => {
  const { system_id, location, billing_data, consumption_history } = input;
  
  // Simulação de validação de compliance com Lei 14.300
  // Em um sistema real, teríamos regras específicas da lei
  
  // Requisitos hipotéticos (exemplo)
  const requirements_met = [];
  let lei_14300_compliant = false;
  
  // Verificação hipotética de classe de consumo
  if (billing_data.class && ["B1", "B2", "B3"].includes(billing_data.class)) {
    requirements_met.push("Classe de consumo elegível");
  }
  
  // Verificação hipotética de consumo médio
  const avg_consumption = consumption_history.reduce((sum, item) => sum + item.kwh, 0) / consumption_history.length;
  if (avg_consumption <= 1000) {
    requirements_met.push("Consumo médio dentro do limite de microgeração");
  }
  
  // Verificação hipotética de localização
  if (location.cep) {
    requirements_met.push("Localização validada");
  }
  
  // Determinar compliance baseado nos requisitos atendidos
  lei_14300_compliant = requirements_met.length >= 3;
  
  return {
    compliance_status: {
      lei_14300_compliant,
      validation_date: getTimestamp(),
      requirements_met,
      next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
};

// Configuração do agente
export const detectionAgent: AgentConfig = {
  slug: "detection",
  description: "Detecção de anomalias de consumo, cálculo de risk_score e validação de compliance (Lei 14.300)",
  inputSchema,
  outputSchema,
  validateInput: (input) => validateSchema(input, inputSchema),
  validateOutput: (output) => validateSchema(output, outputSchema),
  tools: [
    { name: "detection.anomaly", handler: detectAnomaly },
    { name: "detection.risk_score", handler: calculateRiskScore },
    { name: "detection.pattern_recognition", handler: recognizePatterns },
    { name: "detection.compliance_validation", handler: validateCompliance }
  ],
  natsSubjects: [
    "ap2.pre.detection.anomaly.detected.v1",
    "ap2.pre.detection.risk.calculated.v1",
    "ap2.pre.detection.pattern.identified.v1",
    "ap2.pre.detection.compliance.validated.v1"
  ],
  uiDefaults: {
    artifacts: ["AnomalyReport", "RiskGauge"]
  }
};