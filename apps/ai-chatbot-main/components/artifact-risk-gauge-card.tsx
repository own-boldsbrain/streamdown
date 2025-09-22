import { AlertTriangle, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { YelloButton } from "@/components/yello-ui";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "moderate" | "high";

type RiskBreakdown = {
  [key: string]: number;
};

type RiskGaugeProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  onViewDetails?: () => void;
  systemId?: string;
  overallScore?: number;
  riskLevel?: RiskLevel;
  breakdown?: RiskBreakdown;
  recommendations?: string[];
};

const RISK_LEVEL_CONFIG = {
  low: {
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    gaugeColor: "bg-green-500",
    borderColor: "border-green-500",
    label: "Baixo Risco",
  },
  moderate: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    gaugeColor: "bg-yellow-500",
    borderColor: "border-yellow-500",
    label: "Risco Moderado",
  },
  high: {
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50",
    gaugeColor: "bg-red-500",
    borderColor: "border-red-500",
    label: "Alto Risco",
  },
};

/**
 * RiskGauge - Componente de medidor de risco no estilo Yello Solar Hub
 * Segue o estilo de mensagens "Marrento Certo" do AP2 Detection Agent
 */
export function RiskGauge({
  title = "Risco calculado, caminho traçado.",
  subtitle = "Seu índice de risco está controlado.",
  className,
  onViewDetails = () => {
    // Action for viewing details
  },
  systemId = "",
  overallScore = 0,
  riskLevel = "low",
  breakdown = {},
  recommendations = [],
}: RiskGaugeProps) {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const config = RISK_LEVEL_CONFIG[riskLevel];
  const Icon = config.icon;

  const breakdownItems = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  const getScoreText = () => {
    if (riskLevel === "low") return "Tá suave, risco mínimo.";
    if (riskLevel === "moderate") return "Tem ponto de atenção.";
    return "Precisa de ajuste urgente!";
  };

  return (
    <Card className={cn("overflow-hidden", className)} variant="glass">
      <CardHeader className={cn("pb-2", `border-b ${config.borderColor}`)}>
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-xl text-yello-accent">
            {title}
          </CardTitle>
          <Badge
            className={cn(
              "flex items-center gap-1",
              config.color,
              config.bgColor
            )}
            variant="outline"
          >
            <Icon className="h-4 w-4" /> {config.label}
          </Badge>
        </div>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Gauge */}
          <div className="text-center">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <svg className="-rotate-90 h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke={config.gaugeColor
                    .replace("bg-", "fill-")
                    .replace("500", "500")}
                  strokeDasharray={`${(overallScore / 100) * 283} 283`}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-bold text-3xl">{overallScore}</div>
                <div className="text-gray-600 text-sm">Pontuação</div>
              </div>
            </div>
            <p className="mt-2 font-medium text-sm">{getScoreText()}</p>
          </div>

          {/* Breakdown */}
          {breakdownItems.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Detalhamento do Risco:</h4>
              {breakdownItems.map(([key, value]) => (
                <div className="space-y-1" key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <Progress className="h-1.5" value={value} />
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <button
                className="flex items-center font-medium text-sm text-yello-accent"
                onClick={() => setShowRecommendations(!showRecommendations)}
              >
                {showRecommendations ? "Esconder" : "Ver"} recomendações
              </button>

              {showRecommendations && (
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {systemId && (
            <div className="text-gray-500 text-xs">Sistema: {systemId}</div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <YelloButton className="w-full font-medium" onClick={onViewDetails}>
          Ver análise completa
        </YelloButton>
      </CardFooter>
    </Card>
  );
}
