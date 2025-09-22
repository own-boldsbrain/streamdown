"use client";

import { FinancingSimulationReport } from "@/components/agents/analysis/financing-simulation-report";
import { AnomalyReport } from "@/components/agents/detection/anomaly-report";
import { ComplianceStatusReport } from "@/components/agents/detection/compliance-status-report";
import { ConsumptionPatternsReport } from "@/components/agents/detection/consumption-patterns-report";
import { RiskScoreReport } from "@/components/agents/detection/risk-score-report";
import { Card, CardContent } from "@/components/ui/card";

// Tipos para cada tipo de dados dos agentes
type AnomalyReportData = {
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

type RiskScoreData = {
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

type ConsumptionPatternsData = {
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

type ComplianceStatusData = {
  compliance_status: {
    system_id: string;
    lei_14300_compliant: boolean;
    validation_date: string;
    requirements_met: string[];
    next_review_date: string;
  };
};

type FinancingSimulationData = {
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

// União de todos os tipos possíveis de dados
type AgentData =
  | AnomalyReportData
  | RiskScoreData
  | ConsumptionPatternsData
  | ComplianceStatusData
  | FinancingSimulationData;

// Tipo para os componentes com tipagem específica
type AgentComponentProps = {
  anomaly_report: React.ComponentType<{ data: AnomalyReportData }>;
  risk_score: React.ComponentType<{ data: RiskScoreData }>;
  consumption_patterns: React.ComponentType<{ data: ConsumptionPatternsData }>;
  compliance_status: React.ComponentType<{ data: ComplianceStatusData }>;
  financing_simulation: React.ComponentType<{ data: FinancingSimulationData }>;
};

// Mapeamento de componentes de agentes
const agentComponents: AgentComponentProps = {
  anomaly_report: AnomalyReport,
  risk_score: RiskScoreReport,
  consumption_patterns: ConsumptionPatternsReport,
  compliance_status: ComplianceStatusReport,
  financing_simulation: FinancingSimulationReport,
};

type AgentCardProps = {
  agentKey: keyof AgentComponentProps;
  data: AgentData;
};

export function AgentCard({ agentKey, data }: AgentCardProps) {
  // Obtém o componente específico do agente ou usa um componente de fallback
  const AgentComponent = agentComponents[agentKey];

  if (!AgentComponent) {
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

  if (agentKey === "anomaly_report" && "anomaly_report" in data) {
    // Renderiza o componente específico do agente com os dados tipados corretamente
    return <AnomalyReport data={data as AnomalyReportData} />;
  }

  if (agentKey === "risk_score" && "risk_score" in data) {
    return <RiskScoreReport data={data as RiskScoreData} />;
  }

  if (agentKey === "consumption_patterns" && "consumption_patterns" in data) {
    return <ConsumptionPatternsReport data={data as ConsumptionPatternsData} />;
  }

  if (agentKey === "compliance_status" && "compliance_status" in data) {
    return <ComplianceStatusReport data={data as ComplianceStatusData} />;
  }

  if (agentKey === "financing_simulation" && "financing_simulation" in data) {
    return <FinancingSimulationReport data={data as FinancingSimulationData} />;
  }

  // Fallback adicional se a propriedade esperada não estiver presente nos dados
  return (
    <Card className="my-4 w-full">
      <CardContent className="p-4">
        <div className="text-muted-foreground text-sm">
          <p>Dados incompatíveis para o tipo: {agentKey}</p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
