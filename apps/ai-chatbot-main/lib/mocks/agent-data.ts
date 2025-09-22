/**
 * Dados mock para testes visuais dos componentes de agentes
 *
 * Este arquivo contém dados simulados para cada tipo de relatório de agente
 * que pode ser usado para testar a renderização visual dos componentes no navegador.
 */

// Dados para o relatório de anomalias
export const mockAnomalyReportData = {
  system_id: "SYS-1234-ABCD",
  anomalies_detected: [
    {
      type: "consumo_elevado",
      month: "Agosto/2025",
      deviation_percent: 45,
      severity: "high" as const,
    },
    {
      type: "pico_de_demanda",
      month: "Julho/2025",
      deviation_percent: 27,
      severity: "medium" as const,
    },
    {
      type: "consumo_fora_de_horario",
      month: "Setembro/2025",
      deviation_percent: 18,
      severity: "low" as const,
    },
  ],
  total_anomalies: 3,
  risk_assessment: "moderado",
};

// Dados para o relatório de pontuação de risco
export const mockRiskScoreData = {
  system_id: "SYS-1234-ABCD",
  overall_score: 72,
  breakdown: {
    consumption_anomalies: 65,
    billing_irregularities: 85,
    pattern_deviations: 55,
    compliance_risks: 70,
  },
  recommendations: [
    "Ajustar o dimensionamento do sistema para reduzir picos de consumo",
    "Verificar possíveis irregularidades na fatura de energia elétrica",
    "Implementar sistema de monitoramento em tempo real para melhor controle",
    "Revisar a conformidade com a legislação atual de geração distribuída",
  ],
};

// Dados para o relatório de padrões de consumo
export const mockConsumptionPatternsData = {
  system_id: "SYS-1234-ABCD",
  patterns_identified: [
    {
      pattern_type: "seasonal_variation",
      description:
        "Aumento de consumo nos meses de verão, principalmente entre dezembro e fevereiro",
      confidence: 0.92,
    },
    {
      pattern_type: "weekday_pattern",
      description:
        "Consumo 35% maior em dias úteis comparado aos finais de semana",
      confidence: 0.87,
    },
    {
      pattern_type: "hourly_pattern",
      description:
        "Picos de consumo entre 14h e 16h, possivelmente devido ao uso de ar condicionado",
      confidence: 0.75,
    },
    {
      pattern_type: "equipment_signature",
      description:
        "Detecção de assinatura consistente com sistema de refrigeração comercial",
      confidence: 0.63,
    },
  ],
  insights: [
    "Recomenda-se ajustar a operação de equipamentos de alto consumo para fora do horário de ponta",
    "Possibilidade de economia com desligamento programado nos finais de semana",
    "Avaliar viabilidade de tarifa branca para aproveitar menores custos fora do horário de ponta",
    "Sistema fotovoltaico atual está alinhado com o perfil de consumo diurno do estabelecimento",
  ],
};

// Dados para o relatório de status de conformidade
export const mockComplianceStatusData = {
  system_id: "SYS-1234-ABCD",
  lei_14300_compliant: true,
  validation_date: "2025-08-15T10:30:00Z",
  requirements_met: [
    "Sistema registrado na distribuidora conforme normativa",
    "Potência instalada dentro dos limites permitidos para microgeração",
    "Equipamentos homologados pelo INMETRO",
    "Projeto elétrico e memorial descritivo conformes com a norma técnica",
    "Instalação realizada por empresa credenciada",
    "Sistema de compensação de energia corretamente configurado",
  ],
  next_review_date: "2026-08-15T10:30:00Z",
};

// Dados para o relatório de simulação de financiamento
export const mockFinancingSimulationData = {
  system_id: "SYS-1234-ABCD",
  system_size_kw: 10.5,
  total_investment: 52_500,
  financing_options: [
    {
      option_name: "Financiamento Banco Solar",
      interest_rate: 0.0099, // 0.99% ao mês
      term_months: 60,
      monthly_payment: 1125.62,
      total_cost: 67_537.2,
      irr: 0.187, // 18.7%
    },
    {
      option_name: "Cooperativa de Crédito Verde",
      interest_rate: 0.0089, // 0.89% ao mês
      term_months: 48,
      monthly_payment: 1305.75,
      total_cost: 62_676.0,
      irr: 0.215, // 21.5%
    },
    {
      option_name: "Financiamento Próprio",
      interest_rate: 0, // 0% (pagamento à vista)
      term_months: 1,
      monthly_payment: 52_500,
      total_cost: 52_500,
      irr: 0.232, // 23.2%
    },
  ],
  recommended_option: "Cooperativa de Crédito Verde",
};

// Coleção de todos os dados mock para fácil acesso
export const mockAgentData = {
  anomaly_report: mockAnomalyReportData,
  risk_score: mockRiskScoreData,
  consumption_patterns: mockConsumptionPatternsData,
  compliance_status: mockComplianceStatusData,
  financing_simulation: mockFinancingSimulationData,
};

