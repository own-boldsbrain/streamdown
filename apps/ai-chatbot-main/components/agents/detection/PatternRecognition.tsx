import {
  AlertTriangle,
  BarChart3,
  Calendar,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Confidence threshold constants
const HIGH_CONFIDENCE = 80;
const MEDIUM_CONFIDENCE = 60;
const LOW_CONFIDENCE = 40;

// Max characters for key generation
const MAX_KEY_CHARS = 15;

type Pattern = {
  pattern_type: string;
  description: string;
  confidence: number;
  id?: string;
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
  if (confidence >= HIGH_CONFIDENCE) {
    return "bg-green-100 dark:bg-green-900/30 dark:text-green-400 text-green-800";
  }
  if (confidence >= MEDIUM_CONFIDENCE) {
    return "bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 text-blue-800";
  }
  if (confidence >= LOW_CONFIDENCE) {
    return "bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 text-yellow-800";
  }
  return "bg-red-100 dark:bg-red-900/30 dark:text-red-400 text-red-800";
};

const formatPatternType = (patternType: string) => {
  return patternType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function PatternRecognition({
  patterns,
  insights = [],
}: PatternRecognitionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Padrões de Consumo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-3">
          {patterns.map((pattern) => (
            <div
              className="flex flex-col rounded-lg border p-3"
              key={
                pattern.id || `${pattern.pattern_type}-${pattern.confidence}`
              }
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPatternIcon(pattern.pattern_type)}
                  <span className="font-medium">
                    {formatPatternType(pattern.pattern_type)}
                  </span>
                </div>
                <Badge className={getConfidenceBadgeColor(pattern.confidence)}>
                  {pattern.confidence}% Confiança
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {pattern.description}
              </p>
            </div>
          ))}

          {patterns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Info className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum padrão identificado.
              </p>
            </div>
          )}
        </div>

        {insights && insights.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium text-sm">Insights</h4>
            <ul className="list-inside list-disc space-y-1">
              {insights.map((insight, i) => (
                <li
                  className="text-sm"
                  key={`insight-${i}-${insight.substring(0, MAX_KEY_CHARS).replace(/\s/g, "-")}`}
                >
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
