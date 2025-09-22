"use client";

import React, { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Activity,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Cpu,
  Database,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const COST_PER_TOKEN_INPUT = 0.00015; // USD per token
const COST_PER_TOKEN_OUTPUT = 0.0006; // USD per token
const CENTS_TO_DOLLARS = 100;
const SUCCESS_RATE_EXCELLENT = 95;
const SUCCESS_RATE_GOOD = 80;
const DURATION_EXCELLENT_MS = 2000;
const DURATION_GOOD_MS = 5000;
const COST_EXCELLENT_CENTS = 100;
const COST_GOOD_CENTS = 500;
const TOKENS_EXCELLENT = 100_000;
const TOKENS_GOOD = 500_000;
const PERCENTAGE_MULTIPLIER = 100;
const ANIMATION_DELAY_MS = 100;
const MS_TO_SECONDS = 1000;
const DECIMAL_PLACES = 1;
const PROGRESS_MAX_VALUE = 100;
const ANIMATION_STAGGER_DELAY = 0.1;

export type ToolCallStatus = "success" | "error" | "pending" | "timeout";

export type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  threshold?: number;
};

export type ToolCall = {
  id: string;
  toolName: string;
  status: ToolCallStatus;
  duration: number; // in milliseconds
  cost: number; // in USD cents
  timestamp: Date;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  error?: string;
};

export type ArtifactToolInspectorProps = {
  toolCalls: ToolCall[];
  isLoading?: boolean;
  className?: string;
  showExport?: boolean;
  showShare?: boolean;
  onExport?: () => void;
  onShare?: () => void;
  onRefresh?: () => void;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getSuccessRateTrend = (successRate: number): "up" | "down" | "stable" => {
  if (successRate >= SUCCESS_RATE_EXCELLENT) {
    return "up";
  }
  if (successRate >= SUCCESS_RATE_GOOD) {
    return "stable";
  }
  return "down";
};

const getDurationTrend = (avgDuration: number): "up" | "down" | "stable" => {
  if (avgDuration <= DURATION_EXCELLENT_MS) {
    return "up";
  }
  if (avgDuration <= DURATION_GOOD_MS) {
    return "stable";
  }
  return "down";
};

const getCostTrend = (totalCost: number): "up" | "down" | "stable" => {
  if (totalCost <= COST_EXCELLENT_CENTS) {
    return "up";
  }
  if (totalCost <= COST_GOOD_CENTS) {
    return "stable";
  }
  return "down";
};

const getTokensTrend = (totalTokens: number): "up" | "down" | "stable" => {
  if (totalTokens <= TOKENS_EXCELLENT) {
    return "up";
  }
  if (totalTokens <= TOKENS_GOOD) {
    return "stable";
  }
  return "down";
};

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    label: "Sucesso"
  },
  error: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    label: "Erro"
  },
  pending: {
    icon: RefreshCw,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    label: "Pendente"
  },
  timeout: {
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "Timeout"
  }
};

