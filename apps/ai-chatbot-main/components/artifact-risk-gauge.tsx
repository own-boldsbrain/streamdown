"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Crown,
  Download,
  Eye,
  Gauge,
  RefreshCw,
  Share2,
  Shield,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskFactor = {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  trend: "up" | "down" | "stable";
  description: string;
};

export type RiskAssessment = {
  id: string;
  title: string;
  overallRisk: number; // 0-100
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  assessedAt: Date;
  confidence: number; // 0-1
  recommendations: string[];
  historicalData?: {
    dates: Date[];
    scores: number[];
  };
  isPremium?: boolean;
};

export type ArtifactRiskGaugeProps = {
  assessments: RiskAssessment[];
  isLoading?: boolean;
  className?: string;
  showExport?: boolean;
  showShare?: boolean;
  showView?: boolean;
  onExport?: () => void;
  onShare?: () => void;
  onView?: () => void;
  onRefresh?: () => void;
  isPremiumUser?: boolean;
};

const RISK_LEVEL_CONFIG = {
  low: {
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Baixo Risco",
    range: [0, 25],
  },
  medium: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Risco Médio",
    range: [26, 50],
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Alto Risco",
    range: [51, 75],
  },
  critical: {
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Risco Crítico",
    range: [76, 100],
  },
} as const;

const RISK_LOW_MAX = 25;
const RISK_MEDIUM_MAX = 50;
const RISK_HIGH_MAX = 75;
const _RISK_CRITICAL_MIN = 76;
const RISK_CRITICAL_MAX = 100;
const GAUGE_CIRCUMFERENCE = 283;
const _GAUGE_RADIUS = 45;
const PERCENTAGE_MULTIPLIER = 100;
const ANIMATION_DELAY_STEP = 0.1;
const HIGH_RISK_THRESHOLD = 70;
const MEDIUM_RISK_THRESHOLD = 40;
const HISTORICAL_CHART_HEIGHT_MULTIPLIER = 100;
const HISTORICAL_CHART_ANIMATION_DELAY = 0.05;
const DECIMAL_PLACES = 1;

