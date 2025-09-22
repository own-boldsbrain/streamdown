import { describe, expect, it } from "vitest";

// Teste da lógica de renderização condicional do Response component
// Este teste verifica se a lógica de parsing JSON funciona corretamente
// sem tentar renderizar componentes React

describe("Response Component Logic Integration", () => {
  // Constantes para números mágicos
  const TEST_OVERALL_SCORE = 68;
  const TEST_CONSUMPTION_ANOMALIES = 75;
  const TEST_AVERAGE_CONSUMPTION = 450.5;
  const TEST_SYSTEM_SIZE = 5.2;
  const TEST_PEAK_VALUE = 1200;

  // Função que simula a lógica do tryParseJson do Response component
  const tryParseJson = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  // Função que simula a lógica de mapeamento de componentes
  const getComponentType = (parsed: any) => {
    if (parsed?.anomaly_report) {
      return "AnomalyReport";
    }
    if (parsed?.risk_score) {
      return "RiskScoreReport";
    }
    if (parsed?.consumption_validation) {
      return "ConsumptionValidationReport";
    }
    if (parsed?.financing_simulation) {
      return "FinancingSimulationReport";
    }
    return "Streamdown";
  };

  it("should correctly identify anomaly_report JSON and parse data", () => {
    const anomalyData = {
      anomaly_report: {
        system_id: "SYS001",
        anomalies_detected: [
          {
            type: "consumption_spike",
            month: "2024-07",
            deviation_percent: 45.2,
            severity: "high" as const
          }
        ],
        total_anomalies: 1,
        risk_assessment: "moderate"
      }
    };

    const jsonString = JSON.stringify(anomalyData);
    const parsed = tryParseJson(jsonString);
    const componentType = getComponentType(parsed);

    expect(parsed).not.toBeNull();
    expect(componentType).toBe("AnomalyReport");
    expect(parsed.anomaly_report.system_id).toBe("SYS001");
    expect(parsed.anomaly_report.anomalies_detected).toHaveLength(1);
  });

  it("should correctly identify risk_score JSON and parse data", () => {
    const riskData = {
      risk_score: {
        system_id: "SYS001",
        overall_score: TEST_OVERALL_SCORE,
        breakdown: {
          consumption_anomalies: TEST_CONSUMPTION_ANOMALIES,
          billing_irregularities: 45,
          pattern_deviations: 82,
          compliance_risks: 55
        },
        recommendations: ["Investigar picos de consumo"]
      }
    };

    const jsonString = JSON.stringify(riskData);
    const parsed = tryParseJson(jsonString);
    const componentType = getComponentType(parsed);

    expect(parsed).not.toBeNull();
    expect(componentType).toBe("RiskScoreReport");
    expect(parsed.risk_score.overall_score).toBe(TEST_OVERALL_SCORE);
    expect(parsed.risk_score.breakdown.consumption_anomalies).toBe(TEST_CONSUMPTION_ANOMALIES);
  });

  it("should correctly identify consumption_validation JSON and parse data", () => {
    const validationData = {
      consumption_validation: {
        system_id: "SYS001",
        validation_status: "valid" as const,
        consumption_history_months: 24,
        average_monthly_consumption: TEST_AVERAGE_CONSUMPTION,
        seasonal_variation: 0.23,
        data_quality_score: 0.95,
        recommendations: ["Dados suficientes para dimensionamento"]
      }
    };

    const jsonString = JSON.stringify(validationData);
    const parsed = tryParseJson(jsonString);
    const componentType = getComponentType(parsed);

    expect(parsed).not.toBeNull();
    expect(componentType).toBe("ConsumptionValidationReport");
    expect(parsed.consumption_validation.validation_status).toBe("valid");
    expect(parsed.consumption_validation.average_monthly_consumption).toBe(TEST_AVERAGE_CONSUMPTION);
  });

  it("should correctly identify financing_simulation JSON and parse data", () => {
    const financingData = {
      financing_simulation: {
        system_id: "SYS001",
        system_size_kw: TEST_SYSTEM_SIZE,
        total_investment: 25_000,
        financing_options: [
          {
            option_name: "Financiamento Bancário",
            interest_rate: 0.089,
            term_months: 60,
            monthly_payment: 520.45,
            total_cost: 31_227,
            irr: 0.12
          }
        ],
        recommended_option: "Financiamento Bancário"
      }
    };

    const jsonString = JSON.stringify(financingData);
    const parsed = tryParseJson(jsonString);
    const componentType = getComponentType(parsed);

    expect(parsed).not.toBeNull();
    expect(componentType).toBe("FinancingSimulationReport");
    expect(parsed.financing_simulation.system_size_kw).toBe(TEST_SYSTEM_SIZE);
    expect(parsed.financing_simulation.financing_options).toHaveLength(1);
  });

  it("should fallback to Streamdown for regular text", () => {
    const regularText = "This is regular markdown text";

    const parsed = tryParseJson(regularText);
    const componentType = getComponentType(parsed);

    expect(parsed).toBeNull();
    expect(componentType).toBe("Streamdown");
  });

  it("should fallback to Streamdown for invalid JSON", () => {
    const invalidJson = "invalid json {";

    const parsed = tryParseJson(invalidJson);
    const componentType = getComponentType(parsed);

    expect(parsed).toBeNull();
    expect(componentType).toBe("Streamdown");
  });

  it("should fallback to Streamdown for JSON without matching agent component", () => {
    const unknownData = {
      unknown_agent: {
        some_data: "value"
      }
    };

    const jsonString = JSON.stringify(unknownData);
    const parsed = tryParseJson(jsonString);
    const componentType = getComponentType(parsed);

    expect(parsed).not.toBeNull();
    expect(componentType).toBe("Streamdown");
    expect(parsed.unknown_agent).toBeDefined();
  });

  it("should handle complex nested JSON structures", () => {
    const complexData = {
      anomaly_report: {
        system_id: "SYS001",
        anomalies_detected: [
          {
            type: "consumption_spike",
            month: "2024-07",
            deviation_percent: 45.2,
            severity: "high",
            details: {
              peak_value: TEST_PEAK_VALUE,
              baseline: 800,
              confidence: 0.95
            }
          }
        ],
        metadata: {
          analysis_date: "2024-08-01",
          algorithm_version: "2.1.0"
        }
      }
    };

    const jsonString = JSON.stringify(complexData);
    const parsed = tryParseJson(jsonString);
    const componentType = getComponentType(parsed);

    expect(parsed).not.toBeNull();
    expect(componentType).toBe("AnomalyReport");
    expect(parsed.anomaly_report.anomalies_detected[0].details.peak_value).toBe(TEST_PEAK_VALUE);
    expect(parsed.anomaly_report.metadata.algorithm_version).toBe("2.1.0");
  });
});