export const ArtifactToolInspector = memo<ArtifactToolInspectorProps>(({
  toolCalls,
  isLoading = false,
  className,
  showExport = true,
  showShare = true,
  onExport,
  onShare,
  onRefresh
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [animatedMetrics, setAnimatedMetrics] = useState<Record<string, number>>({});

  // Calculate metrics
  const totalCalls = toolCalls.length;
  const successfulCalls = toolCalls.filter(call => call.status === "success").length;
  const failedCalls = toolCalls.filter(call => call.status === "error" || call.status === "timeout").length;
  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * PERCENTAGE_MULTIPLIER : 0;

  const totalCost = toolCalls.reduce((sum, call) => sum + call.cost, 0);
  const avgDuration = totalCalls > 0
    ? toolCalls.reduce((sum, call) => sum + call.duration, 0) / totalCalls
    : 0;

  const totalTokens = toolCalls.reduce((sum, call) =>
    sum + (call.inputTokens || 0) + (call.outputTokens || 0), 0);

  // Performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    {
      name: "Taxa de Sucesso",
      value: successRate,
      unit: "%",
      trend: getSuccessRateTrend(successRate),
      threshold: SUCCESS_RATE_EXCELLENT
    },
    {
      name: "Tempo Médio",
      value: avgDuration,
      unit: "ms",
      trend: getDurationTrend(avgDuration),
      threshold: DURATION_EXCELLENT_MS
    },
    {
      name: "Custo Total",
      value: totalCost / CENTS_TO_DOLLARS, // Convert cents to dollars
      unit: "USD",
      trend: getCostTrend(totalCost),
      threshold: COST_EXCELLENT_CENTS / CENTS_TO_DOLLARS
    },
    {
      name: "Tokens Usados",
      value: totalTokens,
      unit: "",
      trend: getTokensTrend(totalTokens),
      threshold: TOKENS_EXCELLENT
    }
  ];

  // Animate metrics on change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedMetrics({
        totalCalls,
        successfulCalls,
        failedCalls,
        successRate,
        totalCost: totalCost / CENTS_TO_DOLLARS,
        avgDuration,
        totalTokens
      });
    }, ANIMATION_DELAY_MS);

    return () => clearTimeout(timer);
  }, [totalCalls, successfulCalls, failedCalls, successRate, totalCost, avgDuration, totalTokens]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDuration = (ms: number) => {
    if (ms < MS_TO_SECONDS) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / MS_TO_SECONDS).toFixed(DECIMAL_PLACES)}s`;
  };

  const getStatusIcon = (status: ToolCallStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return <Icon className={cn("h-4 w-4", config.color)} />;
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") {
      return TrendingUp;
    }
    if (trend === "down") {
      return TrendingDown;
    }
    return BarChart3;
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    if (trend === "up") {
      return "text-green-600";
    }
    if (trend === "down") {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  const formatMetricValue = (metric: PerformanceMetric) => {
    if (metric.name === "Custo Total") {
      return formatCurrency(metric.value);
    }
    if (metric.name === "Tempo Médio") {
      return formatDuration(metric.value);
    }
    if (metric.unit === "%") {
      return `${metric.value.toFixed(DECIMAL_PLACES)}${metric.unit}`;
    }
    return metric.value.toLocaleString();
  };

  const renderMetricCard = (metric: PerformanceMetric, index: number) => {
    const TrendIcon = getTrendIcon(metric.trend);
    const trendColor = getTrendColor(metric.trend);

    return (
      <motion.div
        key={metric.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * ANIMATION_STAGGER_DELAY }}
      >
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">{metric.name}</p>
                <div className="flex items-center space-x-2">
                  <motion.p
                    className="font-bold text-2xl"
                    key={animatedMetrics[metric.name.replace(/\s+/g, '').toLowerCase()] || metric.value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {formatMetricValue(metric)}
                  </motion.p>
                  <TrendIcon className={cn("h-4 w-4", trendColor)} />
                </div>
              </div>
              {metric.threshold && (
                <div className="text-right">
                  <Badge variant={metric.value >= metric.threshold ? "default" : "secondary"}>
                    Meta: {metric.name === "Custo Total" ? formatCurrency(metric.threshold) : `${metric.threshold}${metric.unit}`}
                  </Badge>
                </div>
              )}
            </div>
            {metric.threshold && (
              <Progress
                value={Math.min((metric.value / metric.threshold) * PERCENTAGE_MULTIPLIER, PROGRESS_MAX_VALUE)}
                className="mt-3 h-2"
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderRecentCalls = () => {
    const recentCalls = toolCalls.slice(0, 10);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Chamadas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalls.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma chamada registrada ainda
              </p>
            ) : (
              recentCalls.map((call) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(call.status)}
                    <div>
                      <p className="font-medium text-sm">{call.toolName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(call.timestamp, { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-right">
                      <p className="font-medium">{formatDuration(call.duration)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(call.cost / CENTS_TO_DOLLARS)}
                      </p>
                    </div>
                    {call.model && (
                      <Badge variant="outline" className="text-xs">
                        {call.model}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Inspetor de Ferramentas IA
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitoramento de performance e custos das chamadas de IA
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

      {/* Timeframe Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Período:</span>
        {(["1h", "24h", "7d", "30d"] as const).map((timeframe) => (
          <Button
            key={timeframe}
            variant={selectedTimeframe === timeframe ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeframe(timeframe)}
          >
            {timeframe}
          </Button>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      <Separator />

      {/* Recent Calls */}
      {renderRecentCalls()}

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
              <span>Atualizando dados...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ArtifactToolInspector.displayName = "ArtifactToolInspector";

// Utility functions for cost estimation
export const estimateCost = (inputTokens: number, outputTokens: number): number => {
  return (inputTokens * COST_PER_TOKEN_INPUT) + (outputTokens * COST_PER_TOKEN_OUTPUT);
};

export const formatCost = (costInCents: number): string => {
  return formatCurrency(costInCents / CENTS_TO_DOLLARS);
};