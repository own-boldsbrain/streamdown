"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  Download,
  Eye,
  RefreshCw,
  Share2,
  Shield,
  Star,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AnomalySeverity = "low" | "medium" | "high" | "critical";

export type AnomalyType =
  | "consumption_spike"
  | "unusual_pattern"
  | "equipment_failure"
  | "billing_anomaly"
  | "efficiency_drop";

export type AnomalyData = {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  detectedAt: Date;
  confidence: number; // 0-1
  impact: {
    cost: number; // in cents
    efficiency: number; // percentage
    risk: number; // 0-100
  };
  recommendations: string[];
  historicalData?: {
    baseline: number;
    actual: number;
    deviation: number;
  };
  isPremium?: boolean;
};

export type ArtifactAnomalyReportProps = {
  anomalies: AnomalyData[];
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

const ANOMALY_TYPE_LABELS = {
  consumption_spike: "Pico de Consumo",
  unusual_pattern: "Padrão Incomum",
  equipment_failure: "Falha de Equipamento",
  billing_anomaly: "Anomalia de Faturamento",
  efficiency_drop: "Queda de Eficiência",
} as const;

const SEVERITY_CONFIG = {
  low: {
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Baixo",
    priority: 1,
  },
  medium: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Médio",
    priority: 2,
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Alto",
    priority: 3,
  },
  critical: {
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Crítico",
    priority: 4,
  },
} as const;

