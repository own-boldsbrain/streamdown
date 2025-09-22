/**
 * @file Este arquivo contém dados mockados para os componentes de artefatos de IA.
 * Em um ambiente de produção, esses dados viriam de uma API.
 * Eles são usados para desenvolvimento, testes e demonstração dos componentes de UI.
 */

import { subDays } from "date-fns";
import type {
  AnomalyData,
  ArtifactAnomalyReportProps,
} from "@/components/artifact-anomaly-report";
import type {
  ArtifactComplianceBadgeProps,
  ComplianceCertificate,
} from "@/components/artifact-compliance-badge";
import type {
  ArtifactRiskGaugeProps,
  RiskAssessment,
} from "@/components/artifact-risk-gauge";
import type {
  ArtifactToolInspectorProps,
  ToolCall,
} from "@/components/artifact-tool-inspector";

// --- Constantes para Magic Numbers ---
const DAYS_AGO_90 = 90;
const DAYS_AGO_60 = 60;
const DAYS_AGO_30 = 30;
const DAYS_AGO_180 = 180;
const DAYS_AHEAD_185 = -185;
const DAYS_AGO_1 = 1;
const DAYS_AGO_2 = 2;
const DAYS_AGO_3 = 3;
const FRACTIONAL_DAY_0_01 = 0.01;
const FRACTIONAL_DAY_0_02 = 0.02;

// Mock para ArtifactRiskGauge
const mockAssessments: RiskAssessment[] = [
  {
    id: "assessment-1",
    title: "Análise de Risco Trimestral",
    overallRisk: 75,
    riskLevel: "high",
    factors: [
      {
        name: "Volatilidade do Mercado de Energia",
        score: 78,
        weight: 0.4,
        trend: "up",
        description:
          "Alta volatilidade nos preços de energia solar pode impactar o ROI.",
      },
      {
        name: "Risco Regulatório",
        score: 65,
        weight: 0.3,
        trend: "stable",
        description:
          "Mudanças nas políticas de incentivo fiscal para energia renovável.",
      },
      {
        name: "Confiabilidade da Previsão de Geração",
        score: 82,
        weight: 0.3,
        trend: "down",
        description:
          "Precisão dos modelos de previsão de geração de energia solar.",
      },
    ],
    assessedAt: new Date(),
    confidence: 0.88,
    recommendations: [
      "Diversificar o portfólio de investimentos em energia.",
      "Implementar hedge para mitigar a volatilidade de preços.",
      "Aprimorar modelos de previsão com dados meteorológicos em tempo real.",
    ],
    historicalData: {
      dates: [
        subDays(new Date(), DAYS_AGO_90),
        subDays(new Date(), DAYS_AGO_60),
        subDays(new Date(), DAYS_AGO_30),
        new Date(),
      ],
      scores: [68, 71, 70, 75],
    },
    isPremium: true,
  },
];

export const mockRiskGaugeProps: ArtifactRiskGaugeProps = {
  assessments: mockAssessments,
  onExport: () => alert("Exportando relatório de risco..."),
  onShare: () => alert("Compartilhando análise de risco..."),
  isPremiumUser: false,
};

// Mock para ArtifactAnomalyReport
const mockAnomalies: AnomalyData[] = [
  {
    id: "ANOM-001",
    type: "equipment_failure",
    severity: "critical",
    title: "Queda abrupta de 40% na geração",
    description: 'Queda na usina "Sol do Sertão".',
    detectedAt: subDays(new Date(), DAYS_AGO_1),
    confidence: 0.95,
    impact: { cost: 50_000, efficiency: -40, risk: 90 },
    recommendations: [
      "Verificar conexão do inversor principal.",
      "Inspecionar painéis solares na área afetada.",
    ],
  },
  {
    id: "ANOM-002",
    type: "unusual_pattern",
    severity: "high",
    title: "Latência elevada na API de preços",
    description: "API de preços excedeu 2000ms por 30 minutos.",
    detectedAt: subDays(new Date(), DAYS_AGO_2),
    confidence: 0.98,
    impact: { cost: 5000, efficiency: -5, risk: 60 },
    recommendations: [
      "Escalar para o time de infraestrutura.",
      "Verificar logs do serviço de dados.",
    ],
  },
  {
    id: "ANOM-003",
    type: "efficiency_drop",
    severity: "medium",
    title: "Desvio no modelo de previsão",
    description: "Modelo de previsão de demanda com erro de 15%.",
    detectedAt: subDays(new Date(), DAYS_AGO_3),
    confidence: 0.85,
    impact: { cost: 2500, efficiency: -15, risk: 45 },
    recommendations: ["Re-treinar modelo com dados de feriados."],
  },
];

export const mockAnomalyReportProps: ArtifactAnomalyReportProps = {
  anomalies: mockAnomalies,
  isPremiumUser: true,
};

// Mock para ArtifactComplianceBadge
const mockCertificates: ComplianceCertificate[] = [
  {
    id: "cert-iso-50001",
    name: "ISO 50001 - Gestão de Energia",
    issuer: "ABNT",
    status: "compliant",
    issuedAt: subDays(new Date(), DAYS_AGO_180),
    expiresAt: subDays(new Date(), DAYS_AHEAD_185),
    score: 95,
    requirements: [
      {
        id: "req-1-1",
        name: "Política Energética",
        description: "...",
        status: "met",
      },
      {
        id: "req-1-2",
        name: "Auditoria Interna",
        description: "...",
        status: "met",
      },
    ],
  },
  {
    id: "cert-nbr-16149",
    name: "ABNT NBR 16149 - Sistemas Fotovoltaicos",
    issuer: "INMETRO",
    status: "pending",
    issuedAt: subDays(new Date(), DAYS_AGO_30),
    score: 80,
    requirements: [
      { id: "req-2-1", name: "Aterramento", description: "...", status: "met" },
      {
        id: "req-2-2",
        name: "Sinalização",
        description: "...",
        status: "pending",
      },
    ],
  },
];

export const mockComplianceBadgeProps: ArtifactComplianceBadgeProps = {
  certificates: mockCertificates,
  onExport: () => alert("Exportando relatório de conformidade..."),
  onDownload: (id: string) => alert(`Baixando certificado ${id}`),
};

// Mock para ArtifactToolInspector
const mockRecentCalls: ToolCall[] = [
  {
    id: "call-1",
    toolName: "getEnergyPrice",
    timestamp: new Date(),
    duration: 280,
    cost: 2, // in cents
    status: "success",
    inputTokens: 50,
    outputTokens: 10,
  },
  {
    id: "call-2",
    toolName: "forecastGeneration",
    timestamp: subDays(new Date(), FRACTIONAL_DAY_0_01),
    duration: 850,
    cost: 15, // in cents
    status: "success",
    inputTokens: 200,
    outputTokens: 500,
  },
  {
    id: "call-3",
    toolName: "getEnergyPrice",
    timestamp: subDays(new Date(), FRACTIONAL_DAY_0_02),
    duration: 550,
    cost: 5, // in cents
    status: "error",
    error: "API timeout",
    inputTokens: 45,
    outputTokens: 0,
  },
];

export const mockToolInspectorProps: ArtifactToolInspectorProps = {
  toolCalls: mockRecentCalls,
  onRefresh: () => alert("Atualizando dados..."),
};
