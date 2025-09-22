"use client";

import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Zap,
  Shield,
  Download,
  Share2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Crown,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type AnomalySeverity = "low" | "medium" | "high" | "critical";

export type AnomalyType = "consumption_spike" | "unusual_pattern" | "equipment_failure" | "billing_anomaly" | "efficiency_drop";

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
  onExport?: () => void;
  onShare?: () => void;
  onRefresh?: () => void;
  isPremiumUser?: boolean;
};

const ANOMALY_TYPE_LABELS = {
  consumption_spike: "Pico de Consumo",
  unusual_pattern: "Padrão Incomum",
  equipment_failure: "Falha de Equipamento",
  billing_anomaly: "Anomalia de Faturamento",
  efficiency_drop: "Queda de Eficiência"
} as const;

const SEVERITY_CONFIG = {
  low: {
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Baixo",
    priority: 1
  },
  medium: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Médio",
    priority: 2
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Alto",
    priority: 3
  },
  critical: {
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Crítico",
    priority: 4
  }
} as const;

const CENTS_TO_DOLLARS = 100;
const PERCENTAGE_MULTIPLIER = 100;
const DECIMAL_PLACES = 1;
const ANIMATION_STAGGER_DELAY = 0.05;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD'
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

const getAnomalyTypeIcon = (type: AnomalyType) => {
  switch (type) {
    case "consumption_spike":
      return <TrendingUp className="h-4 w-4" />;
    case "unusual_pattern":
      return <BarChart3 className="h-4 w-4" />;
    case "equipment_failure":
      return <Shield className="h-4 w-4" />;
    case "billing_anomaly":
      return <Zap className="h-4 w-4" />;
    case "efficiency_drop":
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

export const ArtifactAnomalyReport = memo<ArtifactAnomalyReportProps>(({
  anomalies,
  isLoading = false,
  className,
  showExport = true,
  showShare = true,
  onExport,
  onShare,
  onRefresh,
  isPremiumUser = false
}) => {
  const [expandedAnomalies, setExpandedAnomalies] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"severity" | "date" | "impact">("severity");

  // Sort anomalies
  const sortedAnomalies = [...anomalies].sort((a, b) => {
    switch (sortBy) {
      case "severity":
        return SEVERITY_CONFIG[b.severity].priority - SEVERITY_CONFIG[a.severity].priority;
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
  const criticalAnomalies = anomalies.filter(a => a.severity === "critical").length;
  const totalPotentialSavings = anomalies.reduce((sum, a) => sum + a.impact.cost, 0);
  const averageConfidence = totalAnomalies > 0
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
        key={anomaly.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * ANIMATION_STAGGER_DELAY }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all duration-200",
          config.borderColor,
          isExpanded && "ring-2 ring-primary/20"
        )}>
          {isPremium && (
            <div className="absolute top-2 right-2 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
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
              <div className="flex items-start space-x-3 flex-1">
                <div className={cn("p-2 rounded-lg", config.bgColor)}>
                  {getSeverityIcon(anomaly.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{anomaly.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {ANOMALY_TYPE_LABELS[anomaly.type]}
                    </Badge>
                    <Badge
                      variant={anomaly.severity === "critical" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {config.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {anomaly.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(anomaly.detectedAt, { addSuffix: true, locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {formatPercentage(anomaly.confidence)} confiança
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">
                    -{formatCurrency(anomaly.impact.cost / CENTS_TO_DOLLARS)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    potencial economia
                  </div>
                </div>

                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(anomaly.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

            <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(anomaly.id)}>
              <CollapsibleContent className="mt-4">
                <Separator className="mb-4" />

                {/* Impact Details */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      -{formatCurrency(anomaly.impact.cost / CENTS_TO_DOLLARS)}
                    </div>
                    <div className="text-xs text-muted-foreground">Impacto Financeiro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      -{anomaly.impact.efficiency.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Eficiência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {anomaly.impact.risk}
                    </div>
                    <div className="text-xs text-muted-foreground">Nível de Risco</div>
                  </div>
                </div>

                {/* Historical Data */}
                {anomaly.historicalData && (
                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-2">Dados Históricos</h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Linha de Base</div>
                        <div className="font-medium">{anomaly.historicalData.baseline.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Valor Real</div>
                        <div className="font-medium">{anomaly.historicalData.actual.toLocaleString()}</div>
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
                  <h5 className="font-medium text-sm mb-2">Recomendações</h5>
                  <ul className="space-y-1">
                    {anomaly.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {isPremium && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Crown className="h-4 w-4" />
                      <span className="font-medium text-sm">Recurso Premium</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Faça upgrade para acessar análises detalhadas e relatórios completos de anomalias.
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

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Relatório de Anomalias
          </h3>
          <p className="text-sm text-muted-foreground">
            Detecção inteligente de anomalias no consumo de energia
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Atualizar dados</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {showExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
          {showShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Anomalias</p>
                <p className="text-2xl font-bold">{totalAnomalies}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Anomalias Críticas</p>
                <p className="text-2xl font-bold text-red-600">{criticalAnomalies}</p>
              </div>
              <Zap className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Economia Potencial</p>
                <p className="text-2xl font-bold text-green-600">
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
                <p className="text-sm font-medium text-muted-foreground">Precisão Média</p>
                <p className="text-2xl font-bold">{formatPercentage(averageConfidence)}</p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Ordenar por:</span>
        {(["severity", "date", "impact"] as const).map((option) => (
          <Button
            key={option}
            variant={sortBy === option ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy(option)}
          >
            {option === "severity" ? "Severidade" : option === "date" ? "Data" : "Impacto"}
          </Button>
        ))}
      </div>

      <Separator />

      {/* Anomalies List */}
      <div className="space-y-4">
        {sortedAnomalies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Nenhuma Anomalia Detectada</h4>
              <p className="text-sm text-muted-foreground">
                Seu sistema está funcionando normalmente. Continuaremos monitorando para detectar qualquer irregularidade.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedAnomalies.map((anomaly, index) => renderAnomalyCard(anomaly, index))
        )}
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-8"
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
});

ArtifactAnomalyReport.displayName = "ArtifactAnomalyReport";