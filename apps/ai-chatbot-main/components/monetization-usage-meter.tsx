"use client";

import { Crown, TrendingUp, Zap } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type UsageTier = "free" | "starter" | "pro" | "enterprise";

export type UsageType =
  | "messages"
  | "tokens"
  | "images"
  | "minutes"
  | "requests"
  | "storage";

type UsageLimit = {
  current: number;
  limit: number;
  type: UsageType;
  period: "daily" | "monthly" | "yearly";
};

type MonetizationUsageMeterProps = {
  usage: UsageLimit;
  tier?: UsageTier;
  showUpgradeButton?: boolean;
  showProgressBar?: boolean;
  showPercentage?: boolean;
  compact?: boolean;
  onUpgrade?: () => void;
  className?: string;
  customLabel?: string;
  customDescription?: string;
};

const tierConfigs = {
  free: {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    progressColor: "bg-gray-400",
  },
  starter: {
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    progressColor: "bg-blue-500",
  },
  pro: {
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    progressColor: "bg-purple-500",
  },
  enterprise: {
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    progressColor: "bg-green-500",
  },
};

const usageTypeLabels = {
  messages: "Mensagens",
  tokens: "Tokens",
  images: "Imagens",
  minutes: "Minutos",
  requests: "Requisições",
  storage: "Armazenamento",
};

const periodLabels = {
  daily: "hoje",
  monthly: "este mês",
  yearly: "este ano",
};

const PERCENTAGE_MULTIPLIER = 100;
const EXCEEDED_THRESHOLD = 100;
const DANGER_THRESHOLD = 90;
const WARNING_THRESHOLD = 75;
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;
const BYTES_PER_GB = BYTES_PER_MB * BYTES_PER_KB;

const ANIMATION_DELAY = 100;
const FULL_PERCENTAGE = 100;

const getUsagePercentage = (current: number, limit: number): number => {
  return Math.min(
    (current / limit) * PERCENTAGE_MULTIPLIER,
    EXCEEDED_THRESHOLD
  );
};

const getUsageStatus = (
  percentage: number
): "safe" | "warning" | "danger" | "exceeded" => {
  if (percentage >= EXCEEDED_THRESHOLD) {
    return "exceeded";
  }
  if (percentage >= DANGER_THRESHOLD) {
    return "danger";
  }
  if (percentage >= WARNING_THRESHOLD) {
    return "warning";
  }
  return "safe";
};

const formatUsageValue = (value: number, type: UsageType): string => {
  switch (type) {
    case "tokens":
    case "messages":
    case "requests":
      return value.toLocaleString();
    case "images":
      return `${value}`;
    case "minutes":
      return `${Math.floor(value / 60)}h ${value % 60}m`;
    case "storage":
      if (value >= BYTES_PER_GB) {
        return `${(value / BYTES_PER_GB).toFixed(1)}GB`;
      }
      if (value >= BYTES_PER_MB) {
        return `${(value / BYTES_PER_MB).toFixed(1)}MB`;
      }
      return `${(value / BYTES_PER_KB).toFixed(1)}KB`;
    default:
      return value.toString();
  }
};

