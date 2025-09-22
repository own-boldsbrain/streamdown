import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, AlertTriangle, Check, Info } from "lucide-react";
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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function RiskGauge({ systemId, overallScore, breakdown, recommendations = [] }: RiskScoreProps): JSX.Element {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Score de Risco</CardTitle>
          <Badge variant="outline" className="text-xs">
            Sistema {systemId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getRiskIcon(overallScore)}
            <span className={cn("ml-2 text-2xl font-bold", getScoreColor(overallScore))}>
              {overallScore}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">/100</span>
          </div>
          <div className="text-sm">
            {overallScore <= LOW_RISK_THRESHOLD && "Risco Baixo"}
            {overallScore > LOW_RISK_THRESHOLD && overallScore <= MODERATE_RISK_THRESHOLD && "Risco Moderado Baixo"}
            {overallScore > MODERATE_RISK_THRESHOLD && overallScore <= HIGH_RISK_THRESHOLD && "Risco Moderado Alto"}
            {overallScore > HIGH_RISK_THRESHOLD && "Risco Alto"}
          </div>
        </div>

        <div className="mb-6 w-full">
          <Progress 
            value={overallScore} 
            max={100} 
            className={cn("h-2", {
              "bg-gray-200 [&>div]:bg-green-500": overallScore <= LOW_RISK_THRESHOLD,
              "bg-gray-200 [&>div]:bg-blue-500": overallScore > LOW_RISK_THRESHOLD && overallScore <= MODERATE_RISK_THRESHOLD,
              "bg-gray-200 [&>div]:bg-yellow-500": overallScore > MODERATE_RISK_THRESHOLD && overallScore <= HIGH_RISK_THRESHOLD,
              "bg-gray-200 [&>div]:bg-red-500": overallScore > HIGH_RISK_THRESHOLD
            })}
          />
        </div>

        <div className="mb-6 space-y-3">
          <h4 className="mb-2 text-sm font-medium">Detalhamento por Categoria</h4>
          {Object.entries(breakdown).map(([category, score]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm">{formatCategoryName(category)}</span>
              <div className="flex items-center">
                <Progress 
                  value={score} 
                  max={100}
                  className={cn("h-1.5 mr-2 w-24", {
                    "bg-gray-200 [&>div]:bg-green-500": score <= LOW_RISK_THRESHOLD,
                    "bg-gray-200 [&>div]:bg-blue-500": score > LOW_RISK_THRESHOLD && score <= MODERATE_RISK_THRESHOLD,
                    "bg-gray-200 [&>div]:bg-yellow-500": score > MODERATE_RISK_THRESHOLD && score <= HIGH_RISK_THRESHOLD,
                    "bg-gray-200 [&>div]:bg-red-500": score > HIGH_RISK_THRESHOLD
                  })}
                />
                <span className="text-sm font-medium text-right w-8">{score}</span>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium">Recomendações</h4>
            <ul className="space-y-1">
              {recommendations.map((recommendation) => (
                <li 
                  key={`rec-${recommendation.substring(0, MAX_RECOMMENDATION_KEY_LENGTH)}`} 
                  className="flex items-start text-sm"
                >
                  <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
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