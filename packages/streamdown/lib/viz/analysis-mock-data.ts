export const potentialJourneyMocks = {
  default: {
    potential_journey: {
      customer_id: "CUST-001",
      journey_id: "JRN-001",
      current_stage: "Dimensionamento do Sistema",
      stages: [
        {
          name: "Análise de Consumo",
          status: "completed",
          description: "Análise do histórico de consumo do cliente.",
        },
        {
          name: "Dimensionamento do Sistema",
          status: "in_progress",
          description: "Cálculo do tamanho ideal do sistema fotovoltaico.",
        },
        {
          name: "Simulação Financeira",
          status: "pending",
          description: "Simulação de custos e retorno do investimento.",
        },
        {
          name: "Envio da Proposta",
          status: "pending",
          description: "Geração e envio da proposta comercial.",
        },
        {
          name: "Assinatura do Contrato",
          status: "pending",
          description: "Assinatura do contrato e início da instalação.",
        },
      ],
    },
  },
};

export const originationSummaryMocks = {
  default: {
    origination_summary: {
      customer_id: "CUST-001",
      system_id: "SYS-001",
      status: "approved",
      average_consumption_kwh: 500,
      proposed_system_kwp: 5.5,
      estimated_savings_percent: 95,
      estimated_payback_years: 4.5,
    },
  },
};