export const MonetizationUsageMeter = memo<MonetizationUsageMeterProps>(
  ({
    usage,
    tier = "free",
    showUpgradeButton = true,
    showProgressBar = true,
    showPercentage = true,
    compact = false,
    onUpgrade,
    className,
    customLabel,
    customDescription,
  }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    const percentage = getUsagePercentage(usage.current, usage.limit);
    const status = getUsageStatus(percentage);
    const config = tierConfigs[tier];

    // Animate progress bar
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, ANIMATION_DELAY);
      return () => clearTimeout(timer);
    }, [percentage]);

    const getStatusColor = () => {
      switch (status) {
        case "exceeded":
          return "text-red-600";
        case "danger":
          return "text-orange-600";
        case "warning":
          return "text-yellow-600";
        default:
          return config.color;
      }
    };

    const getProgressColor = () => {
      switch (status) {
        case "exceeded":
          return "bg-red-500";
        case "danger":
          return "bg-orange-500";
        case "warning":
          return "bg-yellow-500";
        default:
          return config.progressColor;
      }
    };

    const getUpgradeUrgency = () => {
      switch (status) {
        case "exceeded":
          return "Crítico - Upgrade Imediato";
        case "danger":
          return "Próximo do Limite";
        case "warning":
          return "Atenção ao Limite";
        default:
          return "Expandir Limites";
      }
    };

    const renderCompact = () => (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className={cn("h-4 w-4", getStatusColor())} />
          <span className={getStatusColor()}>
            {formatUsageValue(usage.current, usage.type)} /{" "}
            {formatUsageValue(usage.limit, usage.type)}
          </span>
        </div>
        {showPercentage && (
          <Badge
            className={cn(
              "text-xs",
              status === "exceeded" && "border-red-200 bg-red-100 text-red-700",
              status === "danger" &&
                "border-orange-200 bg-orange-100 text-orange-700",
              status === "warning" &&
                "border-yellow-200 bg-yellow-100 text-yellow-700"
            )}
            variant="outline"
          >
            {percentage.toFixed(0)}%
          </Badge>
        )}
        {showUpgradeButton && status !== "safe" && (
          <Button
            className="h-6 px-2 text-xs"
            onClick={onUpgrade}
            size="sm"
            variant="outline"
          >
            <Crown className="mr-1 h-3 w-3" />
            Upgrade
          </Button>
        )}
      </div>
    );

    const renderFull = () => (
      <TooltipProvider>
        <div
          className={cn(
            "space-y-3 rounded-lg border p-4",
            config.borderColor,
            config.bgColor,
            className
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={cn("h-5 w-5", config.color)} />
              <div>
                <h4 className="font-medium text-sm">
                  {customLabel ||
                    `${usageTypeLabels[usage.type]} ${periodLabels[usage.period]}`}
                </h4>
                {customDescription && (
                  <p className="text-muted-foreground text-xs">
                    {customDescription}
                  </p>
                )}
              </div>
            </div>
            <Badge
              className={cn("text-xs capitalize", config.color, config.bgColor)}
              variant="secondary"
            >
              {tier}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={getStatusColor()}>
                {formatUsageValue(usage.current, usage.type)} de{" "}
                {formatUsageValue(usage.limit, usage.type)}
              </span>
              {showPercentage && (
                <span className={cn("font-medium", getStatusColor())}>
                  {percentage.toFixed(1)}%
                </span>
              )}
            </div>

            {showProgressBar && (
              <div className="relative">
                <Progress className="h-3 bg-white/50" value={animatedValue} />
                <div
                  className="absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${animatedValue}%`,
                    backgroundColor: getProgressColor(),
                  }}
                />
              </div>
            )}
          </div>

          {status !== "safe" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status === "exceeded" && (
                  <Zap className="h-4 w-4 text-red-500" />
                )}
                <p
                  className={cn(
                    "text-xs",
                    status === "exceeded" && "text-red-600",
                    status === "danger" && "text-orange-600",
                    status === "warning" && "text-yellow-600"
                  )}
                >
                  {status === "exceeded"
                    ? "Limite excedido - funcionalidade limitada"
                    : `Atenção: ${Math.max(0, FULL_PERCENTAGE - Math.round(percentage))}% restante`}
                </p>
              </div>

              {showUpgradeButton && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={cn(
                        "h-8 px-3 font-medium text-xs",
                        status === "exceeded" && "bg-red-600 hover:bg-red-700",
                        status === "danger" &&
                          "bg-orange-600 hover:bg-orange-700",
                        status === "warning" &&
                          "bg-yellow-600 hover:bg-yellow-700"
                      )}
                      onClick={onUpgrade}
                      size="sm"
                    >
                      <Crown className="mr-1 h-3 w-3" />
                      {status === "exceeded" ? "Upgrade Agora" : "Expandir"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getUpgradeUrgency()}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </TooltipProvider>
    );

    return compact ? renderCompact() : renderFull();
  }
);

MonetizationUsageMeter.displayName = "MonetizationUsageMeter";
