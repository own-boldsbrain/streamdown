"use client";

import { FinancingSimulationReport } from "@/components/agents/analysis/financing-simulation-report";
import { AnomalyReport } from "@/components/agents/detection/anomaly-report";
import { ComplianceStatusReport } from "@/components/agents/detection/compliance-status-report";
import { ConsumptionPatternsReport } from "@/components/agents/detection/consumption-patterns-report";
import { RiskScoreReport } from "@/components/agents/detection/risk-score-report";
import { Card, CardContent } from "@/components/ui/card";

// Tipo para os dados de agente
type AgentData = Record<string, unknown>;

// Mapeamento de componentes de agentes
const agentComponents: Record<
  string,
  React.ComponentType<{ data: AgentData }>
> = {
  anomaly_report: AnomalyReport,
  risk_score: RiskScoreReport,
  consumption_patterns: ConsumptionPatternsReport,
  compliance_status: ComplianceStatusReport,
  financing_simulation: FinancingSimulationReport,
  // Adicione outros componentes conforme necessário
};

type AgentCardProps = {
  agentKey: string;
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

  // Renderiza o componente específico do agente com os dados
  return <AgentComponent data={data} />;
}
