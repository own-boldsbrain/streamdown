import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Response } from "../../../apps/ai-chatbot-main/components/elements/response";

// Mock do Streamdown
vi.mock("streamdown", () => ({
  Streamdown: ({ children }: { children: string }) => (
    <div data-testid="streamdown">{children}</div>
  ),
}));

describe("Response Component", () => {
  it("renders Streamdown for regular text", () => {
    render(<Response>Regular markdown text</Response>);

    expect(screen.getByTestId("streamdown")).toBeInTheDocument();
    expect(screen.getByText("Regular markdown text")).toBeInTheDocument();
  });

  it("renders AnomalyReport for anomaly_report JSON", () => {
    const anomalyData = {
      anomaly_report: {
        system_id: "SYS001",
        anomalies_detected: [
          {
            type: "consumption_spike",
            month: "2024-07",
            deviation_percent: 45.2,
            severity: "high" as const,
          },
        ],
        total_anomalies: 1,
        risk_assessment: "moderate",
      },
    };

    render(<Response>{JSON.stringify(anomalyData)}</Response>);

    expect(
      screen.getByText("Relatório de Anomalias de Consumo")
    ).toBeInTheDocument();
    expect(screen.getByText("ID do Sistema: SYS001")).toBeInTheDocument();
  });

  it("renders RiskScoreReport for risk_score JSON", () => {
    const riskData = {
      risk_score: {
        system_id: "SYS001",
        overall_score: 68,
        breakdown: {
          consumption_anomalies: 75,
          billing_irregularities: 45,
          pattern_deviations: 82,
          compliance_risks: 55,
        },
        recommendations: ["Investigar picos de consumo"],
      },
    };

    render(<Response>{JSON.stringify(riskData)}</Response>);

    expect(
      screen.getByText("Avaliação de Risco do Sistema")
    ).toBeInTheDocument();
    expect(screen.getByText("68")).toBeInTheDocument();
  });

  it("renders ConsumptionValidationReport for consumption_validation JSON", () => {
    const validationData = {
      consumption_validation: {
        system_id: "SYS001",
        validation_status: "valid" as const,
        consumption_history_months: 24,
        average_monthly_consumption: 450.5,
        seasonal_variation: 0.23,
        data_quality_score: 0.95,
        recommendations: ["Dados suficientes para dimensionamento"],
      },
    };

    render(<Response>{JSON.stringify(validationData)}</Response>);

    expect(screen.getByText("Validação de Consumo")).toBeInTheDocument();
    expect(screen.getByText("450.5 kWh")).toBeInTheDocument();
  });

  it("renders FinancingSimulationReport for financing_simulation JSON", () => {
    const financingData = {
      financing_simulation: {
        system_id: "SYS001",
        system_size_kw: 5.2,
        total_investment: 25_000,
        financing_options: [
          {
            option_name: "Financiamento Bancário",
            interest_rate: 0.089,
            term_months: 60,
            monthly_payment: 520.45,
            total_cost: 31_227,
            irr: 0.12,
          },
        ],
        recommended_option: "Financiamento Bancário",
      },
    };

    render(<Response>{JSON.stringify(financingData)}</Response>);

    expect(screen.getByText("Simulação de Financiamento")).toBeInTheDocument();
    expect(screen.getByText("5.2 kWp")).toBeInTheDocument();
  });

  it("renders Streamdown for invalid JSON", () => {
    render(<Response>{"invalid json {"}</Response>);

    expect(screen.getByTestId("streamdown")).toBeInTheDocument();
    expect(screen.getByText("invalid json {")).toBeInTheDocument();
  });

  it("renders Streamdown for JSON without matching agent component", () => {
    const unknownData = {
      unknown_agent: {
        some_data: "value",
      },
    };

    render(<Response>{JSON.stringify(unknownData)}</Response>);

    expect(screen.getByTestId("streamdown")).toBeInTheDocument();
  });
});
