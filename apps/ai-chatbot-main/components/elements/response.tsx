"use client";

import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import { ConsumptionValidationReport } from "@/components/agents/analysis/consumption-validation-report";
import { FinancingSimulationReport } from "@/components/agents/analysis/financing-simulation-report";
import { OriginationSummaryReport } from "@/components/agents/analysis/origination-summary-report";
import { PotentialJourneyReport } from "@/components/agents/analysis/potential-journey-report";
import { AnomalyReport } from "@/components/agents/detection/anomaly-report";
import { ComplianceStatusReport } from "@/components/agents/detection/compliance-status-report";
import { ConsumptionPatternsReport } from "@/components/agents/detection/consumption-patterns-report";
import { RiskScoreReport } from "@/components/agents/detection/risk-score-report";
import { cn } from "@/lib/utils";

const agentComponents: Record<string, React.ComponentType<any>> = {
  anomaly_report: AnomalyReport,
  risk_score: RiskScoreReport,
  consumption_patterns: ConsumptionPatternsReport,
  compliance_status: ComplianceStatusReport,
  consumption_validation: ConsumptionValidationReport,
  financing_simulation: FinancingSimulationReport,
  potential_journey: PotentialJourneyReport,
  origination_summary: OriginationSummaryReport,
  // Adicione outros componentes de agente aqui
  // site_assessment: SiteAssessmentReport,
  // preliminary_sizing: PreliminarySizingReport,
};

const tryParseJson = (jsonString: string) => {
  try {
    const json = JSON.parse(jsonString);
    return json;
  } catch (e) {
    return null;
  }
};

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, children, ...props }: ResponseProps) => {
    const content = typeof children === "string" ? children : "";
    const jsonData = tryParseJson(content);

    if (jsonData) {
      const agentKey = Object.keys(jsonData)[0];
      const AgentComponent = agentComponents[agentKey];
      if (AgentComponent) {
        return <AgentComponent data={jsonData} />;
      }
    }

    return (
      <Streamdown
        className={cn(
          "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:whitespace-pre-wrap [&_code]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto",
          className
        )}
        {...props}
      >
        {content}
      </Streamdown>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
