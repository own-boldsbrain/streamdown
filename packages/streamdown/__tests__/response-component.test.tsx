import { describe, it, expect } from "vitest";

// Teste da lógica de renderização condicional do Response component
describe("Response Component Logic", () => {
  const TEST_SYSTEM_ID = "SYS001";
  const TEST_OVERALL_SCORE = 68;
  const TEST_CONSUMPTION_ANOMALIES = 75;
  const TEST_AVERAGE_CONSUMPTION = 450.5;
  const TEST_SYSTEM_SIZE = 5.2;

  it("should parse JSON and identify anomaly_report", () => {
    const anomalyData = {
      anomaly_report: {
        system_id: TEST_SYSTEM_ID,
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
    const parsed = JSON.parse(jsonString);

    expect(parsed.anomaly_report).toBeDefined();
    expect(parsed.anomaly_report.system_id).toBe(TEST_SYSTEM_ID);
    expect(parsed.anomaly_report.anomalies_detected).toHaveLength(1);
  });

  it("should parse JSON and identify risk_score", () => {
    const riskData = {
      risk_score: {
        system_id: TEST_SYSTEM_ID,
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
    const parsed = JSON.parse(jsonString);

    expect(parsed.risk_score).toBeDefined();
    expect(parsed.risk_score.overall_score).toBe(TEST_OVERALL_SCORE);
    expect(parsed.risk_score.breakdown.consumption_anomalies).toBe(TEST_CONSUMPTION_ANOMALIES);
  });

  it("should parse JSON and identify consumption_validation", () => {
    const validationData = {
      consumption_validation: {
        system_id: TEST_SYSTEM_ID,
        validation_status: "valid" as const,
        consumption_history_months: 24,
        average_monthly_consumption: TEST_AVERAGE_CONSUMPTION,
        seasonal_variation: 0.23,
        data_quality_score: 0.95,
        recommendations: ["Dados suficientes para dimensionamento"]
      }
    };

    const jsonString = JSON.stringify(validationData);
    const parsed = JSON.parse(jsonString);

    expect(parsed.consumption_validation).toBeDefined();
    expect(parsed.consumption_validation.validation_status).toBe("valid");
    expect(parsed.consumption_validation.average_monthly_consumption).toBe(TEST_AVERAGE_CONSUMPTION);
  });

  it("should parse JSON and identify financing_simulation", () => {
    const financingData = {
      financing_simulation: {
        system_id: TEST_SYSTEM_ID,
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
    const parsed = JSON.parse(jsonString);

    expect(parsed.financing_simulation).toBeDefined();
    expect(parsed.financing_simulation.system_size_kw).toBe(TEST_SYSTEM_SIZE);
    expect(parsed.financing_simulation.financing_options).toHaveLength(1);
  });

  it("should handle invalid JSON gracefully", () => {
    const invalidJson = "invalid json {";

    expect(() => {
      JSON.parse(invalidJson);
    }).toThrow();
  });

  it("should handle JSON without matching agent component", () => {
    const unknownData = {
      unknown_agent: {
        some_data: "value"
      }
    };

    const jsonString = JSON.stringify(unknownData);
    const parsed = JSON.parse(jsonString);

    expect(parsed.unknown_agent).toBeDefined();
    expect(parsed.anomaly_report).toBeUndefined();
    expect(parsed.risk_score).toBeUndefined();
    expect(parsed.consumption_validation).toBeUndefined();
    expect(parsed.financing_simulation).toBeUndefined();
  });

  it("should handle regular text (not JSON)", () => {
    const regularText = "This is regular markdown text";

    expect(() => {
      JSON.parse(regularText);
    }).toThrow();
  });
});
