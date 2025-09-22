"use client";

import { FinancingSimulationReport } from "@/components/agents/analysis/financing-simulation-report";
import { AnomalyReport } from "@/components/agents/detection/anomaly-report";
import { ComplianceStatusReport } from "@/components/agents/detection/compliance-status-report";
import { ConsumptionPatternsReport } from "@/components/agents/detection/consumption-patterns-report";
import { RiskScoreReport } from "@/components/agents/detection/risk-score-report";
import { Card, CardContent } from "@/components/ui/card";

// Os tipos usados nos componentes individuais (antiga estrutura)
type ComponentAnomalyReportData = {
  anomaly_report: {
    system_id: string;
    anomalies_detected: Array<{
      type: string;
      month: string;
      deviation_percent: number;
      severity: "high" | "medium" | "low";
    }>;
    total_anomalies: number;
    risk_assessment: string;
  };
};

type ComponentRiskScoreData = {
  risk_score: {
    system_id: string;
    overall_score: number;
    breakdown: {
      consumption_anomalies: number;
      billing_irregularities: number;
      pattern_deviations: number;
      compliance_risks: number;
    };
    recommendations: string[];
  };
};

type ComponentConsumptionPatternsData = {
  consumption_patterns: {
    system_id: string;
    patterns_identified: Array<{
      pattern_type: string;
      description: string;
      confidence: number;
    }>;
    insights: string[];
  };
};

type ComponentComplianceStatusData = {
  compliance_status: {
    system_id: string;
    lei_14300_compliant: boolean;
    validation_date: string;
    requirements_met: string[];
    next_review_date: string;
  };
};

type ComponentFinancingSimulationData = {
  financing_simulation: {
    system_id: string;
    system_size_kw: number;
    total_investment: number;
    financing_options: Array<{
      option_name: string;
      interest_rate: number;
      term_months: number;
      monthly_payment: number;
      total_cost: number;
      irr: number;
    }>;
    recommended_option: string;
  };
};

// Tipos para os dados dos agentes que usamos nos mocks (nova estrutura)
export type AnomalyReportData = {
  system_id: string;
  anomalies_detected: Array<{
    type: string;
    month: string;
    deviation_percent: number;
    severity: "high" | "medium" | "low";
  }>;
  total_anomalies: number;
  risk_assessment: string;
};

export type RiskScoreData = {
  system_id: string;
  overall_score: number;
  breakdown: {
    consumption_anomalies: number;
    billing_irregularities: number;
    pattern_deviations: number;
    compliance_risks: number;
  };
  recommendations: string[];
};

export type ConsumptionPatternsData = {
  system_id: string;
  patterns_identified: Array<{
    pattern_type: string;
    description: string;
    confidence: number;
  }>;
  insights: string[];
};

export type ComplianceStatusData = {
  system_id: string;
  lei_14300_compliant: boolean;
  validation_date: string;
  requirements_met: string[];
  next_review_date: string;
};

export type FinancingSimulationData = {
  system_id: string;
  system_size_kw: number;
  total_investment: number;
  financing_options: Array<{
    option_name: string;
    interest_rate: number;
    term_months: number;
    monthly_payment: number;
    total_cost: number;
    irr: number;
  }>;
  recommended_option: string;
};

type AgentCardProps = {
  agentKey:
    | "anomaly_report"
    | "risk_score"
    | "consumption_patterns"
    | "compliance_status"
    | "financing_simulation";
  data:
    | AnomalyReportData
    | RiskScoreData
    | ConsumptionPatternsData
    | ComplianceStatusData
    | FinancingSimulationData;
};

export function AgentCard({ agentKey, data }: AgentCardProps) {
  // Função para adaptar os dados para o formato esperado pelos componentes
  const adaptData = () => {
    switch (agentKey) {
      case "anomaly_report":
        return { anomaly_report: data } as ComponentAnomalyReportData;
      case "risk_score":
        return { risk_score: data } as ComponentRiskScoreData;
      case "consumption_patterns":
        return {
          consumption_patterns: data,
        } as ComponentConsumptionPatternsData;
      case "compliance_status":
        return { compliance_status: data } as ComponentComplianceStatusData;
      case "financing_simulation":
        return {
          financing_simulation: data,
        } as ComponentFinancingSimulationData;
      default:
        return data;
    }
  };

  // Renderiza o componente adequado com base no agentKey
  switch (agentKey) {
    case "anomaly_report":
      return <AnomalyReport data={adaptData() as ComponentAnomalyReportData} />;
    case "risk_score":
      return <RiskScoreReport data={adaptData() as ComponentRiskScoreData} />;
    case "consumption_patterns":
      return (
        <ConsumptionPatternsReport
          data={adaptData() as ComponentConsumptionPatternsData}
        />
      );
    case "compliance_status":
      return (
        <ComplianceStatusReport
          data={adaptData() as ComponentComplianceStatusData}
        />
      );
    case "financing_simulation":
      return (
        <FinancingSimulationReport
          data={adaptData() as ComponentFinancingSimulationData}
        />
      );
    default:
      // Fallback para quando o componente não for encontrado
      return (
        <Card className="my-4 w-full">
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm">
              <p>Visualização não disponível para o tipo: {agentKey}</p>
              <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      );
  }
}