const _formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${(value * PERCENTAGE_MULTIPLIER).toFixed(DECIMAL_PLACES)}%`;
};

const getRiskIcon = (level: RiskLevel) => {
  const config = RISK_LEVEL_CONFIG[level];
  const Icon = config.icon;
  return <Icon className={cn("h-4 w-4", config.color)} />;
};

const getRiskColor = (score: number): RiskLevel => {
  if (score <= RISK_LOW_MAX) {
    return "low";
  }
  if (score <= RISK_MEDIUM_MAX) {
    return "medium";
  }
  if (score <= RISK_HIGH_MAX) {
    return "high";
  }
  return "critical";
};

const _getRiskGaugeColor = (score: number) => {
  const level = getRiskColor(score);
  const config = RISK_LEVEL_CONFIG[level];
  return config.color;
};

const generateChartKey = (score: number, index: number): string => {
  return `chart-${score}-${index}`;
};

const generateRecommendationKey = (rec: string, index: number): string => {
  return `rec-${rec.slice(0, 10)}-${index}`;
};

const getFactorColor = (score: number): string => {
  if (score > HIGH_RISK_THRESHOLD) {
    return "bg-red-500";
  }
  if (score > MEDIUM_RISK_THRESHOLD) {
    return "bg-yellow-500";
  }
  return "bg-green-500";
};

export const ArtifactRiskGauge = memo<ArtifactRiskGaugeProps>(
  ({
    assessments,
    isLoading = false,
    className,
    showExport = true,
    showShare = true,
    onExport,
    onShare,
    onRefresh,
    isPremiumUser = false,
  }) => {
    const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
      assessments.length > 0 ? assessments[0].id : null
    );

    const currentAssessment =
      assessments.find((a) => a.id === selectedAssessment) || assessments[0];

    // Calculate summary metrics
    const averageRisk =
      assessments.length > 0
        ? assessments.reduce((sum, a) => sum + a.overallRisk, 0) /
          assessments.length
        : 0;

    const highRiskCount = assessments.filter(
      (a) => a.overallRisk > RISK_MEDIUM_MAX
    ).length;
    const criticalRiskCount = assessments.filter(
      (a) => a.overallRisk > RISK_HIGH_MAX
    ).length;
    const averageConfidence =
      assessments.length > 0
        ? assessments.reduce((sum, a) => sum + a.confidence, 0) /
          assessments.length
        : 0;

    const renderRiskGauge = (assessment: RiskAssessment) => {
      const config = RISK_LEVEL_CONFIG[assessment.riskLevel];

      return (
        <div className="space-y-6">
          {/* Main Risk Gauge */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg
                className="-rotate-90 h-48 w-48 transform"
                viewBox="0 0 100 100"
              >
                <title>Medidor de Risco</title>
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Risk arc */}
                <circle
                  className={cn(
                    assessment.riskLevel === "low" && "stroke-green-500",
                    assessment.riskLevel === "medium" && "stroke-yellow-500",
                    assessment.riskLevel === "high" && "stroke-orange-500",
                    assessment.riskLevel === "critical" && "stroke-red-500"
                  )}
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke={`var(--${assessment.riskLevel}-500)`}
                  strokeDasharray={`${(assessment.overallRisk / RISK_CRITICAL_MAX) * GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-bold text-4xl text-gray-900">
                  {assessment.overallRisk}
                </div>
                <div className="text-gray-600 text-sm">Pontuação de Risco</div>
                <Badge
                  className="mt-2"
                  variant={
                    assessment.riskLevel === "critical"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {config.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-semibold text-lg">
              <BarChart3 className="h-5 w-5" />
              Fatores de Risco
            </h4>

            {assessment.factors.map((factor, index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                key={factor.name}
                transition={{ delay: index * ANIMATION_DELAY_STEP }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full",
                        getFactorColor(factor.score)
                      )}
                    />
                    <span className="font-medium">{factor.name}</span>
                    <Badge className="text-xs" variant="outline">
                      Peso: {formatPercentage(factor.weight)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{factor.score}/100</span>
                    {factor.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    )}
                    {factor.trend === "down" && (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    {factor.trend === "stable" && (
                      <Activity className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>

                <Progress className="h-2" value={factor.score} />

                <p className="text-muted-foreground text-sm">
                  {factor.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Historical Trend */}
          {assessment.historicalData && (
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-semibold text-lg">
                <TrendingUp className="h-5 w-5" />
                Tendência Histórica
              </h4>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium text-sm">Últimos 30 dias</span>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-xs">Risco Alto</span>
                    <div className="ml-2 h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-xs">Risco Médio</span>
                    <div className="ml-2 h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs">Risco Baixo</span>
                  </div>
                </div>

                <div className="flex h-32 items-end justify-between gap-1">
                  {assessment.historicalData.scores
                    .slice(-10)
                    .map((score, index) => {
                      const height =
                        (score / RISK_CRITICAL_MAX) *
                        HISTORICAL_CHART_HEIGHT_MULTIPLIER;
                      const color = getFactorColor(score);

                      return (
                        <motion.div
                          animate={{ height }}
                          className={cn("flex-1 rounded-t", color)}
                          initial={{ height: 0 }}
                          key={generateChartKey(score, index)}
                          style={{ minHeight: `${height}%` }}
                          transition={{
                            delay: index * HISTORICAL_CHART_ANIMATION_DELAY,
                          }}
                        />
                      );
                    })}
                </div>

                <div className="mt-2 flex justify-between text-muted-foreground text-xs">
                  <span>10 dias atrás</span>
                  <span>Hoje</span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-semibold text-lg">
              <Target className="h-5 w-5" />
              Recomendações
            </h4>

            <div className="space-y-3">
              {assessment.recommendations.map((rec, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-lg bg-blue-50 p-3"
                  initial={{ opacity: 0, y: 10 }}
                  key={generateRecommendationKey(rec, index)}
                  transition={{ delay: index * ANIMATION_DELAY_STEP }}
                >
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <p className="text-sm">{rec}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          {assessment.isPremium && !isPremiumUser && (
            <div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-yellow-800">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Recursos Premium</span>
              </div>
              <p className="text-sm text-yellow-700">
                Faça upgrade para acessar dados históricos completos, análises
                avançadas de risco e relatórios detalhados.
              </p>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Gauge className="h-5 w-5" />
              Avaliação de Risco
            </h3>
            <p className="text-muted-foreground text-sm">
              Monitoramento inteligente de riscos no sistema de energia
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isLoading}
                      onClick={onRefresh}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw
                        className={cn("h-4 w-4", isLoading && "animate-spin")}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Atualizar dados</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {showExport && (
              <Button onClick={onExport} size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            )}
            {showShare && (
              <Button onClick={onShare} size="sm" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            )}
            {showView && (
              <Button onClick={onView} size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Risco Médio
                  </p>
                  <p className="font-bold text-2xl">{averageRisk.toFixed(0)}</p>
                </div>
                <Gauge className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Riscos Altos
                  </p>
                  <p className="font-bold text-2xl text-orange-600">
                    {highRiskCount}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Riscos Críticos
                  </p>
                  <p className="font-bold text-2xl text-red-600">
                    {criticalRiskCount}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-muted-foreground text-sm">
                    Precisão Média
                  </p>
                  <p className="font-bold text-2xl">
                    {formatPercentage(averageConfidence)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Selector */}
        {assessments.length > 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Selecionar Avaliação</h4>
            <div className="flex flex-wrap gap-2">
              {assessments.map((assessment) => {
                const _config = RISK_LEVEL_CONFIG[assessment.riskLevel];
                const isSelected = selectedAssessment === assessment.id;

                return (
                  <Button
                    className="flex items-center gap-2"
                    key={assessment.id}
                    onClick={() => setSelectedAssessment(assessment.id)}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                  >
                    {getRiskIcon(assessment.riskLevel)}
                    <span className="max-w-32 truncate">
                      {assessment.title}
                    </span>
                    <Badge className="text-xs" variant="secondary">
                      {assessment.overallRisk}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Current Assessment */}
        {currentAssessment ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRiskIcon(currentAssessment.riskLevel)}
                  {currentAssessment.title}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(currentAssessment.assessedAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>{renderRiskGauge(currentAssessment)}</CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h4 className="mb-2 font-semibold">
                Nenhuma Avaliação Disponível
              </h4>
              <p className="text-muted-foreground text-sm">
                Não há avaliações de risco disponíveis no momento.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-8"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analisando riscos...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ArtifactRiskGauge.displayName = "ArtifactRiskGauge";
