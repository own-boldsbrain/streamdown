/**
 * @file Este arquivo contém dados mockados para os componentes de artefatos de IA.
 * Em um ambiente de produção, esses dados viriam de uma API.
 * Eles são usados para desenvolvimento, testes e demonstração dos componentes de UI.
 */

import {
  type Anomaly,
  type AnomalyReportProps,
} from '@/components/artifact-anomaly-report'
import {
  type Certificate,
  type ComplianceBadgeProps,
} from '@/components/artifact-compliance-badge'
import {
  type RiskFactor,
  type RiskGaugeProps,
} from '@/components/artifact-risk-gauge'
import {
  type Metric,
  type RecentCall,
  type ToolInspectorProps,
} from '@/components/artifact-tool-inspector'
import { subDays } from 'date-fns'

// Mock para ArtifactRiskGauge
const mockRiskFactors: RiskFactor[] = [
  {
    name: 'Volatilidade do Mercado de Energia',
    value: 7.8,
    description:
      'Alta volatilidade nos preços de energia solar pode impactar o ROI.',
  },
  {
    name: 'Risco Regulatório',
    value: 6.5,
    description:
      'Mudanças nas políticas de incentivo fiscal para energia renovável.',
  },
  {
    name: 'Confiabilidade da Previsão de Geração',
    value: 8.2,
    description:
      'Precisão dos modelos de previsão de geração de energia solar.',
  },
]

export const mockRiskGaugeProps: RiskGaugeProps = {
  riskLevel: 7.5,
  riskFactors: mockRiskFactors,
  historicalData: [
    { date: subDays(new Date(), 90), risk: 6.8 },
    { date: subDays(new Date(), 60), risk: 7.1 },
    { date: subDays(new Date(), 30), risk: 7.0 },
    { date: new Date(), risk: 7.5 },
  ],
  recommendations: [
    'Diversificar o portfólio de investimentos em energia.',
    'Implementar hedge para mitigar a volatilidade de preços.',
    'Aprimorar modelos de previsão com dados meteorológicos em tempo real.',
  ],
  lastUpdated: new Date(),
  onExport: () => alert('Exportando relatório de risco...'),
  onShare: () => alert('Compartilhando análise de risco...'),
}

// Mock para ArtifactAnomalyReport
const mockAnomalies: Anomaly[] = [
  {
    id: 'ANOM-001',
    timestamp: subDays(new Date(), 1),
    severity: 'critical',
    description:
      'Queda abrupta de 40% na geração da usina solar "Sol do Sertão".',
    details:
      'Causa provável: Desconexão inesperada do inversor principal. Impacto: Perda de 5 MWh. Ações: Equipe de manutenção notificada.',
    affectedSystems: ['Geração', 'Inversor'],
  },
  {
    id: 'ANOM-002',
    timestamp: subDays(new Date(), 2),
    severity: 'high',
    description: 'Latência elevada na API de preços de energia.',
    details:
      'A latência da API de consulta de preços excedeu 2000ms por 30 minutos. Causa: Sobrecarga no serviço de dados. Ações: Escalado para o time de infraestrutura.',
    affectedSystems: ['API', 'Precificação'],
  },
  {
    id: 'ANOM-003',
    timestamp: subDays(new Date(), 3),
    severity: 'medium',
    description: 'Desvio no modelo de previsão de demanda.',
    details:
      'O modelo de previsão de demanda apresentou um erro de 15% acima do normal. Causa: Feriado não considerado no modelo. Ações: Modelo re-treinado com novos dados.',
    affectedSystems: ['Previsão', 'IA'],
  },
]

export const mockAnomalyReportProps: AnomalyReportProps = {
  anomalies: mockAnomalies,
  summary: {
    totalAnomalies: 3,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 0,
  },
  lastChecked: new Date(),
  isPremiumUser: true,
  onViewDetails: (id) => alert(`Visualizando detalhes da anomalia ${id}`),
}

// Mock para ArtifactComplianceBadge
const mockCertificates: Certificate[] = [
  {
    name: 'ISO 50001 - Gestão de Energia',
    status: 'compliant',
    description: 'Norma internacional para sistemas de gestão de energia.',
    score: 95,
    requirements: [
      { name: 'Política Energética', met: true },
      { name: 'Auditoria Interna', met: true },
      { name: 'Monitoramento Contínuo', met: true },
    ],
  },
  {
    name: 'ABNT NBR 16149 - Sistemas Fotovoltaicos',
    status: 'partially-compliant',
    description: 'Norma brasileira para segurança de sistemas fotovoltaicos.',
    score: 80,
    requirements: [
      { name: 'Aterramento do Sistema', met: true },
      { name: 'Sinalização de Segurança', met: false },
      { name: 'Proteção Contra Surtos', met: true },
    ],
  },
  {
    name: 'LEED - Liderança em Energia e Design Ambiental',
    status: 'non-compliant',
    description: 'Certificação para construções sustentáveis.',
    score: 45,
    requirements: [
      { name: 'Eficiência Hídrica', met: true },
      { name: 'Qualidade do Ar Interno', met: false },
      { name: 'Inovação em Design', met: false },
    ],
  },
]

export const mockComplianceBadgeProps: ComplianceBadgeProps = {
  certificates: mockCertificates,
  overallStatus: 'partially-compliant',
  lastAudited: subDays(new Date(), 45),
  onExport: () => alert('Exportando relatório de conformidade...'),
}

// Mock para ArtifactToolInspector
const mockMetrics: Metric[] = [
  { name: 'Custo Total', value: '$0.42', trend: 'up' },
  { name: 'Duração Média', value: '350ms', trend: 'down' },
  { name: 'Taxa de Sucesso', value: '99.8%', trend: 'stable' },
  { name: 'Chamadas/min', value: '120', trend: 'up' },
]

const mockRecentCalls: RecentCall[] = [
  {
    id: 'call-1',
    toolName: 'getEnergyPrice',
    timestamp: new Date(),
    duration: 280,
    cost: 0.002,
    status: 'success',
    input: { location: 'SP', currency: 'BRL' },
    output: { price: 540.5 },
  },
  {
    id: 'call-2',
    toolName: 'forecastGeneration',
    timestamp: subDays(new Date(), 0.01),
    duration: 850,
    cost: 0.015,
    status: 'success',
    input: { plantId: 'SdS-01', hours: 24 },
    output: { forecast: [/* data */] },
  },
  {
    id: 'call-3',
    toolName: 'getEnergyPrice',
    timestamp: subDays(new Date(), 0.02),
    duration: 550,
    cost: 0.005,
    status: 'error',
    input: { location: 'RJ' },
    output: { error: 'API timeout' },
  },
]

export const mockToolInspectorProps: ToolInspectorProps = {
  metrics: mockMetrics,
  recentCalls: mockRecentCalls,
  lastUpdated: new Date(),
  isPremiumUser: true,
  onFilterChange: (filter) => alert(`Filtro alterado para: ${filter}`),
}