const CENTS_TO_DOLLARS = 100;
const PERCENTAGE_MULTIPLIER = 100;
const DECIMAL_PLACES = 1;
const ANIMATION_STAGGER_DELAY = 0.05;
const RECOMMENDATION_KEY_SLICE = 12;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${(value * PERCENTAGE_MULTIPLIER).toFixed(DECIMAL_PLACES)}%`;
};

const getSeverityIcon = (severity: AnomalySeverity) => {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;
  return <Icon className={cn("h-4 w-4", config.color)} />;
};

// Helper para gerar keys estáveis para recomendações
const generateRecommendationKey = (rec: string, index: number): string => {
  return `rec-${rec.slice(0, RECOMMENDATION_KEY_SLICE)}-${index}`;
};

export const ArtifactAnomalyReport = memo<ArtifactAnomalyReportProps>(
  ({
    anomalies,
    isLoading = false,
    className,
    showExport = true,
    showShare = true,
    showView = true,
    onExport,
    onShare,
    onView,
    onRefresh,
    isPremiumUser = false,
  }) => {
    const [expandedAnomalies, setExpandedAnomalies] = useState<Set<string>>(
      new Set()
    );
    const [sortBy, setSortBy] = useState<"severity" | "date" | "impact">(
      "severity"
    );

    // Sort anomalies
    const sortedAnomalies = [...anomalies].sort((a, b) => {
      switch (sortBy) {
        case "severity":
          return (
            SEVERITY_CONFIG[b.severity].priority -
            SEVERITY_CONFIG[a.severity].priority
          );
        case "date":
          return b.detectedAt.getTime() - a.detectedAt.getTime();
        case "impact":
          return b.impact.cost - a.impact.cost;
        default:
          return 0;
      }
    });

    // Calculate summary metrics
    const totalAnomalies = anomalies.length;
    const criticalAnomalies = anomalies.filter(
      (a) => a.severity === "critical"
    ).length;
    const totalPotentialSavings = anomalies.reduce(
      (sum, a) => sum + a.impact.cost,
      0
    );
    const averageConfidence =
      totalAnomalies > 0
        ? anomalies.reduce((sum, a) => sum + a.confidence, 0) / totalAnomalies
        : 0;

    const toggleExpanded = (anomalyId: string) => {
      const newExpanded = new Set(expandedAnomalies);
      if (newExpanded.has(anomalyId)) {
        newExpanded.delete(anomalyId);
      } else {
        newExpanded.add(anomalyId);
      }
      setExpandedAnomalies(newExpanded);
    };

    const renderAnomalyCard = (anomaly: AnomalyData, index: number) => {
      const isExpanded = expandedAnomalies.has(anomaly.id);
      const config = SEVERITY_CONFIG[anomaly.severity];
      const isPremium = anomaly.isPremium && !isPremiumUser;

      return (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          key={anomaly.id}
          transition={{ delay: index * ANIMATION_STAGGER_DELAY }}
        >
          <Card
            className={cn(
              "relative overflow-hidden transition-all duration-200",
              config.borderColor,
              isExpanded && "ring-2 ring-primary/20"
            )}
          >
            {isPremium && (
              <div className="absolute top-2 right-2 z-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                        variant="secondary"
                      >
                        <Crown className="mr-1 h-3 w-3" />
                        Premium
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Recurso exclusivo para usuários premium</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start space-x-3">
                  <div className={cn("rounded-lg p-2", config.bgColor)}>
                    {getSeverityIcon(anomaly.severity)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="truncate font-semibold text-sm">
                        {anomaly.title}
                      </h4>
                      <Badge className="text-xs" variant="outline">
                        {ANOMALY_TYPE_LABELS[anomaly.type]}
                      </Badge>
                      <Badge
                        className="text-xs"
                        variant={
                          anomaly.severity === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {config.label}
                      </Badge>
                    </div>

                    <p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
                      {anomaly.description}
                    </p>

                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(anomaly.detectedAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {formatPercentage(anomaly.confidence)} confiança
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-medium text-red-600 text-sm">
                      -{formatCurrency(anomaly.impact.cost / CENTS_TO_DOLLARS)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      potencial economia
                    </div>
                  </div>

                  <Collapsible
                    onOpenChange={() => toggleExpanded(anomaly.id)}
                    open={isExpanded}
                  >
                    <CollapsibleTrigger asChild>
                      <Button className="h-8 w-8 p-0" size="sm" variant="ghost">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
              </div>

              <Collapsible
                onOpenChange={() => toggleExpanded(anomaly.id)}
                open={isExpanded}
              >
                <CollapsibleContent className="mt-4">
                  <Separator className="mb-4" />

                  {/* Impact Details */}
                  <div className="mb-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="font-semibold text-lg text-red-600">
                        -
                        {formatCurrency(anomaly.impact.cost / CENTS_TO_DOLLARS)}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Impacto Financeiro
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg text-orange-600">
                        -{anomaly.impact.efficiency.toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Eficiência
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg text-red-600">
                        {anomaly.impact.risk}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Nível de Risco
                      </div>
                    </div>
                  </div>

                  {/* Historical Data */}
                  {anomaly.historicalData && (
                    <div className="mb-4">
                      <h5 className="mb-2 font-medium text-sm">
                        Dados Históricos
                      </h5>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">
                            Linha de Base
                          </div>
                          <div className="font-medium">
                            {anomaly.historicalData.baseline.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Valor Real
                          </div>
                          <div className="font-medium">
                            {anomaly.historicalData.actual.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Desvio</div>
                          <div className="font-medium text-red-600">
                            +{anomaly.historicalData.deviation.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h5 className="mb-2 font-medium text-sm">Recomendações</h5>
                    <ul className="space-y-1">
                      {anomaly.recommendations.map((rec, idx) => (
                        <li
                          className="flex items-start gap-2 text-sm"
                          key={generateRecommendationKey(rec, idx)}
                        >
                          <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isPremium && (
                    <div className="mt-4 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Crown className="h-4 w-4" />
                        <span className="font-medium text-sm">
                          Recurso Premium
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-yellow-700">
                        Faça upgrade para acessar análises detalhadas e
                        relatórios completos de anomalias.
                      </p>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    const getSortLabel = (option: "severity" | "date" | "impact") => {
      if (option === "severity") {
        return "Severidade";
      }
      if (option === "date") {
        return "Data";
      }
      return "Impacto";
    };

    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <AlertTriangle className="h-5 w-5" />
              Relatório de Anomalias
            </h3>
            <p className="text-muted-foreground text-sm">
              Detecção inteligente de anomalias no consumo de energia
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
                    Total de Anomalias
                  </p>
                  <p className="font-bold text-2xl">{totalAnomalies}</p>
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
                    Anomalias Críticas
                  </p>
                  <p className="font-bold text-2xl text-red-600">
                    {criticalAnomalies}
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
                    Economia Potencial
                  </p>
                  <p className="font-bold text-2xl text-green-600">
                    {formatCurrency(totalPotentialSavings / CENTS_TO_DOLLARS)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-500" />
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

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Ordenar por:</span>
          {(["severity", "date", "impact"] as const).map((option) => (
            <Button
              key={option}
              onClick={() => setSortBy(option)}
              size="sm"
              variant={sortBy === option ? "default" : "outline"}
            >
              {getSortLabel(option)}
            </Button>
          ))}
        </div>

        <Separator />

        {/* Anomalies List */}
        <div className="space-y-4">
          {sortedAnomalies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <h4 className="mb-2 font-semibold">
                  Nenhuma Anomalia Detectada
                </h4>
                <p className="text-muted-foreground text-sm">
                  Seu sistema está funcionando normalmente. Continuaremos
                  monitorando para detectar qualquer irregularidade.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedAnomalies.map((anomaly, index) =>
              renderAnomalyCard(anomaly, index)
            )
          )}
        </div>

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
                <span>Analisando dados...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ArtifactAnomalyReport.displayName = "ArtifactAnomalyReport";
