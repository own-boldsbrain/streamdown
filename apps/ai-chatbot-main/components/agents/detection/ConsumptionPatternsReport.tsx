import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target } from "lucide-react";

type Pattern = {
  pattern_type: string;
  description: string;
  confidence: number;
};

type ConsumptionPatternsData = {
  consumption_patterns: {
    system_id: string;
    patterns_identified: Pattern[];
    insights: string[];
  };
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return "bg-green-500";
  if (confidence >= 0.6) return "bg-yellow-500";
  return "bg-red-500";
};

const getPatternIcon = (patternType: string) => {
  switch (patternType) {
    case "seasonal_variation":
      return <Calendar className="h-4 w-4" />;
    case "weekday_pattern":
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Target className="h-4 w-4" />;
  }
};

export const ConsumptionPatternsReport = ({ data }: { data: ConsumptionPatternsData }) => {
  const { system_id, patterns_identified, insights } = data.consumption_patterns;

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Padrões de Consumo Identificados
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patterns_identified.map((pattern, index) => (
            <div
              key={`${pattern.pattern_type}-${index}`}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getPatternIcon(pattern.pattern_type)}
                </div>
                <div>
                  <p className="font-semibold capitalize">
                    {pattern.pattern_type.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pattern.description}
                  </p>
                </div>
              </div>
              <Badge className={`${getConfidenceColor(pattern.confidence)} text-white`}>
                {(pattern.confidence * 100).toFixed(0)}% confiança
              </Badge>
            </div>
          ))}
        </div>

        {insights.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3">Insights e Recomendações</h4>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={`insight-${index}`} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};