// Dados de exemplo para testar Streamdown
export const mockMarkdownContent = {
  simple:
    "# Título de Exemplo\n\nEste é um texto simples para testar a renderização Markdown básica.\n\n## Subtítulo\n\nAlgum texto com **negrito** e *itálico*.",

  complex: `# Relatório de Análise Energética

## Resumo Executivo

Este relatório apresenta uma análise detalhada do consumo de energia do cliente **Empresa Exemplo S.A.** com base nos dados coletados entre Janeiro e Setembro de 2025.

### Principais Conclusões

1. Redução potencial de custos: **R$ 15.750,00/ano**
2. Economia energética projetada: **23%**
3. Retorno do investimento (ROI): **2,7 anos**

## Análise de Consumo

| Mês | Consumo (kWh) | Custo (R$) | Média Diária (kWh) |
|-----|---------------|------------|-------------------|
| Jan | 4.350 | 3.267,50 | 140,3 |
| Fev | 4.120 | 3.090,00 | 147,1 |
| Mar | 3.980 | 2.985,00 | 128,4 |
| Abr | 3.850 | 2.887,50 | 128,3 |
| Mai | 3.750 | 2.812,50 | 121,0 |
| Jun | 3.890 | 2.917,50 | 129,7 |
| Jul | 4.050 | 3.037,50 | 130,6 |
| Ago | 4.230 | 3.172,50 | 136,5 |
| Set | 4.390 | 3.292,50 | 146,3 |

## Gráfico de Tendência

\`\`\`mermaid
graph LR
    A[Jan] --> B[Fev]
    B --> C[Mar]
    C --> D[Abr]
    D --> E[Mai]
    E --> F[Jun]
    F --> G[Jul]
    G --> H[Ago]
    H --> I[Set]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style I fill:#bbf,stroke:#333,stroke-width:2px
\`\`\`

## Código de Exemplo (Simulação de Economia)

\`\`\`typescript
function calcularEconomiaEstimada(consumoAtual: number, percentualReducao: number) {
  const economiaKwh = consumoAtual * (percentualReducao / 100);
  const custoMedioKwh = 0.75; // R$ por kWh
  
  return {
    economiaKwh,
    economiaMensal: economiaKwh * custoMedioKwh,
    economiaAnual: economiaKwh * custoMedioKwh * 12
  };
}

// Exemplo de uso
const consumoMedioMensal = 4067.78; // kWh
const reducaoEstimada = 23; // percentual

const economia = calcularEconomiaEstimada(consumoMedioMensal, reducaoEstimada);
console.log(\`Economia anual estimada: R$ \${economia.economiaAnual.toFixed(2)}\`);
\`\`\`

## Equação de Retorno do Investimento

O ROI foi calculado usando a seguinte fórmula:

$$
ROI = \frac{InvestimentoInicial}{EconomiaAnual}
$$

Para o projeto atual, temos:

$$
ROI = \frac{42.525,00}{15.750,00} = 2,7 \text{ anos}
$$

## Próximos Passos

- [ ] Apresentação da proposta técnica
- [ ] Visita técnica para avaliação detalhada
- [ ] Elaboração do projeto executivo
- [ ] Aprovação junto à distribuidora
- [ ] Execução da instalação

Para mais informações, entre em contato pelo email: contato@exemplo.com.br
`,

  streaming:
    "# Título em Streaming\n\nEste é um texto que simula streaming de conteúdo, onde os tokens vão chegando gradualmente.\n\nPoderia ter um código incompleto como:\n\n```typescript\nfunction calculateSomething() {\n  const value = 42;\n  return value *",
};

// Exemplos de mensagens de chat para testar o componente ChatMessageContent
export const mockChatMessages = [
  {
    id: "user-1",
    role: "user",
    text: "Olá, gostaria de ver um relatório de anomalias de consumo para o sistema SYS-1234-ABCD.",
  },
  {
    id: "assistant-1",
    role: "assistant",
    text: JSON.stringify(mockAnomalyReportData, null, 2),
  },
  {
    id: "user-2",
    role: "user",
    text: "Mostre-me a pontuação de risco desse sistema.",
  },
  {
    id: "assistant-2",
    role: "assistant",
    text: JSON.stringify(mockRiskScoreData, null, 2),
  },
  {
    id: "user-3",
    role: "user",
    text: "Quais são os padrões de consumo identificados?",
  },
  {
    id: "assistant-3",
    role: "assistant",
    text: JSON.stringify(mockConsumptionPatternsData, null, 2),
  },
  {
    id: "user-4",
    role: "user",
    text: "O sistema está em conformidade com a Lei 14.300?",
  },
  {
    id: "assistant-4",
    role: "assistant",
    text: JSON.stringify(mockComplianceStatusData, null, 2),
  },
  {
    id: "user-5",
    role: "user",
    text: "Quais são as opções de financiamento disponíveis?",
  },
  {
    id: "assistant-5",
    role: "assistant",
    text: JSON.stringify(mockFinancingSimulationData, null, 2),
  },
  {
    id: "user-6",
    role: "user",
    text: "Pode me mostrar um exemplo de relatório em markdown?",
  },
  {
    id: "assistant-6",
    role: "assistant",
    text: mockMarkdownContent.complex,
  },
];
