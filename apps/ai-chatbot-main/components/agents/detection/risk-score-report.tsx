import { AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Constantes
const HIGH_RISK_THRESHOLD = 80;
const MEDIUM_RISK_THRESHOLD = 60;
const MAX_RECOMMENDATION_KEY_LENGTH = 20;

type RiskScoreData = {
  risk_score: {
    system_id: string;
    overall_score: number;
    breakdown: {
      consumption_anomalies: number;
      billing_irregularities: number;
      pattern_deviations: number;
      compliance_risks: number;
    };
    recommendations: string[];
  };
};

const getRiskLevel = (score: number) => {
  if (score >= HIGH_RISK_THRESHOLD) {
    return { level: "high", color: "bg-red-500", text: "Alto Risco" };
  }
  if (score >= MEDIUM_RISK_THRESHOLD) {
    return { level: "medium", color: "bg-yellow-500", text: "Risco Médio" };
  }
  return { level: "low", color: "bg-green-500", text: "Baixo Risco" };
};

const getRiskIcon = (score: number) => {
  if (score >= HIGH_RISK_THRESHOLD) {
    return <AlertTriangle className="h-4 w-4" />;
  }
  if (score >= MEDIUM_RISK_THRESHOLD) {
    return <TrendingUp className="h-4 w-4" />;
  }
  return <Shield className="h-4 w-4" />;
};

export const RiskScoreReport = ({ data }: { data: RiskScoreData }) => {
  const { system_id, overall_score, breakdown, recommendations } =
    data.risk_score;
  const riskLevel = getRiskLevel(overall_score);

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-bold text-foreground text-lg">
          Avaliação de Risco do Sistema
        </CardTitle>
        <Badge className="text-sm" variant="outline">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-sm">Score Geral de Risco</span>
            <div className="flex items-center gap-2">
              {getRiskIcon(overall_score)}
              <span className="font-bold text-2xl">{overall_score}</span>
            </div>
          </div>
          <Progress className="h-2" value={overall_score} />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-muted-foreground text-xs">0</span>
            <Badge className={`${riskLevel.color} text-white`}>
              {riskLevel.text}
            </Badge>
            <span className="text-muted-foreground text-xs">100</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Detalhamento por Categoria</h4>
          {Object.entries(breakdown).map(([category, score]) => (
            <div className="space-y-2" key={category}>
              <div className="flex justify-between text-sm">
                <span className="capitalize">
                  {category.replace(/_/g, " ")}
                </span>
                <span className="font-medium">{score}</span>
              </div>
              <Progress className="h-1" value={score} />
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-semibold text-sm">Recomendações</h4>
            <ul className="space-y-2">
              {recommendations.map((rec) => (
                <li 
                  className="flex items-start gap-2 text-sm" 
                  key={`rec-${rec.substring(0, MAX_RECOMMENDATION_KEY_LENGTH)}`}
                >
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
