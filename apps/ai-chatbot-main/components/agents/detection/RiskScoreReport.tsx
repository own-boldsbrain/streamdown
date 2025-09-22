import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

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
  if (score >= 80) return { level: "high", color: "bg-red-500", text: "Alto Risco" };
  if (score >= 60) return { level: "medium", color: "bg-yellow-500", text: "Risco Médio" };
  return { level: "low", color: "bg-green-500", text: "Baixo Risco" };
};

const getRiskIcon = (score: number) => {
  if (score >= 80) return <AlertTriangle className="h-4 w-4" />;
  if (score >= 60) return <TrendingUp className="h-4 w-4" />;
  return <Shield className="h-4 w-4" />;
};

export const RiskScoreReport = ({ data }: { data: RiskScoreData }) => {
  const { system_id, overall_score, breakdown, recommendations } = data.risk_score;
  const riskLevel = getRiskLevel(overall_score);

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Avaliação de Risco do Sistema
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Score Geral de Risco</span>
            <div className="flex items-center gap-2">
              {getRiskIcon(overall_score)}
              <span className="text-2xl font-bold">{overall_score}</span>
            </div>
          </div>
          <Progress value={overall_score} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">0</span>
            <Badge className={`${riskLevel.color} text-white`}>
              {riskLevel.text}
            </Badge>
            <span className="text-xs text-muted-foreground">100</span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Detalhamento por Categoria</h4>
          {Object.entries(breakdown).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">
                  {category.replace(/_/g, " ")}
                </span>
                <span className="font-medium">{score}</span>
              </div>
              <Progress value={score} className="h-1" />
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3">Recomendações</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
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