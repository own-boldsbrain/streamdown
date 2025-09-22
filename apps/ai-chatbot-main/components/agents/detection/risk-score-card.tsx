import {
  AlertTriangle,
  Check,
  Info,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Constantes para os limiares de risco
const LOW_RISK_THRESHOLD = 25;
const MODERATE_RISK_THRESHOLD = 50;
const HIGH_RISK_THRESHOLD = 75;
const MAX_RECOMMENDATION_KEY_LENGTH = 20;

type RiskScoreBreakdown = {
  [key: string]: number;
};

type RiskScoreProps = {
  systemId: string;
  overallScore: number;
  breakdown: RiskScoreBreakdown;
  recommendations?: string[];
};

const getScoreColor = (score: number): string => {
  if (score <= LOW_RISK_THRESHOLD) {
    return "text-green-500 dark:text-green-400";
  }
  if (score <= MODERATE_RISK_THRESHOLD) {
    return "text-blue-500 dark:text-blue-400";
  }
  if (score <= HIGH_RISK_THRESHOLD) {
    return "text-yellow-500 dark:text-yellow-400";
  }
  return "text-red-500 dark:text-red-400";
};

const getProgressColor = (score: number): string => {
  if (score <= LOW_RISK_THRESHOLD) {
    return "bg-green-500";
  }
  if (score <= MODERATE_RISK_THRESHOLD) {
    return "bg-blue-500";
  }
  if (score <= HIGH_RISK_THRESHOLD) {
    return "bg-yellow-500";
  }
  return "bg-red-500";
};

const getRiskIcon = (score: number) => {
  if (score <= LOW_RISK_THRESHOLD) {
    return <ShieldCheck className="h-5 w-5 text-green-500" />;
  }
  if (score <= MODERATE_RISK_THRESHOLD) {
    return <Info className="h-5 w-5 text-blue-500" />;
  }
  if (score <= HIGH_RISK_THRESHOLD) {
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  }
  return <ShieldAlert className="h-5 w-5 text-red-500" />;
};

const formatCategoryName = (name: string): string => {
  return name
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function RiskScoreCard({
  systemId,
  overallScore,
  breakdown,
  recommendations = [],
}: RiskScoreProps): JSX.Element {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Score de Risco</CardTitle>
          <Badge className="text-xs" variant="outline">
            Sistema {systemId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {getRiskIcon(overallScore)}
            <span
              className={cn(
                "ml-2 font-bold text-2xl",
                getScoreColor(overallScore)
              )}
            >
              {overallScore}
            </span>
            <span className="ml-1 text-muted-foreground text-sm">/100</span>
          </div>
          <div className="text-sm">
            {overallScore <= LOW_RISK_THRESHOLD && "Risco Baixo"}
            {overallScore > LOW_RISK_THRESHOLD &&
              overallScore <= MODERATE_RISK_THRESHOLD &&
              "Risco Moderado Baixo"}
            {overallScore > MODERATE_RISK_THRESHOLD &&
              overallScore <= HIGH_RISK_THRESHOLD &&
              "Risco Moderado Alto"}
            {overallScore > HIGH_RISK_THRESHOLD && "Risco Alto"}
          </div>
        </div>

        <div className="mb-6 w-full">
          <Progress
            className={`h-2 [&>div]:${getProgressColor(overallScore)}`}
            max={100}
            value={overallScore}
          />
        </div>

        <div className="mb-6 space-y-3">
          <h4 className="mb-2 font-medium text-sm">
            Detalhamento por Categoria
          </h4>
          {Object.entries(breakdown).map(([category, score]) => (
            <div className="flex items-center justify-between" key={category}>
              <span className="text-sm">{formatCategoryName(category)}</span>
              <div className="flex items-center">
                <Progress
                  className={`mr-2 h-1.5 w-24 [&>div]:${getProgressColor(score)}`}
                  max={100}
                  value={score}
                />
                <span className="w-8 text-right font-medium text-sm">
                  {score}
                </span>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-sm">Recomendações</h4>
            <ul className="space-y-1">
              {recommendations.map((recommendation) => (
                <li
                  className="flex items-start text-sm"
                  key={`rec-${recommendation.substring(0, MAX_RECOMMENDATION_KEY_LENGTH)}`}
                >
                  <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
