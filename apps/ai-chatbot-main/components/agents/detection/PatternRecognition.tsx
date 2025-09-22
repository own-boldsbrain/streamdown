import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, TrendingUp, TrendingDown, AlertTriangle, Info } from "lucide-react";

type Pattern = {
  pattern_type: string;
  description: string;
  confidence: number;
};

type PatternRecognitionProps = {
  patterns: Pattern[];
  insights?: string[];
};

const getPatternIcon = (patternType: string) => {
  switch (patternType.toLowerCase()) {
    case "seasonal":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "upward_trend":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "downward_trend":
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case "anomaly":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "cyclical":
      return <BarChart3 className="h-4 w-4 text-purple-500" />;
    default:
      return <Info className="h-4 w-4 text-gray-500" />;
  }
};

const getConfidenceBadgeColor = (confidence: number) => {
  if (confidence >= 80) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  }
  if (confidence >= 60) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  }
  if (confidence >= 40) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
  }
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
};

const formatPatternType = (patternType: string) => {
  return patternType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function PatternRecognition({ patterns, insights = [] }: PatternRecognitionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Padrões de Consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-3">
          {patterns.map((pattern, index) => (
            <div 
              key={`${pattern.pattern_type}-${index}`}
              className="border flex flex-col p-3 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getPatternIcon(pattern.pattern_type)}
                  <span className="font-medium">{formatPatternType(pattern.pattern_type)}</span>
                </div>
                <Badge className={getConfidenceBadgeColor(pattern.confidence)}>
                  {pattern.confidence}% Confiança
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{pattern.description}</p>
            </div>
          ))}

          {patterns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Info className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum padrão identificado.</p>
            </div>
          )}
        </div>

        {insights && insights.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm">Insights</h4>
            <ul className="list-disc list-inside space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}